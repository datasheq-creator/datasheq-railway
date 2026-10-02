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

The C-Legal site (clegal-railway) uses exactly the same variables, so both Railway services are configured the same way.


| Variable | Required | Purpose |
|---|---|---|
| `SENDGRID_API_KEY` | yes | API key with **Mail Send** permission |
| `SENDGRID_FROM_EMAIL` | yes | Sender address — must be verified in SendGrid |
| `SENDGRID_FROM_NAME` | no | Sender name (default `DATASHEQ`) |
| `CONTACT_TO_EMAIL` | yes | Company inbox(es) that receive each request, comma-separated |
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

- **App Store / Google Play links** (`settings.app`) — empty for now. The store icons and the two QR codes go to `/app/ios` and `/app/android`, which redirect to these links; until they are set they open the "Descarga nuestra app" section. Once set, the QR codes work without being regenerated.
- **C-Previene** subtitle — "Gestor Documental" is close to C-Controla's "Control Documental". Confirm.
- **Plans** — prices and features come from the design; edit `plans` to change them. "Contratar" / "Empezar gratis" / "Contáctanos" open the contact form with the plan preselected.
- **News** — the three items' full text was drafted; review them.
- **Inicio de Sesión** links to `settings.loginUrl` (`https://app.datasheq.com`).

## Design reference

- Palette: purple `#a608f9` (accent), dark `#18182e` (titles), `#14253b` (plan names / prices / active language), `#4b586b` (body), `#63d77f` (bullets), `#e5e9ec` (form panel).
- Font: the designs use **Helvetica Now Display**, a licensed font. The CSS asks for it first and falls back to Inter (self-hosted). To use Helvetica Now on the site, add its `.woff2` files to `public/fonts/` and declare them with `@font-face` at the top of `public/css/styles.css`.
- Images in `public/assets/` come from the "Images Datasheq" folder; the C-Legal phone, the app phone and the 01/02 mockups were cut from the "TAMAÑOS TEXTOS" design files.
