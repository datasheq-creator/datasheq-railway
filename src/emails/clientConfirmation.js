const content = require('../content');
const { pick, translator } = require('../i18n');
const { esc, FONT, C, button, documentShell, p } = require('./components');

const labelOf = (list, id, lang) => {
  const item = list.find((x) => x.id === id);
  return item ? pick(item.label, lang) : '';
};

const truncate = (s, n) => (s.length > n ? `${s.slice(0, n).trimEnd()}…` : s);

/**
 * Confirmation email sent to the client.
 * @param {{ lead: object, baseUrl: string }} opts
 * @returns {{ subject: string, html: string, text: string }}
 */
function renderClientConfirmation({ lead, baseUrl }) {
  const lang = lead.lang;
  const t = translator(lang);
  const { contact, app } = content.settings;
  const firstName = lead.name.split(/\s+/)[0];
  const siteUrl = `${baseUrl}${lang === 'en' ? '/en' : '/'}`;
  const waUrl = `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(t('contact_whatsapp_msg'))}`;
  const gpUrl = app.googlePlayUrl || `${siteUrl}#app`;
  const asUrl = app.appStoreUrl || `${siteUrl}#app`;

  const solutionsLabel = lead.solutions.length
    ? lead.solutions.map((id) => content.modules.find((m) => m.id === id)?.name).filter(Boolean).join(', ')
    : t('email_none');

  const summaryRows = [
    [t('f_name'), lead.name],
    [t('f_company'), lead.company],
    [t('f_industry'), labelOf(content.industries, lead.industry, lang)],
    [t('f_solutions'), solutionsLabel],
    [t('f_preference'), labelOf(content.contactPreferences, lead.contactPreference, lang)],
    [t('f_message'), truncate(lead.message, 280)],
  ];

  const sectionTitle = (text) =>
    `<p style="margin:0 0 14px;font-family:${FONT};font-size:12px;line-height:1.4;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.greenText};">${esc(text)}</p>`;

  const divider = `<tr><td class="px" style="padding:0 36px;"><div style="height:1px;line-height:1px;background:${C.line};">&nbsp;</div></td></tr>`;

  // Modules: 2 columns (stack on mobile)
  const mods = content.modules;
  const moduleCell = (m) =>
    m
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="14" valign="top" style="padding-top:7px;"><div style="width:8px;height:8px;border-radius:2px;background:${C.green};line-height:8px;font-size:1px;">&nbsp;</div></td>
          <td style="font-family:${FONT};font-size:14px;line-height:1.45;color:${C.ink2};"><strong style="color:${C.ink};">${esc(m.name)}</strong><br>${esc(pick(m.subtitle, lang))}</td>
        </tr></table>`
      : '&nbsp;';
  let moduleRows = '';
  for (let i = 0; i < mods.length; i += 2) {
    moduleRows += `<tr>
      <td class="stack" width="50%" valign="top" style="padding:0 8px 12px 0;">${moduleCell(mods[i])}</td>
      <td class="stack stack-gap" width="50%" valign="top" style="padding:0 0 12px 8px;">${moduleCell(mods[i + 1])}</td>
    </tr>`;
  }

  const newsRows = content.news
    .map(
      (n) => `<tr><td style="padding:0 0 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td width="64" valign="top">
            <div style="width:56px;height:44px;border-radius:8px;background:${C.green};color:#FFFFFF;font-family:${FONT};font-size:15px;font-weight:800;line-height:44px;text-align:center;">${esc(n.badge)}</div>
          </td>
          <td valign="middle" style="font-family:${FONT};">
            <div style="font-size:12px;line-height:1.4;color:${C.muted};">${esc(pick(n.tag, lang))} · ${esc(pick(n.date, lang))}</div>
            <div style="font-size:14.5px;line-height:1.4;font-weight:700;color:${C.ink};">${esc(pick(n.title, lang))}</div>
          </td>
        </tr></table>
      </td></tr>`
    )
    .join('');

  const body = `
<!-- NOTICE -->
<tr><td style="background:${C.green50};border:1px solid ${C.greenBorder};border-radius:12px;padding:18px 22px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td width="46" valign="top">
      <div style="width:34px;height:34px;border-radius:17px;background:${C.green};color:#FFFFFF;font-family:Arial,sans-serif;font-size:19px;font-weight:bold;line-height:34px;text-align:center;">&#10003;</div>
    </td>
    <td valign="top">
      <p style="margin:0;font-family:${FONT};font-size:17px;line-height:1.35;font-weight:700;color:#0B3D24;">${esc(t('email_notice_title'))}</p>
      <p style="margin:4px 0 0;font-family:${FONT};font-size:15px;line-height:1.55;color:#1F4D36;">${esc(t('email_notice_text', { name: firstName }))}</p>
    </td>
  </tr></table>
</td></tr>
<tr><td style="height:16px;line-height:16px;font-size:1px;">&nbsp;</td></tr>

<!-- CARD -->
<tr><td style="background:#FFFFFF;border-radius:14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

    <!-- Logo -->
    <tr><td align="center" style="padding:28px 36px 22px;border-bottom:1px solid ${C.line};">
      <a href="${esc(siteUrl)}" target="_blank" style="text-decoration:none;">
        <img src="${esc(baseUrl)}/assets/logo-email.png" width="150" height="92" alt="DATASHEQ" style="display:block;width:150px;height:auto;margin:0 auto;font-family:${FONT};font-size:24px;font-weight:800;color:${C.navy};">
      </a>
    </td></tr>

    <!-- Summary -->
    <tr><td class="px" style="padding:28px 36px 8px;">
      ${sectionTitle(t('email_summary_title'))}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.soft};border-radius:10px;">
        ${summaryRows
          .map(
            ([k, v], i) => `<tr>
          <td class="stack" width="38%" valign="top" style="padding:${i === 0 ? '14px' : '8px'} 16px ${i === summaryRows.length - 1 ? '14px' : '0'};font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};font-weight:600;">${esc(k)}</td>
          <td class="stack" valign="top" style="padding:${i === 0 ? '14px' : '8px'} 16px ${i === summaryRows.length - 1 ? '14px' : '0'};font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};white-space:pre-line;">${esc(v || t('email_none'))}</td>
        </tr>`
          )
          .join('')}
      </table>
    </td></tr>

    <!-- Hero / about -->
    <tr><td class="px" style="padding:28px 36px 28px;">
      ${sectionTitle(t('email_about_title'))}
      <h1 class="h1" style="margin:0 0 12px;font-family:${FONT};font-size:26px;line-height:1.2;font-weight:800;color:${C.navy};letter-spacing:-0.3px;">
        ${esc(t('hero_title_1'))}<span style="color:${C.green};">${esc(t('hero_title_hl'))}</span>${esc(t('hero_title_2'))}
      </h1>
      ${p(esc(t('hero_text')))}
      ${p(`<strong style="color:${C.ink};">${esc(t('mission_title'))}:</strong> ${esc(t('mission_text'))}`, 'margin-top:12px;font-size:14px;')}
      <div style="padding-top:20px;">${button(siteUrl, t('email_visit'), { width: 200 })}</div>
    </td></tr>
    ${divider}

    <!-- Modules -->
    <tr><td class="px" style="padding:28px 36px 16px;">
      ${sectionTitle(t('email_solution_title'))}
      ${p(esc(t('solution_text_1')), 'margin-bottom:18px;font-size:14px;')}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${moduleRows}</table>
    </td></tr>
    ${divider}

    <!-- News -->
    <tr><td class="px" style="padding:28px 36px 16px;">
      ${sectionTitle(t('email_news_title'))}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${newsRows}</table>
      <p style="margin:2px 0 0;font-family:${FONT};font-size:14px;"><a href="${esc(siteUrl)}#noticias" target="_blank" style="color:${C.greenText};font-weight:700;text-decoration:none;">${esc(t('news_read_more'))} &rarr;</a></p>
    </td></tr>

    <!-- App -->
    <tr><td class="px" style="padding:20px 36px 28px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.navy};border-radius:12px;">
        <tr><td style="padding:24px 24px 26px;">
          <p style="margin:0 0 6px;font-family:${FONT};font-size:20px;line-height:1.3;font-weight:800;color:#FFFFFF;">${esc(t('app_title_1'))}<span style="color:${C.green};">${esc(t('app_title_hl'))}</span></p>
          <p style="margin:0 0 18px;font-family:${FONT};font-size:14px;line-height:1.55;color:#C9CEE0;">${esc(t('app_text'))}</p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="stack" style="padding:0 10px 0 0;">${button(gpUrl, 'Google Play', { bg: '#000000', border: '#3A4160', width: 170 })}</td>
            <td class="stack stack-gap">${button(asUrl, 'App Store', { bg: '#000000', border: '#3A4160', width: 170 })}</td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>
    ${divider}

    <!-- Contact -->
    <tr><td class="px" style="padding:26px 36px 30px;">
      ${sectionTitle(t('email_contact_title'))}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT};font-size:14px;line-height:1.6;color:${C.ink2};">
        <tr><td width="90" style="color:${C.muted};font-weight:600;">WhatsApp</td><td><a href="${esc(waUrl)}" target="_blank" style="color:${C.ink};font-weight:600;text-decoration:none;">${esc(contact.whatsappDisplay)}</a></td></tr>
        <tr><td width="90" style="color:${C.muted};font-weight:600;">Email</td><td><a href="mailto:${esc(contact.email)}" style="color:${C.ink};font-weight:600;text-decoration:none;">${esc(contact.email)}</a></td></tr>
        <tr><td width="90" valign="top" style="color:${C.muted};font-weight:600;">${esc(t('contact_address_label'))}</td><td><a href="${esc(contact.mapsUrl)}" target="_blank" style="color:${C.ink};text-decoration:none;">${esc(contact.address)}</a></td></tr>
      </table>
    </td></tr>
  </table>
