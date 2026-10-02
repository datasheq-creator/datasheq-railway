const fs = require('node:fs');
const path = require('node:path');
const sgMail = require('@sendgrid/mail');

const isProd = process.env.NODE_ENV === 'production';

/** First non-empty value among the given variable names (names are shared with the C-Legal site). */
function env(...names) {
  for (const n of names) {
    const v = (process.env[n] || '').trim();
    if (v) return v;
  }
  return '';
}

function config() {
  // Company inbox(es) that receive every request — Railway variable CONTACT_TO_EMAIL (alias: ADMIN_EMAIL).
  const to = env('CONTACT_TO_EMAIL', 'ADMIN_EMAIL')
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  return {
    apiKey: env('SENDGRID_API_KEY'),
    fromEmail: env('SENDGRID_FROM_EMAIL', 'SENDGRID_SENDER_EMAIL'),
    fromName: env('SENDGRID_FROM_NAME', 'SENDGRID_SENDER_NAME') || 'DATASHEQ',
    to,
    clientReplyTo: env('CLIENT_REPLY_TO') || to[0] || '',
    sandbox: process.env.SENDGRID_SANDBOX === 'true',
    dataResidency: env('SENDGRID_DATA_RESIDENCY').toLowerCase(), // "eu" for EU subusers
  };
}

const cfg = config();
const missing = [
  !cfg.apiKey && 'SENDGRID_API_KEY',
  !cfg.fromEmail && 'SENDGRID_FROM_EMAIL (or SENDGRID_SENDER_EMAIL)',
  !cfg.to.length && 'CONTACT_TO_EMAIL (or ADMIN_EMAIL)',
].filter(Boolean);
const configured = missing.length === 0;

if (cfg.apiKey) {
  sgMail.setApiKey(cfg.apiKey);
  sgMail.setTimeout(15000);
  if (cfg.dataResidency === 'eu') sgMail.client.setDataResidency('eu');
}

function status() {
  return { configured, missing, sandbox: cfg.sandbox, devOutbox: !configured && !isProd };
}

/** Local development without SendGrid: write emails to ./.mail-outbox so you can open them in a browser. */
function writeToOutbox(msg) {
  const dir = path.join(__dirname, '..', '.mail-outbox');
  fs.mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const slug = String(msg.subject).toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50);
  const file = path.join(dir, `${stamp}-${slug}.html`);
  const toLine = [].concat(msg.to).map((x) => (typeof x === 'string' ? x : x.email)).join(', ');
  fs.writeFileSync(file, `<!-- To: ${toLine} | Subject: ${msg.subject} -->\n${msg.html}`);
  console.log(`[mail:dev] "${msg.subject}" → ${toLine}  (saved to ${path.relative(process.cwd(), file)})`);
  return { mocked: true, file };
}

/**
 * Send one email through SendGrid.
 * @param {{to: any, subject: string, html: string, text: string, replyTo?: any, categories?: string[]}} msg
 */
async function send(msg) {
  if (!configured) {
    if (!isProd) return writeToOutbox(msg);
    throw new Error(`SendGrid not configured. Missing: ${missing.join(', ')}`);
  }
  const payload = {
    ...msg,
    from: { email: cfg.fromEmail, name: cfg.fromName },
    mailSettings: { sandboxMode: { enable: cfg.sandbox } },
    trackingSettings: { clickTracking: { enable: false, enableText: false } },
  };
  const [res] = await sgMail.send(payload);
  return { statusCode: res?.statusCode };
}

/** Readable error for logs (SendGrid puts the useful part in response.body.errors). */
function describeError(err) {
  const details = err?.response?.body?.errors;
  if (Array.isArray(details) && details.length) {
    return details.map((d) => `${d.message}${d.field ? ` (${d.field})` : ''}`).join('; ');
  }
  return err?.message || String(err);
}

module.exports = { send, status, describeError, config: cfg };
