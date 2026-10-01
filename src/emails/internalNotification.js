const content = require('../content');
const { pick } = require('../i18n');
const { esc, FONT, C, button, documentShell } = require('./components');

const labelOf = (list, id) => {
  const item = list.find((x) => x.id === id);
  return item ? pick(item.label, 'es') : id || '';
};

/**
 * Internal notification sent to the DATASHEQ team (always in Spanish).
 * @param {{ lead: object, meta: { ip?: string, userAgent?: string, receivedAt: Date, baseUrl: string } }} opts
 */
function renderInternalNotification({ lead, meta }) {
  const when = new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Santiago',
  }).format(meta.receivedAt);

  const solutions = lead.solutions.length
    ? lead.solutions
        .map((id) => {
          const m = content.modules.find((x) => x.id === id);
          return m ? `${m.name} (${pick(m.subtitle, 'es')})` : id;
        })
        .join(', ')
    : '—';

  const rows = [
    ['Nombre', lead.name],
    ['Cargo', lead.position || '—'],
    ['Email', lead.email],
    ['Teléfono / WhatsApp', lead.phone],
    ['Empresa', lead.company],
    ['Industria', labelOf(content.industries, lead.industry)],
    ['Tamaño', lead.companySize ? labelOf(content.companySizes, lead.companySize) : '—'],
    ['Ciudad / Región', lead.location || '—'],
    ['Plan de interés', lead.plan ? labelOf(content.planOptions, lead.plan) : '—'],
    ['Soluciones de interés', solutions],
    ['Prefiere contacto por', labelOf(content.contactPreferences, lead.contactPreference)],
    ['Idioma', lead.lang.toUpperCase()],
  ];

  const phoneDigits = lead.phone.replace(/\D/g, '');
  const replySubject = lead.lang === 'en' ? 'Your DATASHEQ demo request' : 'Tu solicitud de demo en DATASHEQ';

  const subject = `Nueva solicitud de demo: ${lead.company} — ${lead.name}`;

  const body = `
<tr><td style="background:#FFFFFF;border-radius:14px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr><td class="px" style="padding:26px 32px 20px;background:${C.navy};border-radius:14px 14px 0 0;">
      <p style="margin:0 0 4px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.green};">Formulario web · Contáctanos</p>
      <p style="margin:0;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:800;color:#FFFFFF;">Nueva solicitud de demo</p>
      <p style="margin:6px 0 0;font-family:${FONT};font-size:14px;line-height:1.5;color:#C9CEE0;">${esc(when)} (hora de Chile)</p>
    </td></tr>

    <tr><td class="px" style="padding:24px 32px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${C.line};border-radius:10px;">
        ${rows
          .map(
            ([k, v], i) => `<tr>
          <td class="stack" width="36%" valign="top" style="padding:10px 14px;${i ? `border-top:1px solid ${C.line};` : ''}font-family:${FONT};font-size:13px;line-height:1.5;color:${C.muted};font-weight:600;background:${C.soft};">${esc(k)}</td>
          <td class="stack" valign="top" style="padding:10px 14px;${i ? `border-top:1px solid ${C.line};` : ''}font-family:${FONT};font-size:14px;line-height:1.5;color:${C.ink};">${
            k === 'Email'
              ? `<a href="mailto:${esc(v)}" style="color:${C.ink};">${esc(v)}</a>`
              : k === 'Teléfono / WhatsApp'
                ? `<a href="tel:${esc(v.replace(/[^\d+]/g, ''))}" style="color:${C.ink};">${esc(v)}</a>`
                : esc(v)
          }</td>
        </tr>`
          )
          .join('')}
      </table>
    </td></tr>

    <tr><td class="px" style="padding:18px 32px 6px;">
      <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;color:${C.greenText};">Mensaje</p>
      <div style="padding:14px 16px;background:${C.soft};border-left:3px solid ${C.green};border-radius:6px;font-family:${FONT};font-size:14.5px;line-height:1.6;color:${C.ink};white-space:pre-wrap;">${esc(lead.message)}</div>
    </td></tr>

    <tr><td class="px" style="padding:22px 32px 26px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="stack" style="padding:0 10px 0 0;">${button(`mailto:${lead.email}?subject=${encodeURIComponent(replySubject)}`, 'Responder por email', { width: 200 })}</td>
        ${
          phoneDigits.length >= 8
            ? `<td class="stack stack-gap">${button(`https://wa.me/${phoneDigits}`, 'Abrir WhatsApp', { bg: '#FFFFFF', color: C.ink, border: '#9AA1AD', width: 180 })}</td>`
            : ''
        }
      </tr></table>
    </td></tr>

    <tr><td class="px" style="padding:0 32px 24px;font-family:${FONT};font-size:12px;line-height:1.6;color:${C.muted};">
      Origen: ${esc(lead.source === 'modal' ? 'ventana “Contáctanos”' : lead.source === 'section' ? 'sección de contacto' : lead.source)} · ${esc(meta.baseUrl)}<br>
      IP: ${esc(meta.ip || '—')}<br>
      Navegador: ${esc((meta.userAgent || '—').slice(0, 200))}<br>
      Responder a este correo contesta directamente a ${esc(lead.email)}.
    </td></tr>
  </table>
</td></tr>`;

  const html = documentShell({
    lang: 'es',
    title: subject,
    preheader: `${lead.name} (${lead.company}) — ${lead.message.slice(0, 90)}`,
    body,
  });

  const text = [
    'NUEVA SOLICITUD DE DEMO',
    `${when} (hora de Chile)`,
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Mensaje:',
    lead.message,
    '',
    `Origen: ${lead.source} · ${meta.baseUrl}`,
    `IP: ${meta.ip || '—'}`,
  ].join('\n');

  return { subject, html, text };
}

module.exports = { renderInternalNotification };
