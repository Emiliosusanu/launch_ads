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

const escapeHtml = (value) => {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
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

const buildEmail = ({ type, to, data, appUrl }) => {
  const safeAppUrl = typeof appUrl === 'string' && appUrl.length ? appUrl : '';

  if (type === 'early_access_confirmation') {
    return {
      to,
      subject: 'Early access request received',
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.6; color: #111;">
          <h2 style="margin:0 0 12px;">You're on the list</h2>
          <p style="margin:0 0 12px;">We received your request for early access. We'll email you once your access is approved.</p>
          ${safeAppUrl ? `<p style="margin:0 0 12px;"><a href="${safeAppUrl}/login">Login</a></p>` : ''}
          <p style="margin:24px 0 0; font-size:12px; color:#666;">If you didn't request this, you can ignore this email.</p>
        </div>
      `.trim(),
    };
  }

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

  const apiKey = process.env.MAILERSEND_API_TOKEN;
  const from = process.env.MAIL_FROM;
  const replyTo = process.env.MAIL_REPLY_TO;
  const appUrl = process.env.APP_URL;

  if (!apiKey || !from) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        error: 'Missing MAILERSEND_API_TOKEN or MAIL_FROM environment variables',
      })
    );
    return;
  }

  const body = await readJsonBody(req);
  const type = body?.type;
  const to = body?.to;

  if (typeof type !== 'string' || !type.length) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing type' }));
    return;
  }

  if (!isValidEmail(to)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid recipient email' }));
    return;
  }

  const email = buildEmail({ type, to, data: body?.data, appUrl });

  if (!email) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Unsupported email type' }));
    return;
  }

  try {
    const parsedFrom = parseMailbox(from);
    const parsedReplyTo = replyTo ? parseMailbox(replyTo) : null;

    const payload = {
      from: {
        email: parsedFrom.email,
        ...(parsedFrom.name ? { name: parsedFrom.name } : {}),
      },
      to: [{ email: email.to }],
      subject: email.subject,
      html: email.html,
      ...(parsedReplyTo?.email
        ? {
            reply_to: {
              email: parsedReplyTo.email,
              ...(parsedReplyTo.name ? { name: parsedReplyTo.name } : {}),
            },
          }
        : {}),
    };

    const mailerSendRes = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const mailerSendJson = await mailerSendRes.json().catch(() => null);

    if (!mailerSendRes.ok) {
      res.statusCode = mailerSendRes.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'MailerSend request failed', details: mailerSendJson }));
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, details: mailerSendJson }));
  } catch (err) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: err?.message || 'Email send failed' }));
  }
}
