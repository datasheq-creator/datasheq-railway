const content = require('../content');
const { pick, translator, escapeHtml: e } = require('../i18n');
const { icon, downloadIcon } = require('./icons');

const LOGO_W = 124;
const LOGO_H = Math.round((LOGO_W * 202) / 330);

function waLink(lang) {
  const t = translator(lang);
  const { whatsappNumber } = content.settings.contact;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('contact_whatsapp_msg'))}`;
}

/* ───────────────────────── Contact form ───────────────────────── */
function renderForm({ lang, prefix, source }) {
  const t = translator(lang);
  const id = (n) => `${prefix}-${n}`;
  const req = '<span class="req" aria-hidden="true">*</span>';
  const opt = `<span class="opt">(${e(t('f_optional'))})</span>`;

  const field = ({ name, label, type = 'text', required = false, attrs = '', control }) => {
    const ctl =
      control ||
      `<input id="${id(name)}" name="${name}" type="${type}" ${required ? 'required' : ''} ${attrs} aria-describedby="${id(name)}-err">`;
    return `<div class="field" data-field="${name}">
        <label for="${id(name)}">${e(label)} ${required ? req : opt}</label>
        ${ctl}
        <p class="field-error" id="${id(name)}-err"></p>
      </div>`;
  };

  const select = (name, list, required) =>
    `<select id="${id(name)}" name="${name}" ${required ? 'required' : ''} aria-describedby="${id(name)}-err">
        <option value="">${e(t('f_select'))}</option>
        ${list.map((o) => `<option value="${e(o.id)}">${e(pick(o.label, lang))}</option>`).join('')}
      </select>`;

  const solutions = content.modules
    .map(
      (m) => `<label class="chip"><input type="checkbox" name="solutions" value="${e(m.id)}"><span>${e(m.name)}</span></label>`
    )
    .join('');

  const prefs = content.contactPreferences
    .map(
      (p, i) =>
        `<label class="chip"><input type="radio" name="contactPreference" value="${e(p.id)}" ${i === 0 ? 'checked' : ''}><span>${e(pick(p.label, lang))}</span></label>`
    )
    .join('');

  return `
  <div class="form-wrap" data-form-wrap>
    <form class="contact-form" data-contact-form method="post" action="/api/contact" novalidate>
      <input type="hidden" name="lang" value="${lang}">
      <input type="hidden" name="source" value="${source}">
      <div class="hp" aria-hidden="true">
        <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
      </div>

      <fieldset>
        <legend>${e(t('form_section_you'))}</legend>
        <div class="grid-2">
          ${field({ name: 'name', label: t('f_name'), required: true, attrs: 'autocomplete="name" maxlength="100"' })}
          ${field({ name: 'position', label: t('f_position'), attrs: 'autocomplete="organization-title" maxlength="100"' })}
          ${field({ name: 'email', label: t('f_email'), type: 'email', required: true, attrs: 'autocomplete="email" maxlength="254" inputmode="email"' })}
          ${field({ name: 'phone', label: t('f_phone'), type: 'tel', required: true, attrs: 'autocomplete="tel" maxlength="30" placeholder="+56 9 1234 5678"' })}
        </div>
      </fieldset>

      <fieldset>
        <legend>${e(t('form_section_company'))}</legend>
        <div class="grid-2">
          ${field({ name: 'company', label: t('f_company'), required: true, attrs: 'autocomplete="organization" maxlength="120"' })}
          ${field({ name: 'industry', label: t('f_industry'), required: true, control: select('industry', content.industries, true) })}
          ${field({ name: 'companySize', label: t('f_size'), control: select('companySize', content.companySizes, false) })}
          ${field({ name: 'location', label: t('f_location'), attrs: 'autocomplete="address-level2" maxlength="100"' })}
        </div>
      </fieldset>

      <fieldset>
        <legend>${e(t('form_section_need'))}</legend>
        <div class="field" data-field="solutions">
          <span class="label" id="${id('solutions')}-lbl">${e(t('f_solutions'))} ${opt}</span>
          <div class="chips" role="group" aria-labelledby="${id('solutions')}-lbl">${solutions}</div>
          <p class="field-error" id="${id('solutions')}-err"></p>
        </div>
        <div class="field" data-field="contactPreference">
          <span class="label" id="${id('pref')}-lbl">${e(t('f_preference'))}</span>
          <div class="chips" role="radiogroup" aria-labelledby="${id('pref')}-lbl">${prefs}</div>
          <p class="field-error" id="${id('contactPreference')}-err"></p>
        </div>
        ${field({
          name: 'message',
          label: t('f_message'),
          required: true,
          control: `<textarea id="${id('message')}" name="message" rows="4" required minlength="10" maxlength="3000" placeholder="${e(t('f_message_ph'))}" aria-describedby="${id('message')}-err"></textarea>`,
        })}
      </fieldset>

      <div class="field field--check" data-field="consent">
        <label class="check">
          <input type="checkbox" name="consent" value="yes" required aria-describedby="${id('consent')}-err">
          <span>${e(t('f_consent'))} ${req}</span>
        </label>
        <p class="field-error" id="${id('consent')}-err"></p>
      </div>

      <div class="form-alert" role="alert" hidden></div>

      <button type="submit" class="btn btn-primary btn-block btn-lg" data-submit>
        <span class="btn-label">${e(t('f_submit'))}</span>
        <span class="spinner" aria-hidden="true"></span>
      </button>
      <p class="form-footnote">${e(t('f_footnote'))} <span class="req-note">${req} ${e(t('f_required_note'))}</span></p>
    </form>

    <div class="form-success" data-form-success hidden tabindex="-1">
      <span class="success-icon">${icon('check', { size: 30, strokeWidth: 2.4 })}</span>
      <h3 data-success-title></h3>
      <p>${e(t('ok_text'))}</p>
      <p class="muted" data-success-copy></p>
      <div class="success-actions">
        <button type="button" class="btn btn-outline" data-form-reset>${e(t('ok_again'))}</button>
        ${source === 'modal' ? `<button type="button" class="btn btn-primary" data-close>${e(t('ok_close'))}</button>` : ''}
      </div>
    </div>
  </div>`;
}

/* ───────────────────────── Page ───────────────────────── */
function renderPage({ lang, baseUrl, version }) {
  const t = translator(lang);
  const { contact, app } = content.settings;
  const home = lang === 'es' ? '/' : '/en';
  const v = encodeURIComponent(version);

  const moduleCards = content.modules
    .map(
      (m) => `
      <li class="module-card">
        <div class="module-top">
          <span class="module-icon">${icon(m.icon, { size: 22 })}</span>
          <div>
            <h3>${e(m.name)}</h3>
            <p class="module-sub">${e(pick(m.subtitle, lang))}</p>
          </div>
        </div>
        <p class="module-desc">${e(pick(m.desc, lang))}</p>
        <button type="button" class="link-arrow" data-open-contact data-module="${e(m.id)}">
          ${e(t('module_cta'))} ${icon('arrow', { size: 16, strokeWidth: 2.2 })}
        </button>
      </li>`
    )
    .join('');

  const newsCards = content.news
    .map(
      (n, i) => `
      <article class="news-card">
        <div class="news-cover news-cover--${(i % 3) + 1}" aria-hidden="true"><span>${e(n.badge)}</span></div>
        <div class="news-body">
          <div class="news-meta"><span class="tag">${e(pick(n.tag, lang))}</span><span>${e(pick(n.date, lang))}</span></div>
          <h3>${e(pick(n.title, lang))}</h3>
          <p>${e(pick(n.excerpt, lang))}</p>
          <button type="button" class="link-arrow" data-news="${e(n.id)}" aria-haspopup="dialog">
            ${e(t('news_read_more'))} ${icon('arrow', { size: 16, strokeWidth: 2.2 })}
          </button>
        </div>
      </article>
      <template id="news-${e(n.id)}">
        <div class="news-cover news-cover--${(i % 3) + 1} news-cover--modal" aria-hidden="true"><span>${e(n.badge)}</span></div>
        <div class="news-article">
          <div class="news-meta"><span class="tag">${e(pick(n.tag, lang))}</span><span>${e(pick(n.date, lang))}</span></div>
          <h2 id="news-modal-title">${e(pick(n.title, lang))}</h2>
          ${pick(n.body, lang).map((p) => `<p>${e(p)}</p>`).join('')}
          <button type="button" class="btn btn-primary" data-open-contact>${e(t('news_cta'))}</button>
        </div>
      </template>`
    )
    .join('');

  const values = t('values')
    .map((val) => `<li>${icon('check', { size: 16, strokeWidth: 2.4 })}${e(val)}</li>`)
    .join('');

  const gpUrl = app.googlePlayUrl || '#contacto';
  const asUrl = app.appStoreUrl || '#contacto';
  const ext = (u) => (u.startsWith('http') ? ' target="_blank" rel="noopener"' : '');

  const clientStrings = {
    err_required: t('err_required'),
    err_email: t('err_email'),
    err_phone: t('err_phone'),
    err_too_short: t('err_too_short'),
    err_too_long: t('err_too_long'),
    err_consent: t('err_consent'),
    err_invalid: t('err_invalid'),
    err_generic: t('err_generic'),
    err_rate: t('err_rate'),
    err_fix: t('err_fix'),
    ok_title: t('ok_title'),
    ok_copy: t('ok_copy'),
    f_sending: t('f_sending'),
    f_submit: t('f_submit'),
  };

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DATASHEQ',
    url: baseUrl,
    logo: `${baseUrl}/assets/logo.svg`,
    email: contact.email,
    address: { '@type': 'PostalAddress', streetAddress: contact.address, addressCountry: 'CL' },
  };

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${e(t('meta_title'))}</title>
  <meta name="description" content="${e(t('meta_description'))}">
  <meta name="theme-color" content="#ffffff">
  <link rel="canonical" href="${e(baseUrl + home)}">
  <link rel="alternate" hreflang="es" href="${e(baseUrl)}/">
  <link rel="alternate" hreflang="en" href="${e(baseUrl)}/en">
  <link rel="alternate" hreflang="x-default" href="${e(baseUrl)}/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${e(t('meta_title'))}">
  <meta property="og:description" content="${e(t('meta_description'))}">
  <meta property="og:url" content="${e(baseUrl + home)}">
  <meta property="og:image" content="${e(baseUrl)}/assets/hero.jpg">
  <meta property="og:locale" content="${lang === 'es' ? 'es_CL' : 'en_US'}">
  <link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/css/styles.css?v=${v}">
  <script type="application/ld+json">${JSON.stringify(orgLd).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <a class="skip-link" href="#main">${lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>

  <header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="${home}#inicio" aria-label="DATASHEQ — ${e(t('nav_home'))}">
        <img src="/assets/logo.svg" alt="DATASHEQ — ${e(t('tagline'))}" width="${LOGO_W}" height="${LOGO_H}">
      </a>

      <nav class="main-nav" id="main-nav" aria-label="${lang === 'es' ? 'Principal' : 'Main'}" data-nav>
        <ul class="nav-list">
          <li><a href="#inicio">${e(t('nav_home'))}</a></li>
          <li class="has-sub">
            <a href="#nosotros">${e(t('nav_about'))} ${icon('chevron', { size: 16, cls: 'chev', strokeWidth: 2.2 })}</a>
            <ul class="sub">
              <li><a href="#nosotros">${e(t('nav_about_who'))}</a></li>
              <li><a href="#mision-vision">${e(t('nav_mission'))}</a></li>
            </ul>
          </li>
          <li><a href="#solucion">${e(t('nav_solution'))}</a></li>
          <li><a href="#noticias">${e(t('nav_news'))}</a></li>
        </ul>
        <button type="button" class="btn btn-primary btn-block nav-cta" data-open-contact>${e(t('nav_contact'))}</button>
      </nav>

      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="${e(t('lang_label'))}">
          <a href="/" hreflang="es" lang="es" data-lang-link ${lang === 'es' ? 'aria-current="true"' : ''}>ES</a>
          <a href="/en" hreflang="en" lang="en" data-lang-link ${lang === 'en' ? 'aria-current="true"' : ''}>EN</a>
        </div>
        <button type="button" class="btn btn-outline btn-header" data-open-contact>${e(t('nav_contact'))}</button>
        <a class="download-link" href="#app" aria-label="${e(t('nav_download'))}" title="${e(t('nav_download'))}">${downloadIcon}</a>
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="${e(t('nav_menu'))}" data-menu-toggle>
          ${icon('menu', { size: 24, cls: 'i-menu' })}${icon('close', { size: 24, cls: 'i-close' })}
        </button>
      </div>
    </div>
  </header>

  <main id="main">
    <!-- HERO -->
    <section class="hero" id="inicio">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1>${e(t('hero_title_1'))}<span class="hl">${e(t('hero_title_hl'))}</span>${e(t('hero_title_2'))}</h1>
          <p class="lead">${e(t('hero_text'))}</p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="#solucion">${e(t('hero_cta_primary'))}</a>
            <button type="button" class="btn btn-outline btn-lg" data-open-contact>${e(t('hero_cta_secondary'))}</button>
          </div>
        </div>
        <div class="hero-media">
          <img src="/assets/hero.jpg" alt="${e(t('hero_img_alt'))}" width="888" height="876" fetchpriority="high">
        </div>
      </div>
    </section>

    <!-- NOSOTROS -->
    <section class="section about" id="nosotros">
      <div class="container about-grid">
        <div class="about-copy">
          <p class="eyebrow">${e(t('about_eyebrow'))}</p>
          <h2>${e(t('about_title'))}</h2>
          <p>${e(t('about_text'))}</p>
          <ul class="values">${values}</ul>
        </div>
        <div class="mv" id="mision-vision">
          <article class="mv-card">
            <span class="mv-icon">${icon('target', { size: 24 })}</span>
            <h3>${e(t('mission_title'))}</h3>
            <p>${e(t('mission_text'))}</p>
          </article>
          <article class="mv-card mv-card--dark">
            <span class="mv-icon">${icon('eye', { size: 24 })}</span>
            <h3>${e(t('vision_title'))}</h3>
            <p>${e(t('vision_text'))}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- SOLUCIÓN INTEGRAL -->
    <section class="section solution" id="solucion">
      <div class="container">
        <header class="section-head center">
          <p class="eyebrow">${e(t('solution_eyebrow'))}</p>
          <h2>${e(t('solution_title'))}</h2>
          <p>${e(t('solution_text_1'))}</p>
          <p>${e(t('solution_text_2'))}</p>
        </header>
        <ul class="modules-grid">
          ${moduleCards}
          <li class="module-card module-card--cta">
            <h3>${e(t('solution_cta_title'))}</h3>
            <p>${e(t('solution_cta_text'))}</p>
            <button type="button" class="btn btn-primary" data-open-contact>${e(t('solution_cta_btn'))}</button>
          </li>
        </ul>
      </div>
    </section>

    <!-- NOTICIAS -->
    <section class="section news" id="noticias">
      <div class="container">
        <header class="section-head">
          <p class="eyebrow">${e(t('news_eyebrow'))}</p>
          <h2>${e(t('news_title'))}</h2>
          <p>${e(t('news_text'))}</p>
        </header>
        <div class="news-grid">${newsCards}</div>
      </div>
    </section>

    <!-- APP -->
    <section class="section app" id="app">
      <div class="container app-grid">
        <div class="app-copy">
          <h2>${e(t('app_title_1'))}<span class="hl">${e(t('app_title_hl'))}</span></h2>
          <p class="lead">${e(t('app_text'))}</p>
          <div class="app-actions">
            <div class="stores">
              <a class="store-btn" href="${e(gpUrl)}"${ext(gpUrl)}>
                ${icon('play', { size: 22, strokeWidth: 1.6 })}
                <span><small>${e(t('app_gp_small'))}</small><strong>Google Play</strong></span>
              </a>
              <a class="store-btn" href="${e(asUrl)}"${ext(asUrl)}>
                ${icon('smartphone', { size: 22, strokeWidth: 1.6 })}
                <span><small>${e(t('app_as_small'))}</small><strong>App Store</strong></span>
              </a>
            </div>
            <figure class="qr">
              <img src="/qr.svg" width="112" height="112" alt="${e(t('app_qr_label'))}">
              <figcaption>${e(t('app_qr_label'))}</figcaption>
            </figure>
          </div>
        </div>
        <div class="app-media">
          <img src="/assets/phone.jpg" alt="${e(t('app_img_alt'))}" width="634" height="770" loading="lazy">
        </div>
      </div>
    </section>

    <!-- CONTACTO -->
    <section class="section contact" id="contacto">
      <div class="container contact-grid">
        <div class="contact-copy">
          <p class="eyebrow">${e(t('contact_eyebrow'))}</p>
          <h2>${e(t('contact_title'))}</h2>
          <p>${e(t('contact_text'))}</p>
          <ul class="contact-list">
            <li>
              <span class="ci">${icon('phone')}</span>
              <div><strong>${e(t('contact_whatsapp'))}</strong>
                <a href="${e(waLink(lang))}" target="_blank" rel="noopener">${e(contact.whatsappDisplay)}</a></div>
            </li>
            <li>
              <span class="ci">${icon('mail')}</span>
              <div><strong>Email</strong><a href="mailto:${e(contact.email)}">${e(contact.email)}</a></div>
            </li>
            <li>
              <span class="ci">${icon('pin')}</span>
              <div><strong>${e(t('contact_address_label'))}</strong>
                <a href="${e(contact.mapsUrl)}" target="_blank" rel="noopener">${e(contact.address)}</a></div>
            </li>
          </ul>
        </div>
        <div class="contact-panel">
          ${renderForm({ lang, prefix: 's', source: 'section' })}
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <img src="/assets/logo.svg" alt="DATASHEQ" width="${LOGO_W}" height="${LOGO_H}" loading="lazy">
        <p>${e(t('footer_text'))}</p>
      </div>
      <div>
        <h4>${e(t('footer_links'))}</h4>
        <ul>
          <li><a href="#inicio">${e(t('nav_home'))}</a></li>
          <li><a href="#nosotros">${e(t('nav_about'))}</a></li>
          <li><a href="#mision-vision">${e(t('nav_mission'))}</a></li>
          <li><a href="#solucion">${e(t('nav_solution'))}</a></li>
          <li><a href="#noticias">${e(t('nav_news'))}</a></li>
          <li><a href="#app">${e(t('nav_download'))}</a></li>
        </ul>
      </div>
      <div>
        <h4>${e(t('footer_contact'))}</h4>
        <ul>
          <li><a href="${e(waLink(lang))}" target="_blank" rel="noopener">WhatsApp ${e(contact.whatsappDisplay)}</a></li>
          <li><a href="mailto:${e(contact.email)}">${e(contact.email)}</a></li>
          <li>${e(contact.address)}</li>
          <li><button type="button" class="link-arrow" data-open-contact>${e(t('nav_contact'))} ${icon('arrow', { size: 16, strokeWidth: 2.2 })}</button></li>
        </ul>
      </div>
    </div>
    <div class="container">
      <p class="footer-bottom">© ${new Date().getFullYear()} DATASHEQ · ${e(t('tagline'))}. ${e(t('footer_rights'))}</p>
    </div>
  </footer>

  <!-- MODAL: CONTACTO -->
  <dialog class="modal" id="contact-modal" aria-labelledby="contact-modal-title">
    <div class="modal-card">
      <button type="button" class="modal-close" data-close aria-label="${e(t('close'))}">${icon('close')}</button>
      <header class="modal-head">
        <p class="eyebrow">${e(t('contact_eyebrow'))}</p>
        <h2 id="contact-modal-title">${e(t('form_modal_title'))}</h2>
        <p>${e(t('form_modal_text'))}</p>
      </header>
      ${renderForm({ lang, prefix: 'm', source: 'modal' })}
    </div>
  </dialog>

  <!-- MODAL: NOTICIA -->
  <dialog class="modal modal--news" id="news-modal" aria-labelledby="news-modal-title">
    <div class="modal-card">
      <button type="button" class="modal-close" data-close aria-label="${e(t('close'))}">${icon('close')}</button>
      <div data-news-content></div>
    </div>
  </dialog>

  <script id="i18n" type="application/json">${JSON.stringify(clientStrings).replace(/</g, '\\u003c')}</script>
  <script src="/js/app.js?v=${v}" defer></script>
</body>
</html>`;
}

module.exports = { renderPage };
