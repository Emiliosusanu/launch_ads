export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const safeEqual = (a: string, b: string) => {
  const aa = encoder.encode(a);
  const bb = encoder.encode(b);
  if (aa.length !== bb.length) return false;
  let diff = 0;
  for (let i = 0; i < aa.length; i += 1) diff |= aa[i] ^ bb[i];
  return diff === 0;
};

const base64UrlToBytes = (value: string) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLen);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const base64UrlEncodeBytes = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const hmacSha256Base64Url = async (value: string, secret: string) => {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const sigBuf = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return base64UrlEncodeBytes(new Uint8Array(sigBuf));
};

const parseToken = async (token: string, secret: string) => {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  const expectedSig = await hmacSha256Base64Url(payloadB64, secret);
  if (!safeEqual(sig, expectedSig)) return null;

  let payload: any = null;
  try {
    payload = JSON.parse(decoder.decode(base64UrlToBytes(payloadB64)));
  } catch {
    payload = null;
  }

  const email = payload?.email;
  const exp = payload?.exp;

  if (typeof email !== 'string' || !email.length) return null;
  if (typeof exp !== 'number') return null;
  if (Date.now() > exp) return { email, expired: true };

  return { email, expired: false };
};

const isValidEmail = (email: unknown): email is string => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const supabaseFetch = async ({
  supabaseUrl,
  serviceRoleKey,
  path,
  method,
  body,
  preferReturn,
}: {
  supabaseUrl: string;
  serviceRoleKey: string;
  path: string;
  method: string;
  body?: unknown;
  preferReturn?: 'representation' | 'minimal';
}) => {
  const headers: Record<string, string> = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  if (preferReturn) headers.Prefer = `return=${preferReturn}`;

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}${path}`, {
    method,
    headers,
    ...(typeof body === 'undefined' ? {} : { body: JSON.stringify(body) }),
  });

  const text = await res.text().catch(() => '');
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { ok: res.ok, status: res.status, json, text };
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const hmacSecret = Deno.env.get('EARLY_ACCESS_HMAC_SECRET');

  if (!supabaseUrl || !serviceRoleKey || !hmacSecret) {
    return new Response(
      JSON.stringify({
        error: 'Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or EARLY_ACCESS_HMAC_SECRET environment variables',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const token = body?.token;
  if (typeof token !== 'string' || !token.length) {
    return new Response(JSON.stringify({ error: 'Missing token' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const parsed = await parseToken(token, hmacSecret);
  if (!parsed) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (parsed.expired) {
    return new Response(JSON.stringify({ error: 'Token expired' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = parsed.email;
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const lookup = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: `/rest/v1/ADSPILOT_name?email=eq.${encodeURIComponent(email)}&select=id,email,beta_status&limit=1`,
      method: 'GET',
    });

    if (!lookup.ok) {
      return new Response(
        JSON.stringify({
          error: 'Database lookup failed',
          details: {
            status: lookup.status,
            json: lookup.json,
            text: lookup.text,
          },
        }),
        {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const existing = Array.isArray(lookup.json) ? lookup.json[0] : null;

    if (existing?.id) {
      if (String(existing.beta_status || '').toLowerCase() === 'confirmed') {
        return new Response(JSON.stringify({ ok: true, status: 'already_confirmed' }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const update = await supabaseFetch({
        supabaseUrl,
        serviceRoleKey,
        path: `/rest/v1/ADSPILOT_name?id=eq.${encodeURIComponent(String(existing.id))}`,
        method: 'PATCH',
        body: { beta_status: 'confirmed' },
        preferReturn: 'minimal',
      });

      if (!update.ok) {
        return new Response(
          JSON.stringify({
            error: 'Failed to confirm spot',
            details: {
              status: update.status,
              json: update.json,
              text: update.text,
            },
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(JSON.stringify({ ok: true, status: 'confirmed' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const insert = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: '/rest/v1/ADSPILOT_name',
      method: 'POST',
      body: [{ email, beta_status: 'confirmed' }],
      preferReturn: 'minimal',
    });

    if (!insert.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to reserve spot',
          details: {
            status: insert.status,
            json: insert.json,
            text: insert.text,
          },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, status: 'confirmed' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any)?.message || 'Confirmation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
