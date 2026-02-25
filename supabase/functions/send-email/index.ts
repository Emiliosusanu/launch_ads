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

const isValidEmail = (email: unknown): email is string => {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const escapeHtml = (value: unknown) => {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
};

const parseMailbox = (value: string | null) => {
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

  const json = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, json };
};

const sendMailerSendEmail = async ({
  apiToken,
  from,
  replyTo,
  to,
  subject,
  html,
}: {
  apiToken: string;
  from: string;
  replyTo?: string | null;
  to: string;
  subject: string;
  html: string;
}) => {
  const parsedFrom = parseMailbox(from);
  const parsedReplyTo = replyTo ? parseMailbox(replyTo) : null;

  const payload: Record<string, unknown> = {
    from: {
      email: parsedFrom.email,
      ...(parsedFrom.name ? { name: parsedFrom.name } : {}),
    },
    to: [{ email: to }],
    subject,
    html,
  };

  if (parsedReplyTo?.email) {
    payload.reply_to = {
      email: parsedReplyTo.email,
      ...(parsedReplyTo.name ? { name: parsedReplyTo.name } : {}),
    };
  }

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

const buildEmail = ({
  type,
  to,
  data,
  appUrl,
}: {
  type: string;
  to: string;
  data: any;
  appUrl: string;
}) => {
  const safeAppUrl = typeof appUrl === 'string' && appUrl.length ? appUrl : '';

  if (type === 'user_chat_message') {
    const message = typeof data?.message === 'string' ? data.message : '';
    const senderEmail = typeof data?.sender_email === 'string' ? data.sender_email : '';
    const preview = message.length > 240 ? message.slice(0, 240) + '…' : message;

    return {
      to,
      subject: 'New user message',
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
          <h2 style="margin:0 0 12px;">New message</h2>
          ${senderEmail ? `<p style="margin:0 0 12px;">From: <b>${escapeHtml(senderEmail)}</b></p>` : ''}
          <div style="margin:0 0 12px; padding:12px; border:1px solid #e5e7eb; border-radius:10px; background:#fafafa; white-space:pre-wrap;">${escapeHtml(preview)}</div>
          ${safeAppUrl ? `<p style="margin:0 0 12px;"><a href="${safeAppUrl}/admin/dashboard">Open admin dashboard</a></p>` : ''}
        </div>
      `.trim(),
    };
  }

  if (type === 'approval_status') {
    const status = typeof data?.status === 'string' ? data.status : '';
    const normalized = status.toLowerCase();

    if (normalized === 'approved') {
      return {
        to,
        subject: 'Your access has been approved',
        html: `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
            <h2 style="margin:0 0 12px;">Approved</h2>
            <p style="margin:0 0 12px;">Good news — your beta access has been approved.</p>
            ${safeAppUrl ? `<p style="margin:0 0 12px;"><a href="${safeAppUrl}/login">Open your dashboard</a></p>` : ''}
          </div>
        `.trim(),
      };
    }

    if (normalized === 'rejected') {
      return {
        to,
        subject: 'Update on your early access request',
        html: `
          <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
            <h2 style="margin:0 0 12px;">Status update</h2>
            <p style="margin:0 0 12px;">Thanks for your interest. At this time, we can't grant beta access for your account.</p>
            <p style="margin:0 0 12px;">You can reply to this email if you think this is a mistake.</p>
          </div>
        `.trim(),
      };
    }

    return {
      to,
      subject: 'Update on your account status',
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
          <p style="margin:0 0 12px;">Your status was updated to: <b>${escapeHtml(status || 'pending')}</b>.</p>
        </div>
      `.trim(),
    };
  }

  if (type === 'admin_chat_message') {
    const message = typeof data?.message === 'string' ? data.message : '';
    const preview = message.length > 240 ? message.slice(0, 240) + '…' : message;

    return {
      to,
      subject: 'New message from support',
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
          <h2 style="margin:0 0 12px;">You have a new message</h2>
          <div style="margin:0 0 12px; padding:12px; border:1px solid #e5e7eb; border-radius:10px; background:#fafafa; white-space:pre-wrap;">${escapeHtml(preview)}</div>
          ${safeAppUrl ? `<p style="margin:0 0 12px;"><a href="${safeAppUrl}/login">Reply in your dashboard</a></p>` : ''}
        </div>
      `.trim(),
    };
  }

  return null;
};

const ensureAllowedRecipient = async ({
  type,
  to,
  data,
  supabaseUrl,
  serviceRoleKey,
  supportFallbackEmail,
}: {
  type: string;
  to: string;
  data: any;
  supabaseUrl: string;
  serviceRoleKey: string;
  supportFallbackEmail: string;
}) => {
  if (type === 'user_chat_message') {
    const senderEmail = data?.sender_email;
    if (!isValidEmail(senderEmail)) return { ok: false, error: 'Invalid sender_email' };

    const senderLookup = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: `/rest/v1/ADSPILOT_name?email=eq.${encodeURIComponent(senderEmail)}&select=id,email&limit=1`,
      method: 'GET',
    });

    const senderExists = senderLookup.ok && Array.isArray(senderLookup.json) && senderLookup.json[0]?.id;
    if (!senderExists) return { ok: false, error: 'Unknown sender' };

    if (to === supportFallbackEmail) return { ok: true };

    const adminLookup = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: `/rest/v1/ADSPILOT_name?email=eq.${encodeURIComponent(to)}&is_admin=eq.true&select=id,email&limit=1`,
      method: 'GET',
    });

    const isAdmin = adminLookup.ok && Array.isArray(adminLookup.json) && adminLookup.json[0]?.id;
    if (!isAdmin) return { ok: false, error: 'Recipient not allowed' };

    return { ok: true };
  }

  if (type === 'admin_chat_message' || type === 'approval_status') {
    const userLookup = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: `/rest/v1/ADSPILOT_name?email=eq.${encodeURIComponent(to)}&select=id,email&limit=1`,
      method: 'GET',
    });

    const exists = userLookup.ok && Array.isArray(userLookup.json) && userLookup.json[0]?.id;
    if (!exists) return { ok: false, error: 'Recipient not found' };

    return { ok: true };
  }

  return { ok: false, error: 'Unsupported email type' };
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

  const apiToken = Deno.env.get('MAILERSEND_API_TOKEN');
  const from = Deno.env.get('MAIL_FROM');
  const replyTo = Deno.env.get('MAIL_REPLY_TO');
  const appUrl = Deno.env.get('APP_URL') || '';

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const supportFallbackEmail = Deno.env.get('SUPPORT_FALLBACK_EMAIL') || 'support@inteliads.pro';

  if (!apiToken || !from || !supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({
        error: 'Missing MAILERSEND_API_TOKEN, MAIL_FROM, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY environment variables',
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

  const type = body?.type;
  const to = body?.to;

  if (typeof type !== 'string' || !type.length) {
    return new Response(JSON.stringify({ error: 'Missing type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!isValidEmail(to)) {
    return new Response(JSON.stringify({ error: 'Invalid recipient email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const allowed = await ensureAllowedRecipient({
    type,
    to,
    data: body?.data,
    supabaseUrl,
    serviceRoleKey,
    supportFallbackEmail,
  });

  if (!allowed.ok) {
    return new Response(JSON.stringify({ error: allowed.error || 'Not allowed' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const email = buildEmail({ type, to, data: body?.data, appUrl });
  if (!email) {
    return new Response(JSON.stringify({ error: 'Unsupported email type' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const sendRes = await sendMailerSendEmail({
      apiToken,
      from,
      replyTo,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });

    if (!sendRes.ok) {
      return new Response(JSON.stringify({ error: 'MailerSend request failed', details: sendRes.json }), {
        status: sendRes.status || 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, details: sendRes.json }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as any)?.message || 'Email send failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
