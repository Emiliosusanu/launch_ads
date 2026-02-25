import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

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

const base64UrlDecodeToString = (value) => {
  const normalized = String(value)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + '='.repeat(padLen);
  return Buffer.from(padded, 'base64').toString('utf8');
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

const safeEqual = (a, b) => {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
};

const parseToken = ({ token, secret }) => {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return null;

  const expectedSig = hmacSha256Base64Url(payloadB64, secret);
  if (!safeEqual(sig, expectedSig)) return null;

  let payload;
  try {
    payload = JSON.parse(base64UrlDecodeToString(payloadB64));
  } catch {
    return null;
  }

  const email = payload?.email;
  const exp = payload?.exp;

  if (typeof email !== 'string' || !email.length) return null;
  if (typeof exp !== 'number') return null;
  if (Date.now() > exp) return { email, expired: true };

  return { email, expired: false };
};

const isValidEmail = (email) => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  res.statusCode = 410;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'This endpoint has moved to Supabase Edge Functions' }));
  return;

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hmacSecret = process.env.EARLY_ACCESS_HMAC_SECRET;

  if (!supabaseUrl || !serviceRoleKey || !hmacSecret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or EARLY_ACCESS_HMAC_SECRET environment variables',
      })
    );
    return;
  }

  const body = await readJsonBody(req);
  const token = body?.token;

  if (typeof token !== 'string' || !token.length) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing token' }));
    return;
  }

  const parsed = parseToken({ token, secret: hmacSecret });
  if (!parsed) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid token' }));
    return;
  }

  if (parsed.expired) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Token expired' }));
    return;
  }

  const email = parsed.email;
  if (!isValidEmail(email)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid email' }));
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  try {
    const { data: existing, error: existingError } = await supabase
      .from('ADSPILOT_name')
      .select('id, email')
      .eq('email', email)
      .limit(1)
      .maybeSingle();

    if (existingError) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Database lookup failed' }));
      return;
    }

    if (existing) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, status: 'already_confirmed' }));
      return;
    }

    const { error: insertError } = await supabase.from('ADSPILOT_name').insert([{ email }]);

    if (insertError) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Failed to reserve spot' }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, status: 'confirmed' }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Confirmation failed' }));
  }
}
