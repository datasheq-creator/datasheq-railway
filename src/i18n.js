const content = require('./content');

const LANGS = ['es', 'en'];
const DEFAULT_LANG = 'es';

const normalizeLang = (lang) => (LANGS.includes(lang) ? lang : DEFAULT_LANG);

/** Pick the language variant of a {es, en} object (falls back to Spanish). */
function pick(value, lang) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'es' in value) {
    return value[lang] ?? value.es;
  }
  return value;
}

/** Interpolate {placeholders}. */
function fill(str, vars = {}) {
  return String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

/** Translator bound to a language: t('key', {vars}) */
function translator(lang) {
  return (key, vars) => {
    const entry = content.ui[key];
    if (!entry) return key;
    const v = pick(entry, lang);
    return typeof v === 'string' ? fill(v, vars) : v;
  };
}

const escapeHtml = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

module.exports = { LANGS, DEFAULT_LANG, normalizeLang, pick, fill, translator, escapeHtml };
