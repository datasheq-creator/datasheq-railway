const content = require('../content');
const { pick, translator, escapeHtml: e } = require('../i18n');
const { icon, downloadIcon } = require('./icons');

// Official logo (public/assets/logo.svg) — viewBox 1149.8 × 694.25
const LOGO_W = 140;
const LOGO_H = Math.round((LOGO_W * 694.25) / 1149.8);

function waLink(lang) {
  const t = translator(lang);
  const { whatsappNumber } = content.settings.contact;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(t('contact_whatsapp_msg'))}`;
}

/** Escape, then turn **text** into <strong>text</strong>. */
const rich = (s) => e(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

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
    .map((m) => `<label class="chip"><input type="checkbox" name="solutions" value="${e(m.id)}"><span>${e(m.name)}</span></label>`)
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
        <div class="grid-2">
          ${field({ name: 'plan', label: t('f_plan'), control: select('plan', content.planOptions, false) })}
        </div>
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

      <button type="submit" class="btn btn-primary btn-block btn-submit" data-submit>
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
  const { contact, loginUrl } = content.settings;
  const home = lang === 'es' ? '/' : '/en';
  const v = encodeURIComponent(version);
  const A = (file) => `/assets/${file}?v=${v}`;
  const arrow = icon('arrow', { size: 16, strokeWidth: 2.2 });

  /* — 01 / 02 / 03 — */
  const pains = pick(content.why.pains, lang).map((p) => `<li>${rich(p)}</li>`).join('');
  const features = pick(content.why.features, lang)
    .map((f) => `<li>${icon('tick', { size: 22, strokeWidth: 3, cls: 'tick' })}<span>${e(f)}</span></li>`)
    .join('');
  const benefits = content.why.benefits
    .map(
      (b) => `<li>
        <span class="benefit-icon">${icon(b.icon, { size: 40, strokeWidth: 1.6 })}</span>
        <div><strong>${e(pick(b.title, lang))}</strong><p>${e(pick(b.text, lang))}</p></div>
      </li>`
    )
    .join('');

  /* — Planes — */
  const planCards = content.plans
    .map((p) => {
      const cls = ['plan-card', p.recommended ? 'is-recommended' : '', p.highlight ? 'is-highlight' : ''].join(' ').trim();
      const price = p.soon
        ? `<p class="plan-price plan-price--soon"><span class="dash" aria-hidden="true"></span>${e(t('plans_soon'))}</p>`
        : `<p class="plan-price"><strong>${e(p.price)}</strong>${p.period ? `<span>${e(pick(p.period, lang))}</span>` : ''}</p>`;
      const feats = p.features
        .map((f) =>
          f.off
            ? `<li class="off"><span class="dash-sm" aria-hidden="true"></span><span>${e(pick(f, lang))}</span><span class="sr-only"> (${e(t('plans_not_included'))})</span></li>`
            : `<li>${icon('tick', { size: 16, strokeWidth: 2.8, cls: 'tick' })}<span>${e(pick(f, lang))}</span></li>`
        )
        .join('');
      const ctaLabel = { free: t('plans_cta_free'), buy: t('plans_cta_buy'), contact: t('plans_cta_contact') }[p.cta];
      const ctaCls = p.cta === 'buy' ? 'btn-primary' : 'btn-outline';
      return `<article class="${cls}">
        ${p.recommended ? `<span class="plan-badge">${e(t('plans_recommended'))}</span>` : ''}
        <h3 class="plan-name">${e(pick(p.name, lang))}</h3>
        ${price}
        <ul class="plan-features">${feats}</ul>
        <button type="button" class="btn ${ctaCls} btn-block plan-cta" data-open-contact data-plan="${e(p.id)}">${e(ctaLabel)}</button>
      </article>`;
    })
    .join('');

  /* — Módulos — */
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
        <button type="button" class="link-arrow" data-open-contact data-module="${e(m.id)}">${e(t('module_cta'))} ${arrow}</button>
      </li>`
    )
    .join('');

  /* — Noticias — */
  const newsCards = content.news
    .map(
      (n, i) => `
      <article class="news-card">
        <div class="news-cover news-cover--${(i % 3) + 1}" aria-hidden="true"><span>${e(n.badge)}</span></div>
        <div class="news-body">
          <div class="news-meta"><span class="tag">${e(pick(n.tag, lang))}</span><span>${e(pick(n.date, lang))}</span></div>
          <h3>${e(pick(n.title, lang))}</h3>
          <p>${e(pick(n.excerpt, lang))}</p>
          <button type="button" class="link-arrow" data-news="${e(n.id)}" aria-haspopup="dialog">${e(t('news_read_more'))} ${arrow}</button>
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

  /* — Equipo — */
  const team = content.team
    .map(
      (m) => `<li class="member">
        <img class="member-photo" src="${A(`team/${m.photo}.webp`)}" width="360" height="360" alt="${e(m.name)}" loading="lazy">
        <strong>${e(m.name)}</strong>
        <span>${e(pick(m.role, lang))}</span>
      </li>`
    )
    .join('');

  const paras = (arr) => arr.map((p) => `<p class="body">${e(p)}</p>`).join('');

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
    logo: `${baseUrl}/assets/logo-email.png`,
    email: contact.email,
    telephone: contact.whatsappDisplay,
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
  <meta property="og:image" content="${e(baseUrl)}/assets/hero.webp">
  <meta property="og:locale" content="${lang === 'es' ? 'es_CL' : 'en_US'}">
  <link rel="icon" href="${A('favicon.png')}" type="image/png">
  <link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${A('hero.webp')}" as="image" type="image/webp">
  <link rel="stylesheet" href="/css/styles.css?v=${v}">
  <script type="application/ld+json">${JSON.stringify(orgLd).replace(/</g, '\\u003c')}</script>
</head>
<body>
  <a class="skip-link" href="#main">${lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>

  <header class="site-header" data-header>
    <div class="container header-inner">
      <a class="brand" href="${home}#inicio" aria-label="DATASHEQ — ${e(t('nav_home'))}">
        <img src="${A('logo.svg')}" alt="DATASHEQ — ${e(t('tagline'))}" width="${LOGO_W}" height="${LOGO_H}">
      </a>

      <nav class="main-nav" id="main-nav" aria-label="${lang === 'es' ? 'Principal' : 'Main'}" data-nav>
        <ul class="nav-list">
          <li><a href="#inicio">${e(t('nav_home'))}</a></li>
          <li><a href="#solucion">${e(t('nav_solution'))}</a></li>
          <li><a href="#noticias">${e(t('nav_news'))}</a></li>
          <li><a href="#nosotros">${e(t('nav_about'))}</a></li>
        </ul>
        <div class="nav-mobile-actions">
          <a class="btn btn-primary btn-block" href="${e(loginUrl)}" target="_blank" rel="noopener">${icon('login', { size: 20, strokeWidth: 2 })} ${e(t('nav_login'))}</a>
          <button type="button" class="btn btn-outline btn-block" data-open-contact>${e(t('nav_contact'))}</button>
        </div>
      </nav>

      <div class="header-actions">
        <div class="lang-switch" role="group" aria-label="${e(t('lang_label'))}">
          <a href="/" hreflang="es" lang="es" data-lang-link ${lang === 'es' ? 'aria-current="true"' : ''}>ES</a>
          <a href="/en" hreflang="en" lang="en" data-lang-link ${lang === 'en' ? 'aria-current="true"' : ''}>EN</a>
        </div>
        <a class="btn btn-primary btn-sm btn-login" href="${e(loginUrl)}" target="_blank" rel="noopener">${icon('login', { size: 20, strokeWidth: 2 })}<span>${e(t('nav_login'))}</span></a>
        <button type="button" class="btn btn-outline btn-sm btn-header" data-open-contact>${e(t('nav_contact'))}</button>
        <a class="download-link" href="#app" aria-label="${e(t('nav_download'))}" title="${e(t('nav_download'))}">${downloadIcon}</a>
        <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="${e(t('nav_menu'))}" data-menu-toggle>
          ${icon('menu', { size: 26, cls: 'i-menu' })}${icon('close', { size: 26, cls: 'i-close' })}
        </button>
      </div>
    </div>
  </header>

  <main id="main">
    <!-- HERO -->
    <section class="hero" id="inicio">
      <div class="container hero-grid">
        <div class="hero-copy">
          <h1 class="display">${e(t('hero_title_1'))}<span class="hl">${e(t('hero_title_hl'))}</span>${e(t('hero_title_2'))}</h1>
          <p class="lead">${e(t('hero_text'))}</p>
          <div class="btn-row">
            <a class="btn btn-primary btn-lg" href="#soluciones">${e(t('hero_cta_primary'))}</a>
            <button type="button" class="btn btn-outline btn-lg" data-open-contact>${e(t('hero_cta_secondary'))}</button>
          </div>
        </div>
        <div class="hero-media">
          <img src="${A('hero.webp')}" alt="${e(t('hero_img_alt'))}" width="1600" height="1590" fetchpriority="high">
        </div>
      </div>
    </section>

    <!-- C-LEGAL -->
    <section class="clegal" id="solucion">
      <div class="container clegal-grid">
        <div class="clegal-copy">
          <h2 class="display"><span class="d-block">${e(t('clegal_title_1'))}</span><span class="hl d-block">${e(t('clegal_title_hl'))}</span></h2>
          <p class="lead">${e(t('clegal_text'))}</p>
          <div class="btn-row">
            <a class="btn btn-primary btn-lg" href="#nosotros">${e(t('clegal_cta_primary'))}</a>
            <a class="btn btn-outline btn-lg" href="#planes">${e(t('clegal_cta_secondary'))}</a>
          </div>
        </div>
        <div class="clegal-media">
          <img src="${A('clegal-phone.webp')}" alt="${e(t('clegal_img_alt'))}" width="1085" height="1198" loading="lazy">
        </div>
      </div>
    </section>

    <!-- 01 / 02 / 03 -->
    <section class="section why" id="c-legal">
      <div class="container why-grid">
        <article class="why-card why-card--1">
          <span class="why-num">01</span>
          <h3>${e(t('why_1_title'))}</h3>
          <ul class="pain-list">${pains}</ul>
          <img class="why-img why-img--laptop" src="${A('card-laptop.webp')}" alt="${e(t('why_1_img_alt'))}" width="706" height="405" loading="lazy">
        </article>
        <article class="why-card why-card--2">
          <span class="why-num">02</span>
          <h3>${e(t('why_2_title'))}</h3>
          <ul class="tick-list">${features}</ul>
          <img class="why-img why-img--phones" src="${A('card-phones.webp')}" alt="${e(t('why_2_img_alt'))}" width="564" height="482" loading="lazy">
        </article>
        <article class="why-card why-card--3">
          <span class="why-num">03</span>
          <h3>${e(t('why_3_title'))}</h3>
          <ul class="benefit-list">${benefits}</ul>
        </article>
      </div>
    </section>

    <!-- PLANES -->
    <section class="section plans" id="planes">
      <div class="container">
        <header class="section-head center">
          <p class="eyebrow">${e(t('plans_eyebrow'))}</p>
          <h2 class="title">${e(t('plans_title'))}</h2>
          <p class="body">${e(t('plans_text'))}</p>
        </header>
        <div class="plans-grid">${planCards}</div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta">
      <div class="container cta-inner">
        <h2 class="display"><span class="d-block">${e(t('cta_title_1'))}</span><span class="hl d-block">${e(t('cta_title_hl'))}</span></h2>
        <p class="lead">${e(t('cta_text'))}</p>
        <button type="button" class="btn btn-primary btn-lg" data-open-contact>${e(t('cta_button'))}</button>
        <div class="cta-eco">
          <span>${e(t('cta_ecosystem'))}</span>
          <span class="cta-eco-arrow" aria-hidden="true">${icon('arrow', { size: 28, strokeWidth: 2.4 })}</span>
          <a class="btn btn-outline" href="#soluciones">${e(t('cta_solutions'))}</a>
        </div>
      </div>
    </section>

    <!-- SOLUCIÓN INTEGRAL -->
    <section class="section solution" id="soluciones">
      <div class="container">
        <header class="section-head center">
          <p class="eyebrow">${e(t('solution_eyebrow'))}</p>
          <h2 class="title">${e(t('solution_title'))}</h2>
          <p class="body">${e(t('solution_text_1'))}</p>
          <p class="body">${e(t('solution_text_2'))}</p>
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
          <h2 class="title">${e(t('news_title'))}</h2>
          <p class="body">${e(t('news_text'))}</p>
        </header>
        <div class="news-grid">${newsCards}</div>
      </div>
    </section>

    <!-- APP -->
    <section class="section app" id="app">
      <div class="container app-grid">
        <div class="app-copy">
          <h2 class="display">${e(t('app_title_1'))}<span class="hl">${e(t('app_title_hl'))}</span></h2>
          <p class="lead">${e(t('app_text'))}</p>
          <p class="app-access">${e(t('app_access'))}</p>
          <div class="app-stores">
            <div class="app-col">
              <span class="app-label">${e(t('app_choose_store'))}</span>
              <div class="store-icons">
                <a href="/app/ios" target="_blank" rel="noopener" aria-label="App Store"><img src="${A('store-appstore.png')}" width="60" height="60" alt="App Store"></a>
                <a href="/app/android" target="_blank" rel="noopener" aria-label="Google Play"><img src="${A('store-googleplay.png')}" width="60" height="60" alt="Google Play"></a>
              </div>
            </div>
            <div class="app-col">
              <span class="app-label">${e(t('app_scan'))}</span>
              <div class="qr-row">
                <figure><img src="/qr/ios.svg" width="132" height="132" alt="${e(t('app_qr_ios'))}"><figcaption>App Store</figcaption></figure>
                <figure><img src="/qr/android.svg" width="132" height="132" alt="${e(t('app_qr_android'))}"><figcaption>Google Play</figcaption></figure>
              </div>
            </div>
          </div>
        </div>
        <div class="app-media">
          <img src="${A('app-phone.webp')}" alt="${e(t('app_img_alt'))}" width="670" height="760" loading="lazy">
        </div>
      </div>
    </section>

    <!-- NOSOTROS -->
    <section class="section about" id="nosotros">
      <div class="container about-grid">
        <div class="about-copy">
          <p class="eyebrow">${e(t('about_eyebrow'))}</p>
          <h2 class="title" id="mision">${e(t('mission_title'))}</h2>
          ${paras(t('mission_text'))}
          <h2 class="title" id="vision">${e(t('vision_title'))}</h2>
          ${paras(t('vision_text'))}
          <h2 class="title" id="equipo">${e(t('team_title'))}</h2>
          <p class="body">${e(t('team_text'))}</p>
        </div>
        <ul class="team-grid" aria-label="${e(t('team_title'))}">${team}</ul>
      </div>
    </section>

    <!-- CONTACTO -->
    <section class="section contact" id="contacto">
      <div class="container contact-grid">
        <div class="contact-copy">
          <p class="eyebrow">${e(t('contact_eyebrow'))}</p>
          <h2 class="title">${e(t('contact_title'))}</h2>
          <p class="body">${e(t('contact_text'))}</p>
          <ul class="contact-list">
            <li>
              <img class="ci" src="${A('contact-whatsapp.png')}" width="56" height="56" alt="" aria-hidden="true">
              <div><strong>${e(t('contact_whatsapp'))}</strong>
                <a href="${e(waLink(lang))}" target="_blank" rel="noopener">${e(contact.whatsappDisplay)}</a></div>
            </li>
            <li>
              <img class="ci" src="${A('contact-mail.png')}" width="56" height="56" alt="" aria-hidden="true">
              <div><a class="strong-link" href="mailto:${e(contact.email)}">${e(contact.email)}</a></div>
            </li>
            <li>
              <img class="ci" src="${A('contact-pin.png')}" width="56" height="56" alt="" aria-hidden="true">
              <div><a class="strong-link" href="${e(contact.mapsUrl)}" target="_blank" rel="noopener">${e(contact.address)}</a></div>
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
        <img src="${A('logo.svg')}" alt="DATASHEQ" width="${LOGO_W}" height="${LOGO_H}" loading="lazy">
        <p>${e(t('footer_text'))}</p>
      </div>
      <div>
        <h4>${e(t('footer_links'))}</h4>
        <ul>
          <li><a href="#inicio">${e(t('nav_home'))}</a></li>
          <li><a href="#solucion">${e(t('nav_solution'))}</a></li>
          <li><a href="#planes">${e(t('plans_eyebrow'))}</a></li>
          <li><a href="#noticias">${e(t('nav_news'))}</a></li>
          <li><a href="#nosotros">${e(t('nav_about'))}</a></li>
          <li><a href="#app">${e(t('nav_download'))}</a></li>
          <li><a href="${e(loginUrl)}" target="_blank" rel="noopener">${e(t('nav_login'))}</a></li>
        </ul>
      </div>
      <div>
        <h4>${e(t('footer_contact'))}</h4>
        <ul>
          <li><a href="${e(waLink(lang))}" target="_blank" rel="noopener">WhatsApp ${e(contact.whatsappDisplay)}</a></li>
          <li><a href="mailto:${e(contact.email)}">${e(contact.email)}</a></li>
          <li>${e(contact.address)}</li>
          <li><button type="button" class="link-arrow" data-open-contact>${e(t('nav_contact'))} ${arrow}</button></li>
        </ul>
      </div>
    </div>
    <div class="container">
      <p class="footer-bottom">© ${new Date().getFullYear()} DATASHEQ · ${e(t('tagline'))}. ${e(t('footer_rights'))}</p>
    </div>
  </footer>

  <a class="to-top" href="#inicio" data-to-top aria-label="${e(t('back_to_top'))}" title="${e(t('back_to_top'))}">${icon('up', { size: 30, strokeWidth: 2.4 })}</a>

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
