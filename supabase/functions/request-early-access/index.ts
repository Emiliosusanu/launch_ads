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

const replaceBrand = (value: string | undefined) => {
  if (typeof value !== 'string') return value;
  return value.replace(/KDPInsights/gi, 'Inteliads');
};

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

  const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN_WAITLIST') || Deno.env.get('MAILGUN_DOMAIN');
  const mailgunApiBase = Deno.env.get('MAILGUN_API_BASE') || 'https://api.mailgun.net';
  const from = replaceBrand(
    Deno.env.get('MAILGUN_FROM_WAITLIST') || Deno.env.get('MAIL_FROM') || Deno.env.get('MAILGUN_FROM')
  );
  const replyTo = replaceBrand(
    Deno.env.get('MAILGUN_REPLY_TO_WAITLIST') || Deno.env.get('MAIL_REPLY_TO') || Deno.env.get('MAILGUN_REPLY_TO')
  );
  const appUrl = Deno.env.get('APP_URL');
  const hmacSecret = Deno.env.get('EARLY_ACCESS_HMAC_SECRET');

  if (!mailgunApiKey || !mailgunDomain || !from || !appUrl || !hmacSecret) {
    return new Response(
      JSON.stringify({
        error:
          'Missing MAILGUN_API_KEY, MAILGUN_DOMAIN (or MAILGUN_DOMAIN_WAITLIST), MAIL_FROM (or MAILGUN_FROM / MAILGUN_FROM_WAITLIST), APP_URL, or EARLY_ACCESS_HMAC_SECRET environment variables',
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

  const subject = 'Confirm your email for the Inteliads waitlist';
  const html = `
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      Confirm your email to join the Inteliads waitlist.
    </div>

    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#0b0b10; margin:0; padding:0; width:100%;">
      <tr>
        <td align="center" style="padding:32px 14px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="560" style="width:560px; max-width:560px;">
            <tr>
              <td style="padding:0 0 12px;">
                <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-size:14px; color:#a1a1aa; letter-spacing:0.08em; text-transform:uppercase;">
                  Inteliads
                </div>
              </td>
            </tr>

            <tr>
              <td style="background: linear-gradient(135deg, rgba(106,0,255,0.25), rgba(255,90,0,0.18)); border-radius:20px; padding:1px;">
                <div style="background:#111118; border-radius:19px; padding:28px 22px; border:1px solid rgba(255,255,255,0.06);">
                  <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:#ffffff;">
                    <h1 style="margin:0 0 10px; font-size:28px; line-height:1.2; font-weight:800; letter-spacing:-0.02em;">
                      Confirm your email
                    </h1>

                    <p style="margin:0 0 14px; font-size:15px; line-height:1.6; color:#d4d4d8;">
                      Hey — <b style="color:#ffffff;">The Royaltix Team</b> here (founders of Inteliads). Please confirm your email address so we know we can reach you.
                    </p>

                    <p style="margin:0 0 18px; font-size:15px; line-height:1.6; color:#d4d4d8;">
                      After confirmation, you’ll be on the waitlist. Final access is granted after admin approval.
                    </p>

                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
                      <tr>
                        <td align="center" style="border-radius:12px; background:#ff5a00;">
                          <a href="${confirmUrl}" style="display:inline-block; padding:12px 16px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-weight:800; font-size:14px; color:#0b0b10; text-decoration:none; border-radius:12px;">
                            Confirm email address
                          </a>
                        </td>
                      </tr>
                    </table>

                    <div style="margin:0 0 18px; padding:14px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.06); border-radius:14px;">
                      <div style="font-size:13px; color:#a1a1aa; line-height:1.6;">
                        If the button doesn't work, copy and paste this link into your browser:
                        <br />
                        <a href="${confirmUrl}" style="color:#c4b5fd; word-break:break-all;">${confirmUrl}</a>
                      </div>
                    </div>

                    <p style="margin:0; font-size:12px; color:#a1a1aa; line-height:1.6;">
                      This link expires in 48 hours. If you didn't request this, you can safely ignore this email.
                    </p>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:14px 6px 0;">
                <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; font-size:12px; color:#71717a; line-height:1.6; text-align:center;">
                  © ${new Date().getFullYear()} Inteliads
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
      return new Response(
        JSON.stringify({
          error: 'Mailgun request failed',
          details: {
            status: sendRes.status,
            json: sendRes.json,
            text: sendRes.text,
          },
        }),
        {
        status: sendRes.status || 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
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
