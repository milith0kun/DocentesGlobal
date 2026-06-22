# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js 16 + Turbopack, port 3000)
npm run build        # Production build
npm run lint         # ESLint

# Run the single test file (Node built-in test runner)
node --test src/utils/emailValidation.test.js

# Verify Google Sheets + Drive integration is configured correctly
npm run verify:integrations

# Generate Google OAuth URL and exchange code for refresh token
npm run google:oauth:url
npm run google:oauth:token

# Initialize Google Sheet with correct headers (run once)
node scripts/init-sheet.js
```

> `npm run dev` and `npm run build` both prepend `node scripts/patch-next-webpack-loaders.cjs`, which patches Next.js webpack loaders to support `@react-pdf/renderer`. Do not skip this step.

## Architecture

### Public registration flow
The site is a teacher onboarding form for CGB Academy (brands: CIIP Latam, Geomina, Biomedic). The main page (`src/app/page.jsx`) is a thin wrapper that renders `<Home>` from `src/components/Home.jsx`, which renders a landing with `<OnboardingWizard>` — an 11-step multi-screen form that collects teacher data, files (CV + photo), and conformity acceptances.

The wizard is split across `src/components/wizard/`:
- `config/wizard-config.js` — `marcaConfig`, `stepLabels`, `stepWidths`, `phoneCountries`, asset paths
- `steps/Step01Marca.jsx` … `Step11Perfil.jsx`, `StepSuccess.jsx` — one file per step
- `ui/DatePicker.jsx`, `ui/PhoneInput.jsx` — reusable UI primitives
- `WizardHeader.jsx`, `WizardStepper.jsx` — layout shell components

`OnboardingWizard.jsx` itself (~470 lines) holds all state and handlers, renders the shell, and delegates each step to its component.

On submit, `POST /api/submit` orchestrates:
1. **Google Drive** — creates a folder per teacher (or uses fixed folders) and uploads CV, photo, and a generated PDF
2. **Google Sheets** — appends a row with all data + Drive links
3. **MongoDB** — upserts a normalized `docentes` document via `src/lib/docente-repository.js`

### Admin dashboard
`/admin` → `src/app/admin/page.jsx` (thin wrapper → `<AdminLogin>`)  
`/admin/dashboard` → `src/app/admin/dashboard/page.jsx` (thin wrapper → `<AdminDashboard>`)  
Both routes protected by `src/proxy.js` (Next.js 16 proxy — equivalent of middleware).

`src/lib/admin-auth.js` — signs/verifies session tokens using `crypto.subtle` (works in both Edge and Node). Token is `base64url(payload).HMAC-signature`.

Admin components live in `src/components/admin/`:
- `AdminLogin.jsx` — login form with credential submit
- `AdminDashboard.jsx` — state + fetch orchestrator
- `AdminTopbar.jsx`, `AdminStats.jsx`, `AdminControls.jsx` — UI fragments
- `DocentesTable.jsx`, `DocenteModal.jsx` — table + detail modal

Shared helpers in `src/lib/admin-utils.js`: `formatDate`, `brandTag`, `MARCA_OPTIONS`.

The dashboard fetches from:
- **MongoDB** (paginated, searchable, default)
- **Google Sheets** (all rows, via `readAllDocentes()` in `google-sheets.js`)

### Dual storage pattern
Every form submission writes to both MongoDB and Google Sheets. MongoDB is the primary structured store; Sheets is a human-readable ledger. The `google-sheets.js` `HEADER_MATCHERS` array allows the sheet to have any column order or renamed headers — they are matched by fuzzy alias matching against known keys.

### Google authentication
Two auth modes coexist in `src/lib/google-auth.js`:
- **Service account** (inline env vars `GOOGLE_SERVICE_ACCOUNT_EMAIL` + `GOOGLE_PRIVATE_KEY`, or `GOOGLE_APPLICATION_CREDENTIALS` file) — used for Sheets and basic Drive
- **OAuth2 refresh token** (env vars `GOOGLE_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN`) — used for Drive when the service account lacks storage quota on regular folders

`getGoogleAuth()` returns the service account client; `getGoogleDriveAuth()` prefers OAuth2 if configured, falls back to service account.

### PDF generation
`src/lib/pdf-generator.jsx` uses `@react-pdf/renderer` to produce the "Declaración de Compromiso" PDF server-side. It is declared as a `serverExternalPackage` in `next.config.mjs` to avoid bundling issues. Preview endpoint: `GET /api/preview-pdf`.

### Rate limiting
`src/lib/request-security.js` exports an in-memory rate limiter (Map-based, resets per window). Applied to `POST /api/submit` (8 req/10 min) and `POST /api/admin/login` (10 req/15 min).

## Styling convention

All styles live in `src/app/globals.css` — **no CSS modules, no Tailwind**. CSS custom properties:

```
--primary, --primary-hover, --primary-light-bg
--font-heading (Sora), --font-body (Manrope)
--card-bg, --card-border, --glass-bg
--shadow-sm/md/lg/primary
--transition-fast/normal/bounce
```

Class name prefixes by area (avoid collisions):
- `wz-` — OnboardingWizard and wizard step components
- `adm-` — admin panel components
- `premium-navbar`, `nav-` — Navbar component
- `site-footer`, `footer-` — Footer component

Some older/smaller components still use inline `<style>{`...`}</style>` blocks inside JSX. New components should put styles in `globals.css`.

Brand colors: CIIP `#0284c7`, Geomina `#0ea5e9`, Biomedic `#06b6d4`.

### Page file convention
All `app/**/page.jsx` files are thin wrappers (4 lines) that import and render a single component from `src/components/`. All logic, state, and JSX live in the component, not in the page file.

## Key environment variables

```
# Google (service account)
GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY
GOOGLE_SPREADSHEET_ID, GOOGLE_SHEET_GID, GOOGLE_SHEET_NAME

# Google Drive
GOOGLE_DRIVE_ROOT_FOLDER_ID           # creates per-teacher subfolders
GOOGLE_DRIVE_CV_FOLDER_ID             # OR use fixed folders (Google Form style)
GOOGLE_DRIVE_FOTO_FOLDER_ID

# Google OAuth (optional, for Drive with shared drives)
GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REFRESH_TOKEN

# MongoDB
MONGODB_URI, MONGODB_DB_NAME          # default DB: contrata_docentes

# RENIEC API
RENIEC_API_TOKEN                      # DNI auto-fill in the wizard

# Admin panel
ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET
```

## Next.js 16 notes

- The file is `src/proxy.js` (not `middleware.js`) and exports `proxy` (not `middleware`). This is a Next.js 16 breaking rename.
- `distDir` can be overridden via `NEXT_DIST_DIR` env var.
- `serverExternalPackages: ['@react-pdf/renderer']` in `next.config.mjs` is required.