</td></tr>

<!-- Footer -->
<tr><td align="center" class="px" style="padding:22px 28px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">
  <strong style="color:${C.ink2};">DATASHEQ</strong> · ${esc(t('tagline'))}<br>
  ${esc(contact.address)}<br><br>
  ${esc(t('email_footer'))}
</td></tr>`;

  const html = documentShell({
    lang,
    title: t('email_client_subject'),
    preheader: t('email_client_preheader'),
    body,
  });

  const text = [
    `✓ ${t('email_notice_title').toUpperCase()}`,
    t('email_notice_text', { name: firstName }),
    '',
    `— ${t('email_summary_title')} —`,
    ...summaryRows.map(([k, v]) => `${k}: ${v || t('email_none')}`),
    '',
    `— ${t('email_about_title')} —`,
    `${t('hero_title_1')}${t('hero_title_hl')}${t('hero_title_2')}`,
    t('hero_text'),
    '',
    `— ${t('email_solution_title')} —`,
    ...content.modules.map((m) => `• ${m.name}: ${pick(m.subtitle, lang)}`),
    '',
    `— ${t('email_news_title')} —`,
    ...content.news.map((n) => `• ${pick(n.title, lang)} (${pick(n.date, lang)})`),
    '',
    `— ${t('email_contact_title')} —`,
    `WhatsApp: ${contact.whatsappDisplay}`,
    `Email: ${contact.email}`,
    `${t('contact_address_label')}: ${contact.address}`,
    '',
    siteUrl,
    '',
    t('email_footer'),
  ].join('\n');

  return { subject: t('email_client_subject'), html, text };
}

module.exports = { renderClientConfirmation };
