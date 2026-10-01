const content = require('./content');
const { normalizeLang } = require('./i18n');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+()\d\s.-]{6,30}$/;

const str = (v, max) =>
  String(v ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '') // strip control chars (keep \n, \r, \t)
    .trim()
    .slice(0, max + 1); // +1 so "too long" can still be detected

const oneLine = (v, max) => str(v, max).replace(/\s+/g, ' ');

const ids = (list) => new Set(list.map((x) => x.id));
const INDUSTRIES = ids(content.industries);
const SIZES = ids(content.companySizes);
const PREFS = ids(content.contactPreferences);
const MODULES = ids(content.modules);
const PLANS = ids(content.planOptions);

/**
 * Validates and normalises the contact payload.
 * Returns { lead, errors, spam } — errors is {} when valid.
 */
function validateLead(body = {}) {
  const errors = {};

  const lead = {
    name: oneLine(body.name, 100),
    position: oneLine(body.position, 100),
    email: oneLine(body.email, 254).toLowerCase(),
    phone: oneLine(body.phone, 30),
    company: oneLine(body.company, 120),
    industry: oneLine(body.industry, 40),
    companySize: oneLine(body.companySize, 40),
    location: oneLine(body.location, 100),
    plan: PLANS.has(body.plan) ? body.plan : '',
    solutions: [].concat(body.solutions ?? []).map((s) => oneLine(s, 40)).filter((s) => MODULES.has(s)),
    contactPreference: PREFS.has(body.contactPreference) ? body.contactPreference : 'email',
    message: str(body.message, 3000).replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n'),
    consent: body.consent === true || body.consent === 'yes' || body.consent === 'on',
    lang: normalizeLang(body.lang),
    source: ['modal', 'section'].includes(body.source) ? body.source : 'unknown',
  };
  lead.solutions = [...new Set(lead.solutions)];

  const required = (k, min = 1) => {
    if (!lead[k] || lead[k].length < min) errors[k] = 'required';
  };

  required('name', 2);
  if (lead.name.length > 100) errors.name = 'too_long';

  if (!lead.email) errors.email = 'required';
  else if (lead.email.length > 254 || !EMAIL_RE.test(lead.email)) errors.email = 'email';

  if (!lead.phone) errors.phone = 'required';
  else if (!PHONE_RE.test(lead.phone) || lead.phone.replace(/\D/g, '').length < 7) errors.phone = 'phone';

  required('company');
  if (lead.company.length > 120) errors.company = 'too_long';

  if (!lead.industry) errors.industry = 'required';
  else if (!INDUSTRIES.has(lead.industry)) errors.industry = 'invalid';

  if (lead.companySize && !SIZES.has(lead.companySize)) errors.companySize = 'invalid';
  if (lead.position.length > 100) errors.position = 'too_long';
  if (lead.location.length > 100) errors.location = 'too_long';

  if (!lead.message) errors.message = 'required';
  else if (lead.message.length < 10) errors.message = 'too_short';
  else if (lead.message.length > 3000) errors.message = 'too_long';

  if (!lead.consent) errors.consent = 'consent';

  // Bot checks: honeypot filled, or form submitted impossibly fast
  const startedAt = Number(body.startedAt);
  const tooFast = Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < 2000;
  const spam = Boolean(String(body.website ?? '').trim()) || tooFast;

  return { lead, errors, spam };
}

module.exports = { validateLead };
