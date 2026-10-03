// Email-safe building blocks (tables + inline styles; works in Gmail, Outlook, Apple Mail)
const { escapeHtml: esc } = require('../i18n');

const FONT = "'Helvetica Now Display', Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif";
const C = {
  navy: '#10102A',
  ink: '#10102A',
  ink2: '#4B586B',
  muted: '#5B6579',
  line: '#E4E7EC',
  soft: '#F5F7F9',
  bg: '#EEF1F4',
  green: '#C200FF',        // primary brand colour (purple) — PALETA-COLORES
  greenText: '#A702DF',    // purple for small text (AA on white)
  green50: '#FAE8FF',      // light purple background
  greenBorder: '#EEB8FF',
};

/** Bulletproof button (VML for Outlook desktop, <a> elsewhere). */
function button(href, label, { bg = C.green, color = '#FFFFFF', width = 220, border = bg } = {}) {
  const h = esc(href);
  const l = esc(label);
  return `
<!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${h}" style="height:46px;v-text-anchor:middle;width:${width}px;" arcsize="18%" strokecolor="${border}" fillcolor="${bg}">
<w:anchorlock/><center style="color:${color};font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">${l}</center>
</v:roundrect>
<![endif]-->
<!--[if !mso]><!-->
<a href="${h}" target="_blank" style="display:inline-block;background:${bg};border:1.5px solid ${border};color:${color};font-family:${FONT};font-size:15px;font-weight:700;line-height:46px;text-align:center;text-decoration:none;width:${width}px;border-radius:8px;-webkit-text-size-adjust:none;mso-hide:all;">${l}</a>
<!--<![endif]-->`;
}

function documentShell({ lang, title, preheader, body }) {
  return `<!doctype html>
<html lang="${lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
  @media only screen and (max-width: 620px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .stack { display: block !important; width: 100% !important; max-width: 100% !important; }
    .stack-gap { padding-top: 10px !important; padding-left: 0 !important; padding-right: 0 !important; }
    .h1 { font-size: 24px !important; line-height: 1.2 !important; }
    .hide-sm { display: none !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};word-spacing:normal;">
<div style="display:none;font-size:1px;color:${C.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${esc(preheader)}${'&#8203;&#847;&zwnj;&nbsp;'.repeat(40)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
<tr><td align="center" style="padding:24px 12px 32px;">
<!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
${body}
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;
}

const p = (text, style = '') =>
  `<p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.6;color:${C.ink2};${style}">${text}</p>`;

module.exports = { esc, FONT, C, button, documentShell, p };
