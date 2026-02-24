import crypto from 'crypto';

export const config = {
  runtime: 'nodejs',
};

const readJsonBody = async (req) => {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const base64UrlEncode = (input) => {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(String(input), 'utf8');
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const hmacSha256Base64Url = (value, secret) => {
  const digest = crypto.createHmac('sha256', secret).update(value).digest();
  return base64UrlEncode(digest);
};

const createSignedToken = ({ email, expiresAtMs, secret }) => {
  const payload = {
    email,
    exp: expiresAtMs,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = hmacSha256Base64Url(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
};

const parseMailbox = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return { email: '', name: '' };

  if (raw.includes('<') && raw.includes('>')) {
    const [namePart, emailPartRaw] = raw.split('<');
    const name = (namePart || '').trim().replace(/"/g, '');
    const email = String(emailPartRaw || '').replace('>', '').trim();
    return { email, name };
  }

  return { email: raw, name: '' };
};

const sendMailerSendEmail = async ({ apiToken, from, replyTo, to, subject, html }) => {
  const parsedFrom = parseMailbox(from);
  const parsedReplyTo = replyTo ? parseMailbox(replyTo) : null;

  const payload = {
    from: {
      email: parsedFrom.email,
      ...(parsedFrom.name ? { name: parsedFrom.name } : {}),
    },
    to: [{ email: to }],
    subject,
    html,
    ...(parsedReplyTo?.email
      ? {
          reply_to: {
            email: parsedReplyTo.email,
            ...(parsedReplyTo.name ? { name: parsedReplyTo.name } : {}),
          },
        }
      : {}),
  };

  const res = await fetch('https://api.mailersend.com/v1/email', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  const apiToken = process.env.MAILERSEND_API_TOKEN;
  const from = process.env.MAIL_FROM;
  const replyTo = process.env.MAIL_REPLY_TO;
  const appUrl = process.env.APP_URL;
  const hmacSecret = process.env.EARLY_ACCESS_HMAC_SECRET;

  if (!apiToken || !from || !appUrl || !hmacSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Missing MAILERSEND_API_TOKEN, MAIL_FROM, APP_URL, or EARLY_ACCESS_HMAC_SECRET environment variables',
      })
    );
    return;
  }

  const body = await readJsonBody(req);
  const email = body?.email;

  if (!isValidEmail(email)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid email' }));
    return;
  }

  const expiresAtMs = Date.now() + 48 * 60 * 60 * 1000;
  const token = createSignedToken({ email, expiresAtMs, secret: hmacSecret });
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
    const sendRes = await sendMailerSendEmail({
      apiToken,
      from,
      replyTo,
      to: email,
      subject,
      html,
    });

    if (!sendRes.ok) {
      res.statusCode = sendRes.status || 502;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'MailerSend request failed', details: sendRes.json }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Request failed' }));
  }
}
