// Load .env in local development (Railway injects variables directly)
try {
  process.loadEnvFile?.();
} catch {
  /* no .env file — fine */
}

const path = require('node:path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');
const QRCode = require('qrcode');

const pkg = require('./package.json');
const content = require('./src/content');
const { translator } = require('./src/i18n');
const { renderPage } = require('./src/views/page');
const { validateLead } = require('./src/validate');
const mailer = require('./src/mailer');
const { renderInternalNotification } = require('./src/emails/internalNotification');
const { renderClientConfirmation } = require('./src/emails/clientConfirmation');

const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.set('trust proxy', 1); // Railway sits behind a proxy → real client IP / https
app.disable('x-powered-by');

/* ───────── Security & performance ───────── */
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'font-src': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'connect-src': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': isProd ? [] : null,
      },
    },
    // images (e.g. the logo used in emails) must be loadable from other origins
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    strictTransportSecurity: isProd ? undefined : false,
  })
);
app.use(compression());

/* ───────── Helpers ───────── */
function baseUrlFrom(req) {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/+$/, '');
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  return `${req.protocol}://${req.get('host')}`;
}

const pageCache = new Map();
function sendPage(lang) {
  return (req, res) => {
    const baseUrl = baseUrlFrom(req);
    const key = `${lang}|${baseUrl}`;
    if (!pageCache.has(key) || !isProd) {
      if (pageCache.size > 20) pageCache.clear(); // bounded (Host header varies only if no PUBLIC_BASE_URL)
      pageCache.set(key, renderPage({ lang, baseUrl, version: pkg.version }));
    }
    res.set('Cache-Control', 'no-cache');
    res.type('html').send(pageCache.get(key));
  };
}

/* ───────── Pages ───────── */
app.get('/', sendPage('es'));
app.get('/en', sendPage('en'));
app.get(['/es', '/es/'], (req, res) => res.redirect(301, '/'));
app.get('/en/', (req, res) => res.redirect(301, '/en'));

app.get('/healthz', (req, res) => {
  const mail = mailer.status();
  res.json({ status: 'ok', version: pkg.version, mail: { configured: mail.configured, sandbox: mail.sandbox } });
});

/** QR target: sends phones to the right store (falls back to the app section). */
app.get('/app', (req, res) => {
  const ua = req.get('user-agent') || '';
  const { googlePlayUrl, appStoreUrl } = content.settings.app;
  if (/android/i.test(ua) && googlePlayUrl) return res.redirect(302, googlePlayUrl);
  if (/iphone|ipad|ipod/i.test(ua) && appStoreUrl) return res.redirect(302, appStoreUrl);
  if (googlePlayUrl && !appStoreUrl) return res.redirect(302, googlePlayUrl);
  if (appStoreUrl && !googlePlayUrl) return res.redirect(302, appStoreUrl);
  return res.redirect(302, '/#app');
});

const qrCache = new Map();
app.get('/qr.svg', async (req, res, next) => {
  try {
    const target = `${baseUrlFrom(req)}/app`;
    if (!qrCache.has(target)) {
      if (qrCache.size > 20) qrCache.clear();
      qrCache.set(
        target,
        await QRCode.toString(target, {
          type: 'svg',
          margin: 0,
          errorCorrectionLevel: 'M',
          color: { dark: '#141A33', light: '#FFFFFF' },
        })
      );
    }
    res.set('Cache-Control', 'public, max-age=86400');
    res.type('image/svg+xml').send(qrCache.get(target));
  } catch (err) {
    next(err);
  }
});

/* ───────── Static files ───────── */
app.use(
  express.static(path.join(__dirname, 'public'), {
    index: false,
    maxAge: isProd ? '7d' : 0,
    setHeaders(res, filePath) {
      if (filePath.includes(`${path.sep}fonts${path.sep}`)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })
);

/* ───────── Contact API ───────── */
const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: Number(process.env.CONTACT_RATE_LIMIT) || 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipFailedRequests: true, // only successful submissions count (validation errors don't lock users out)
  handler: (req, res) => res.status(429).json({ ok: false, error: 'rate_limited' }),
});

