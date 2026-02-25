export {};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const encoder = new TextEncoder();

const isValidEmail = (email: unknown): email is string => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const base64UrlEncodeBytes = (bytes: Uint8Array) => {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const base64UrlEncodeString = (value: string) => {
  return base64UrlEncodeBytes(encoder.encode(value));
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

const createSignedToken = async ({
  email,
  expiresAtMs,
  secret,
}: {
  email: string;
  expiresAtMs: number;
  secret: string;
}) => {
  const payload = {
    email,
    exp: expiresAtMs,
  };

  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const signature = await hmacSha256Base64Url(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

const sendMailgunEmail = async ({
  apiKey,
  domain,
  apiBase,
  from,
  replyTo,
  to,
  subject,
  html,
}: {
  apiKey: string;
  domain: string;
  apiBase: string;
  from: string;
  replyTo?: string | null;
  to: string;
  subject: string;
  html: string;
}) => {
  const form = new URLSearchParams();
  form.set('from', from);
  form.set('to', to);
  form.set('subject', subject);
  form.set('html', html);
  if (replyTo) form.set('h:Reply-To', replyTo);

  const auth = btoa(`api:${apiKey}`);
  const res = await fetch(`${apiBase.replace(/\/$/, '')}/v3/${encodeURIComponent(domain)}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: form.toString(),
  });

  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
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

  const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN');
  const mailgunApiBase = Deno.env.get('MAILGUN_API_BASE') || 'https://api.mailgun.net';
  const from = Deno.env.get('MAIL_FROM');
  const replyTo = Deno.env.get('MAIL_REPLY_TO');
  const appUrl = Deno.env.get('APP_URL');
  const hmacSecret = Deno.env.get('EARLY_ACCESS_HMAC_SECRET');

  if (!mailgunApiKey || !mailgunDomain || !from || !appUrl || !hmacSecret) {
    return new Response(
      JSON.stringify({
        error: 'Missing MAILGUN_API_KEY, MAILGUN_DOMAIN, MAIL_FROM, APP_URL, or EARLY_ACCESS_HMAC_SECRET environment variables',
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

  const email = body?.email;
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const expiresAtMs = Date.now() + 48 * 60 * 60 * 1000;
  const token = await createSignedToken({ email, expiresAtMs, secret: hmacSecret });
  const confirmUrl = `${String(appUrl).replace(/\/$/, '')}/verify-email?token=${encodeURIComponent(token)}`;

  const subject = 'Confirm your email for Inteliads beta';
  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
      <h2 style="margin:0 0 12px;">Confirm your email</h2>
      <p style="margin:0 0 12px;">Click the button below to confirm your email and reserve your beta spot.</p>
      <p style="margin:18px 0 18px;">
        <a href="${confirmUrl}" style="display:inline-block; padding:10px 14px; background:#6A00FF; color:#fff; text-decoration:none; border-radius:10px; font-weight:700;">
          Confirm my email
        </a>
      </p>
      <p style="margin:0 0 12px; font-size:12px; color:#666;">This link expires in 48 hours.</p>
      <p style="margin:24px 0 0; font-size:12px; color:#666;">If you didn't request this, you can ignore this email.</p>
    </div>
  `.trim();

  try {
    const sendRes = await sendMailgunEmail({
      apiKey: mailgunApiKey,
      domain: mailgunDomain,
      apiBase: mailgunApiBase,
      from,
      replyTo,
      to: email,
      subject,
      html,
    });

    if (!sendRes.ok) {
      return new Response(JSON.stringify({ error: 'Mailgun request failed', details: sendRes.json }), {
        status: sendRes.status || 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any)?.message || 'Request failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
