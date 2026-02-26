export {};

declare const Deno: {
  env: { get: (key: string) => string | undefined };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-key',
};

const replaceBrand = (value: string | undefined) => {
  if (typeof value !== 'string') return value;
  return value.replace(/KDPInsights/gi, 'Inteliads');
};

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
  from: string;
  apiKey: string;
  domain: string;
  apiBase: string;
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

const normalizeEmailList = (raw: unknown) => {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const v of raw) {
    if (!isValidEmail(v)) continue;
    out.push(String(v).trim().toLowerCase());
  }
  return Array.from(new Set(out));
};

const looksLikeHtml = (value: string) => {
  return /<\s*\w+[^>]*>/.test(value);
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

  const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
  const mailgunDomain =
    Deno.env.get('MAILGUN_DOMAIN_TRANSACTIONAL') ||
    Deno.env.get('MAILGUN_DOMAIN') ||
    Deno.env.get('MAILGUN_DOMAIN_WAITLIST');
  const mailgunApiBase = Deno.env.get('MAILGUN_API_BASE') || 'https://api.mailgun.net';
  const from = replaceBrand(
    Deno.env.get('MAILGUN_FROM_TRANSACTIONAL') ||
      Deno.env.get('MAIL_FROM') ||
      Deno.env.get('MAILGUN_FROM') ||
      Deno.env.get('MAILGUN_FROM_WAITLIST')
  );
  const replyTo = replaceBrand(
    Deno.env.get('MAILGUN_REPLY_TO_TRANSACTIONAL') ||
      Deno.env.get('MAIL_REPLY_TO') ||
      Deno.env.get('MAILGUN_REPLY_TO') ||
      Deno.env.get('MAILGUN_REPLY_TO_WAITLIST')
  );

  if (!supabaseUrl || !serviceRoleKey || !mailgunApiKey || !mailgunDomain || !from) {
    return new Response(
      JSON.stringify({
        error:
          'Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MAILGUN_API_KEY, MAILGUN_DOMAIN (or MAILGUN_DOMAIN_TRANSACTIONAL / MAILGUN_DOMAIN_WAITLIST), or MAIL_FROM (or MAILGUN_FROM / MAILGUN_FROM_TRANSACTIONAL / MAILGUN_FROM_WAITLIST)',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  const adminKeyEnv = Deno.env.get('ADMIN_BULK_EMAIL_KEY');
  const adminKeyHeader = req.headers.get('x-admin-key') || '';
  if (!adminKeyEnv) {
    return new Response(JSON.stringify({ error: 'Missing ADMIN_BULK_EMAIL_KEY secret' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (adminKeyHeader !== adminKeyEnv) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const adminEmail = body?.admin_email;
  const target = body?.target;
  const subject = body?.subject;
  const content = body?.html;
  const markContacted = body?.mark_contacted !== false;

  if (!isValidEmail(adminEmail)) {
    return new Response(JSON.stringify({ error: 'Invalid admin_email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (typeof subject !== 'string' || !subject.trim()) {
    return new Response(JSON.stringify({ error: 'Missing subject' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (typeof content !== 'string' || !content.trim()) {
    return new Response(JSON.stringify({ error: 'Missing html' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (target !== 'all_confirmed' && target !== 'all' && target !== 'pasted') {
    return new Response(JSON.stringify({ error: 'Invalid target' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const adminLookup = await supabaseFetch({
    supabaseUrl,
    serviceRoleKey,
    path: `/rest/v1/ADSPILOT_name?email=eq.${encodeURIComponent(String(adminEmail))}&is_admin=eq.true&select=id,email&limit=1`,
    method: 'GET',
  });

  const isAdmin = adminLookup.ok && Array.isArray(adminLookup.json) && adminLookup.json[0]?.id;
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let recipients: string[] = [];

  if (target === 'pasted') {
    recipients = normalizeEmailList(body?.emails);
    if (!recipients.length) {
      return new Response(JSON.stringify({ error: 'No valid emails provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  if (target === 'all_confirmed' || target === 'all') {
    const query =
      target === 'all_confirmed'
        ? '/rest/v1/ADSPILOT_name?select=email&is_admin=eq.false&beta_status=eq.confirmed'
        : '/rest/v1/ADSPILOT_name?select=email&is_admin=eq.false';

    const lookup = await supabaseFetch({
      supabaseUrl,
      serviceRoleKey,
      path: query,
      method: 'GET',
    });

    if (!lookup.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to load recipients',
          details: { status: lookup.status, json: lookup.json, text: lookup.text },
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const loaded = Array.isArray(lookup.json)
      ? lookup.json
          .map((r: any) => (typeof r?.email === 'string' ? r.email.trim().toLowerCase() : ''))
          .filter((e: string) => isValidEmail(e))
      : [];

    recipients = Array.from(new Set(loaded));
  }

  if (!recipients.length) {
    return new Response(JSON.stringify({ error: 'No recipients found' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const html = looksLikeHtml(content)
    ? content
    : `<div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111; white-space: pre-wrap;">${escapeHtml(
        content
      )}</div>`;

  const subjectFinal = replaceBrand(subject.trim()) || subject.trim();

  const failures: Array<{ email: string; status?: number; error: string; details?: any }> = [];
  const successes: string[] = [];

  const concurrency = 5;
  let idx = 0;

  const workers = Array.from({ length: Math.min(concurrency, recipients.length) }).map(async () => {
    while (idx < recipients.length) {
      const i = idx;
      idx += 1;
      const to = recipients[i];

      const res = await sendMailgunEmail({
        apiKey: mailgunApiKey,
        domain: mailgunDomain,
        apiBase: mailgunApiBase,
        from: from as string,
        replyTo: replyTo || null,
        to,
        subject: subjectFinal,
        html,
      });

      if (!res.ok) {
        failures.push({
          email: to,
          status: res.status,
          error: 'Mailgun send failed',
          details: { json: res.json, text: res.text },
        });
      } else {
        successes.push(to);
      }
    }
  });

  await Promise.all(workers);

  if (markContacted && successes.length) {
    // Best-effort: mark email_sent=true for recipients that exist in ADSPILOT_name.
    const chunkSize = 50;
    for (let start = 0; start < successes.length; start += chunkSize) {
      const chunk = successes.slice(start, start + chunkSize);

      const inList = chunk.map((e) => `"${String(e).replaceAll('"', '')}"`).join(',');
      const emailFilter = `in.(${inList})`;

      await supabaseFetch({
        supabaseUrl,
        serviceRoleKey,
        path: `/rest/v1/ADSPILOT_name?is_admin=eq.false&email=${encodeURIComponent(emailFilter)}`,
        method: 'PATCH',
        body: { email_sent: true },
        preferReturn: 'minimal',
      }).catch(() => {
        // ignore
      });
    }
  }

  return new Response(
    JSON.stringify({
      ok: failures.length === 0,
      target,
      recipients: recipients.length,
      sent: successes.length,
      failed: failures.length,
      failures: failures.slice(0, 50),
      admin_key_required: Boolean(adminKeyEnv),
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
});