const parseBody = [express.json({ limit: '20kb' }), express.urlencoded({ extended: false, limit: '20kb' })];

/** Reply as JSON (fetch) or as a small HTML page (form posted without JavaScript). */
function reply(req, res, status, body, lang = 'es') {
  if (req.is('application/json') || req.accepts(['html', 'json']) === 'json') {
    return res.status(status).json(body);
  }
  const t = translator(lang);
  const ok = body.ok;
  const back = lang === 'en' ? '/en#contacto' : '/#contacto';
  const msg = ok ? t('ok_text') : status === 400 ? t('err_fix') : t('err_generic');
  return res
    .status(status)
    .type('html')
    .send(
      `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DATASHEQ</title><link rel="stylesheet" href="/css/styles.css"></head><body><main class="container section"><h1>${ok ? '✓' : '!'}</h1><p class="lead">${msg}</p><p><a class="btn btn-primary" href="${back}">← DATASHEQ</a></p></main></body></html>`
    );
}

app.post('/api/contact', contactLimiter, parseBody, async (req, res) => {
  const { lead, errors, spam } = validateLead(req.body || {});

  if (spam) {
    console.warn(`[contact] spam discarded from ${req.ip}`);
    return reply(req, res, 200, { ok: true }, lead.lang); // don't tell bots they were caught
  }
  if (Object.keys(errors).length) {
    return reply(req, res, 400, { ok: false, errors }, lead.lang);
  }

  const baseUrl = baseUrlFrom(req);
  const meta = { ip: req.ip, userAgent: req.get('user-agent'), receivedAt: new Date(), baseUrl };

  // 1) Notify the DATASHEQ team — if this fails, the request fails.
  try {
    const internal = renderInternalNotification({ lead, meta });
    await mailer.send({
      to: mailer.config.to,
      replyTo: { email: lead.email, name: lead.name },
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
      categories: ['contact-form', 'internal'],
    });
  } catch (err) {
    console.error('[contact] internal notification failed:', mailer.describeError(err));
    return reply(req, res, 502, { ok: false, error: 'send_failed' }, lead.lang);
  }

  // 2) Confirmation to the client — failure here is logged but the lead is already captured.
  let confirmationSent = true;
  try {
    const client = renderClientConfirmation({ lead, baseUrl });
    await mailer.send({
      to: { email: lead.email, name: lead.name },
      ...(mailer.config.clientReplyTo ? { replyTo: mailer.config.clientReplyTo } : {}),
      subject: client.subject,
      html: client.html,
      text: client.text,
      categories: ['contact-form', 'client-confirmation'],
    });
  } catch (err) {
    confirmationSent = false;
    console.error('[contact] client confirmation failed:', mailer.describeError(err));
  }

  console.log(`[contact] lead received: ${lead.company} <${lead.email}> (confirmation ${confirmationSent ? 'sent' : 'NOT sent'})`);
  return reply(req, res, 200, { ok: true, confirmationSent }, lead.lang);
});

/* ───────── 404 & errors ───────── */
app.use((req, res) => {
  if (req.accepts(['html', 'json']) === 'json' || req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, error: 'not_found' });
  }
  res.redirect(302, '/');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed' || err.type === 'entity.too.large') {
    return res.status(400).json({ ok: false, error: 'bad_request' });
  }
  console.error('[error]', err);
  res.status(500).json({ ok: false, error: 'server_error' });
});

/* ───────── Start ───────── */
const server = app.listen(PORT, () => {
  const mail = mailer.status();
  console.log(`DATASHEQ web v${pkg.version} listening on port ${PORT}`);
  if (!mail.configured) {
    console.warn(
      `[mail] SendGrid NOT configured (missing: ${mail.missing.join(', ')}). ` +
        (mail.devOutbox ? 'Dev mode: emails are saved to ./.mail-outbox' : 'The contact form will return errors.')
    );
  } else if (mail.sandbox) {
    console.warn('[mail] SENDGRID_SANDBOX=true — SendGrid validates requests but does NOT deliver emails.');
  }
});

const shutdown = () => server.close(() => process.exit(0));
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
