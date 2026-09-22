# DATASHEQ — website

Bilingual (ES/EN) company site built from the design PDF, with a **Contáctanos** form that:

1. sends the full request to your team's inbox via **SendGrid**, and
2. sends the client an HTML confirmation email (notice at the top: *"we received your message and will contact you as soon as possible"*, followed by a compact summary of the site).

Stack: Node.js 22 + Express 5, server-rendered HTML, no build step, no external requests (fonts are self-hosted).

---

## Project structure

```
server.js                    Express app: pages, /api/contact, /qr.svg, /app, /healthz
src/content.js               ← ALL site text (ES/EN), contact data, modules, news. Edit here.
src/views/page.js            Page template (header, sections, modals, form)
src/validate.js              Server-side validation + anti-spam (honeypot, timing)
src/mailer.js                SendGrid wrapper (dev mode saves emails to ./.mail-outbox)
src/emails/clientConfirmation.js    HTML + text email to the client
src/emails/internalNotification.js  HTML + text email to your team
public/                      CSS, JS, images, fonts
scripts/preview-emails.js    Writes email previews to ./email-previews
railway.json                 Railway build/deploy settings (healthcheck on /healthz)
```

## Run locally

```bash
npm install
cp .env.example .env     # optional — without SendGrid keys, emails are saved to ./.mail-outbox
npm run dev              # http://localhost:3000   (English: /en)
npm run preview:emails   # open ./email-previews/*.html to see both emails
```

## Deploy to Railway

1. Push this folder to a GitHub repository (the `.gitignore` already excludes `node_modules`, `.env`, previews).
2. In Railway: **New Project → Deploy from GitHub repo** → pick the repo. Railway detects Node and runs `npm start`.
3. **Service → Variables**: add the variables below.
4. **Service → Settings → Networking → Generate Domain** (or add your custom domain, e.g. `datasheq.com`).
5. Open `https://<your-domain>/healthz` — it should show `"mail": { "configured": true }`.

Alternative without GitHub: install the Railway CLI, then `railway login`, `railway init`, `railway up` from this folder.

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `SENDGRID_API_KEY` | yes | API key with **Mail Send** permission |
| `SENDGRID_FROM_EMAIL` | yes | Sender address — must be verified in SendGrid |
| `SENDGRID_FROM_NAME` | no | Sender name (default `DATASHEQ`) |
| `CONTACT_TO_EMAIL` | yes | Address(es) that receive each request, comma-separated |
| `CLIENT_REPLY_TO` | no | Reply-To on the client email (default: first `CONTACT_TO_EMAIL`) |
| `PUBLIC_BASE_URL` | no | e.g. `https://datasheq.com`. Used for the logo/links in emails and the QR. Defaults to Railway's public domain |
| `SENDGRID_SANDBOX` | no | `true` = SendGrid validates but doesn't deliver (testing) |
| `SENDGRID_DATA_RESIDENCY` | no | `eu` only for EU-residency SendGrid subusers |
| `CONTACT_RATE_LIMIT` | no | Successful submissions per IP per 10 min (default 5) |

## SendGrid setup (one time)

1. **Settings → Sender Authentication**: authenticate the domain `datasheq.com` (adds DNS records — best deliverability), or at least verify a **Single Sender** for the `SENDGRID_FROM_EMAIL` address.
2. **Settings → API Keys → Create API Key** → *Restricted Access* → enable **Mail Send** only. Copy it into `SENDGRID_API_KEY`.
3. Test: set `SENDGRID_SANDBOX=true`, submit the form, check Railway logs (no errors = payload accepted). Then set it back to `false`.

No SendGrid template is needed — both emails are rendered by the app (`src/emails/`), so they always match the site content in `src/content.js`.

## How the contact flow works

- Every **Contáctanos** button (header, hero, module cards, news, footer) opens the contact window. Module cards pre-select that module. The same form also appears inline in the Contact section.
- Fields: name, job title, work email, phone/WhatsApp, company, industry, company size, city/region, solutions of interest, preferred contact channel, message, consent.
- Validation runs in the browser and again on the server. Spam protection: hidden honeypot field, minimum fill time, rate limit per IP.
- The team email is sent first (Reply-To = the client, so you can just hit *Reply*). If it fails, the user sees an error and can retry or use WhatsApp. The client confirmation goes second, in the language the client used.

## Things to fill in / confirm (`src/content.js`)

Look for `EDITAR` in that file.

- **WhatsApp number** (`whatsappNumber`, `whatsappDisplay`) — placeholder `+56 9 0000 0000`.
- **Public email** — set to `contacto@datasheq.com` (the PDF note was cut off at "contacto....").
- **Google Play / App Store links** — empty for now; buttons go to the contact section and the QR goes to `/app` until you add them. Once set, the QR sends Android users to Google Play and iPhone users to the App Store.
- **C-Previene** subtitle — the PDF says "Gestor Documental", which is close to C-Controla ("Control Documental"). Confirm.
- **Draft copy** — Nosotros, Misión, Visión, module descriptions and the full text of the 3 news items were written for this build; review them.
- **Logo** — `public/assets/logo.svg` is a vector rebuild of the logo in the PDF (the PDF only contains a low-resolution version). Replace it with the original vector logo if you have it; also regenerate `public/assets/logo-email.png` (300×184 px, white background) used in the emails.
- **Mockup images** (`hero.jpg`, `phone.jpg`) are extracted from the PDF, which is compressed. Higher-resolution originals will look sharper.
- **Store buttons** are plain text buttons; you may swap in the official Google Play / App Store badges once the app is published.
