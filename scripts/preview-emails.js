// Generates HTML previews of both emails in ./email-previews (open them in a browser).
// Usage: npm run preview:emails
const fs = require('node:fs');
const path = require('node:path');
const { renderClientConfirmation } = require('../src/emails/clientConfirmation');
const { renderInternalNotification } = require('../src/emails/internalNotification');

const baseUrl = (process.env.PUBLIC_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const out = path.join(__dirname, '..', 'email-previews');
fs.mkdirSync(out, { recursive: true });

const sample = (lang) => ({
  name: lang === 'es' ? 'Camila Rojas' : 'Camila Rojas',
  position: lang === 'es' ? 'Jefa de Prevención de Riesgos' : 'HSE Manager',
  email: 'camila.rojas@empresa.cl',
  phone: '+56 9 8765 4321',
  company: 'Minera Ejemplo SpA',
  industry: 'mineria',
  companySize: '201-1000',
  location: 'Antofagasta',
  solutions: ['c-legal', 'c-acredita', 'c-investiga'],
  contactPreference: 'whatsapp',
  message:
    lang === 'es'
      ? 'Tenemos 3 faenas y necesitamos controlar el cumplimiento legal y la acreditación de contratistas.\nNos interesa una demo la próxima semana.'
      : 'We run 3 sites and need to track legal compliance and contractor accreditation.\nWe would like a demo next week.',
  consent: true,
  lang,
  source: 'modal',
});

for (const lang of ['es', 'en']) {
  const c = renderClientConfirmation({ lead: sample(lang), baseUrl });
  fs.writeFileSync(path.join(out, `client-confirmation-${lang}.html`), c.html);
  fs.writeFileSync(path.join(out, `client-confirmation-${lang}.txt`), c.text);
}
const i = renderInternalNotification({
  lead: sample('es'),
  meta: { ip: '200.1.2.3', userAgent: 'Mozilla/5.0 (preview)', receivedAt: new Date(), baseUrl },
});
fs.writeFileSync(path.join(out, 'internal-notification.html'), i.html);
fs.writeFileSync(path.join(out, 'internal-notification.txt'), i.text);

console.log(`Previews written to ${path.relative(process.cwd(), out)}/`);
