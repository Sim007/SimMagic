# SimMagic

**NL:** Een tweetalige open-source website voor GitHub-gebruiker sim007.  
**EN:** A bilingual open-source website for GitHub user sim007.

---

## Snel starten / Quick Start

### Nederlands

**Vereisten:** Node.js 20+ en npm 10+

**Stap 1 — Dependencies installeren** (eenmalig, of na `git pull`):
```bash
npm ci
```

**Stap 2 — Site starten:**
```bash
npm run dev
```

Site is daarna bereikbaar op:
- http://localhost:3000/nl
- http://localhost:3000/en

**Stap 3 — CMS starten** (apart terminal-venster, optioneel):
```bash
npm run cms:proxy
```

CMS is daarna bereikbaar op:
- http://localhost:3000/admin (GitHub OAuth vereist)
- http://localhost:3000/admin?local_backend=true (geen login nodig, werkt alleen als proxy draait)

### English

**Requirements:** Node.js 20+ and npm 10+

**Step 1 — Install dependencies** (once, or after `git pull`):
```bash
npm ci
```

**Step 2 — Start the site:**
```bash
npm run dev
```

Site is then available at:
- http://localhost:3000/nl
- http://localhost:3000/en

**Step 3 — Start the CMS** (separate terminal window, optional):
```bash
npm run cms:proxy
```

CMS is then available at:
- http://localhost:3000/admin (GitHub OAuth required)
- http://localhost:3000/admin?local_backend=true (no login needed, only works when proxy is running)

---

## Bouwen en zoekindex / Build and Search Index

### Nederlands

De zoekfunctie werkt op basis van een statische Pagefind-index. Die index wordt aangemaakt tijdens de build en opgeslagen in `public/pagefind/`. De dev-server (`npm run dev`) gebruikt altijd de index van de laatste build.

| Commando | Omschrijving |
|---|---|
| `npm run build` | Productie-build + zoekindex aanmaken |
| `npm start` | Productieserver starten (na `npm run build`) |
| `npm run pagefind` | Alleen de zoekindex herbouwen (na een bestaande build) |

> Na het toevoegen of wijzigen van content moet je opnieuw `npm run build` draaien om de zoekindex bij te werken.

### English

The search function is based on a static Pagefind index. This index is created during the build and stored in `public/pagefind/`. The dev server (`npm run dev`) always uses the index from the last build.

| Command | Description |
|---|---|
| `npm run build` | Production build + create search index |
| `npm start` | Start production server (after `npm run build`) |
| `npm run pagefind` | Rebuild search index only (after an existing build) |

> After adding or modifying content, run `npm run build` again to update the search index.

---

## Testen / Testing

### Nederlands

| Commando | Type | Omschrijving |
|---|---|---|
| `npm test` | Unit + Integratie | Vitest eenmalig draaien |
| `npm run test:watch` | Unit + Integratie | Vitest in watch-mode (herstart bij wijzigingen) |
| `npm run test:coverage` | Unit + Integratie | Vitest met coverage-rapport (uitvoer in `coverage/`) |
| `npm run test:e2e` | E2E | Playwright in terminal (start dev-server automatisch) |
| `npm run test:e2e:ui` | E2E | Playwright met visuele UI |
| `npm run test:all` | Alle | Vitest + Playwright achter elkaar |
| `npm run test:all:report` | Alle | Zelfde + sla uitvoer op in `reports/all-tests-report.txt` |
| `npm run test:all:html` | Alle | Zelfde + genereer `reports/all-tests-report.html` (dashboard) |

**Teststructuur:**

```
src/tests/
  setup.ts                        — globale mocks (matchMedia, jest-dom)
  unit/
    i18n.test.ts                  — locale-helpers
    messages.test.ts              — vertaalfunctie t()
    search.test.ts                — labelForType() helper voor zoekresultaten
  integration/
    ThemeProvider.test.tsx        — dark/light toggle (React Testing Library)
    SearchBar.test.tsx            — zoekbalk met gemockte Pagefind API
  e2e/
    site.spec.ts                  — homepage, navigatie, taalswitch, thema, zoeken, 404
```

### English

| Command | Type | Description |
|---|---|---|
| `npm test` | Unit + Integration | Run Vitest once |
| `npm run test:watch` | Unit + Integration | Vitest in watch mode (restarts on changes) |
| `npm run test:coverage` | Unit + Integration | Vitest with coverage report (output in `coverage/`) |
| `npm run test:e2e` | E2E | Playwright in terminal (auto-starts dev server) |
| `npm run test:e2e:ui` | E2E | Playwright with visual UI |
| `npm run test:all` | All | Vitest + Playwright sequentially |
| `npm run test:all:report` | All | Same + save output to `reports/all-tests-report.txt` |
| `npm run test:all:html` | All | Same + generate `reports/all-tests-report.html` (dashboard) |

**Test structure:**

```
src/tests/
  setup.ts                        — global mocks (matchMedia, jest-dom)
  unit/
    i18n.test.ts                  — locale helpers
    messages.test.ts              — translation function t()
    search.test.ts                — labelForType() helper for search results
  integration/
    ThemeProvider.test.tsx        — dark/light toggle (React Testing Library)
    SearchBar.test.tsx            — search bar with mocked Pagefind API
  e2e/
    site.spec.ts                  — homepage, navigation, language switch, theme, search, 404
```

---

## Docker Compose

### Nederlands

Development-container starten:

```bash
docker compose up --build simmagic-dev
```

Productie-achtige container starten:

```bash
docker compose up --build simmagic-prod
```

Poorten:
- simmagic-dev: 3000
- simmagic-prod: 3001

### English

Run development container:

```bash
docker compose up --build simmagic-dev
```

Run production-like container:

```bash
docker compose up --build simmagic-prod
```

Ports:
- simmagic-dev: 3000
- simmagic-prod: 3001

---

## Inhoudsstructuur / Content Structure

### Nederlands

- `content/pages` — statische paginacontent (home, about, model, solutions, blog)
- `content/blog` — blogposts
- `content/solutions` — projecten met model-flow
- `content/navigation.md` — menu-items beheerd via CMS
- `messages/nl.json` en `messages/en.json` — UI-labels en systeemtekst

### English

- `content/pages` — static page content (home, about, model, solutions, blog)
- `content/blog` — blog posts
- `content/solutions` — projects with model-flow
- `content/navigation.md` — menu items managed by CMS
- `messages/nl.json` and `messages/en.json` — UI labels and system text

---

## Blogpost publiceren / Publish a Blog Post

### Nederlands

**Optie 1: Decap CMS**
1. Open `/admin`
2. Login via GitHub OAuth
3. Maak een nieuw item aan in Blogposts
4. Vul NL- en EN-velden in
5. Sla op en publiceer

**Optie 2: Markdown in git**
1. Voeg een bestand toe in `content/blog`
2. Gebruik frontmatter-velden: `slug`, `date`, `tags`, `title`, `summary`, `body`
3. Commit en push

### English

**Option 1: Decap CMS**
1. Open `/admin`
2. Login via GitHub OAuth
3. Create a new entry in Blogposts
4. Fill in NL and EN fields
5. Save and publish

**Option 2: Markdown in git**
1. Add a file in `content/blog`
2. Use frontmatter fields: `slug`, `date`, `tags`, `title`, `summary`, `body`
3. Commit and push

---

## Nieuwe pagina toevoegen / Add a New Page

### Nederlands

1. Open in Decap CMS de collectie Pagina's
2. Maak een markdown-bestand aan met `slug` en tweetalige velden
3. Voeg de pagina toe aan de navigatie via Navigatie → Menu (geen codewijziging nodig)

### English

1. In Decap CMS, open the Pagina's collection
2. Create a markdown file with `slug` and bilingual fields
3. If it should appear in navigation, add it via Navigatie → Menu (no code change required)

---

## Nieuwe taal toevoegen / Add a New Language

### Nederlands

De huidige implementatie ondersteunt NL en EN. Om een taal toe te voegen:

1. Voeg een nieuwe locale toe in `src/lib/i18n.ts`
2. Voeg `messages/<locale>.json` toe
3. Voeg locale-velden toe in de CMS-configuratie (`public/admin/config.yml`)
4. Werk content-lokalisatievelden bij waar nodig
5. Voeg routegeneratie toe voor de nieuwe locale

### English

The current implementation supports NL and EN. To add a language:

1. Add a new locale in `src/lib/i18n.ts`
2. Add `messages/<locale>.json`
3. Add locale fields in the CMS config (`public/admin/config.yml`)
4. Update content localization fields where needed
5. Update route generation for the new locale

---

## Decap CMS OAuth

### Nederlands

De huidige CMS-backend is geconfigureerd voor de GitHub-repository `sim007/simmagic`.

Stel deze waarden in `public/admin/config.yml` in voor jouw server:
- `backend.base_url`
- `backend.auth_endpoint`

Typische installatiestappen:
1. Draai een OAuth-bridge voor Decap (zelf gehost)
2. Registreer een GitHub OAuth-app met callback-URL naar jouw bridge
3. Configureer de bridge met GitHub client ID, GitHub client secret en repo-toegangsbeleid
4. Zorg dat de callback- en basis-URL HTTPS zijn

### English

The current CMS backend config targets GitHub repository `sim007/simmagic`.

Set these values in `public/admin/config.yml` for your server:
- `backend.base_url`
- `backend.auth_endpoint`

Typical setup steps:
1. Run an OAuth bridge service for Decap (self-hosted)
2. Register a GitHub OAuth app with callback URL pointing to your bridge
3. Configure the bridge with GitHub client ID, GitHub client secret, and repo access policy
4. Ensure callback and base URL are HTTPS

---

## GitHub Actions-deployment / GitHub Actions Deployment

### Nederlands

Workflow-bestand: `.github/workflows/deploy.yml`

Triggers:
- Push naar `main`
- Handmatig via `workflow_dispatch`

Vereiste GitHub-secrets — configureer via Settings → Secrets and variables → Actions:

| Naam | Omschrijving | Voorbeeldwaarde |
|---|---|---|
| `SSH_HOST` | Hostnaam of IP van je server | `203.0.113.42` |
| `SSH_USER` | SSH-gebruikersnaam op de server | `deploy` |
| `SSH_PRIVATE_KEY` | Volledig PEM-gecodeerde privésleutel | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_APP_DIR` | Absoluut pad naar de projectmap op de server | `/opt/simmagic` |

Optioneel — stel in als repository-variabele (geen secret):

| Naam | Omschrijving | Voorbeeldwaarde |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Publieke URL van je site | `https://simmagic.example.com` |

Instapstappen op de server:
1. Maak het deploy-gebruikersaccount aan
2. Genereer een SSH-sleutelpaar: `ssh-keygen -t ed25519 -C "github-actions"`
3. Voeg de publieke sleutel toe aan `~/.ssh/authorized_keys` op de server
4. Voeg de privésleutel toe als GitHub-secret `SSH_PRIVATE_KEY`
5. Installeer Docker en Docker Compose op de server
6. Clone de repository eenmalig handmatig naar `SERVER_APP_DIR`
7. Volgende deploys verlopen automatisch bij elke push naar `main`

### English

Workflow file: `.github/workflows/deploy.yml`

Triggers:
- Push to `main`
- Manual via `workflow_dispatch`

Required GitHub secrets — configure under Settings → Secrets and variables → Actions:

| Secret name | Description | Example value |
|---|---|---|
| `SSH_HOST` | Hostname or IP of your server | `203.0.113.42` |
| `SSH_USER` | SSH username on the server | `deploy` |
| `SSH_PRIVATE_KEY` | Full PEM-encoded private key | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `SERVER_APP_DIR` | Absolute path to the project folder on the server | `/opt/simmagic` |

Optional — set as repository variable (not secret):

| Variable name | Description | Example value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | `https://simmagic.example.com` |

Setup steps on the server:
1. Create the deploy user account
2. Generate an SSH key pair: `ssh-keygen -t ed25519 -C "github-actions"`
3. Add the public key to `~/.ssh/authorized_keys` on the server
4. Add the private key as GitHub secret `SSH_PRIVATE_KEY`
5. Install Docker and Docker Compose on the server
6. Clone the repository into `SERVER_APP_DIR` once manually
7. Subsequent deploys happen automatically on push to `main`

---

## Zoeken / Search

### Nederlands

De Pagefind-index wordt aangemaakt tijdens de build:
- `npm run build` voert de Next.js-build én Pagefind-indexering uit

Gedrag van de zoekbalk:
- Zichtbaar op elke pagina onder de navigatie
- Standaard gefilterd op de actieve taal (nl of en)
- Geeft titel, type, fragment en directe link terug

### English

The Pagefind index is generated during the build:
- `npm run build` runs the Next.js build and Pagefind indexing

Search bar behavior:
- Visible on every page below the navigation
- Defaults to the active language filter (nl or en)
- Returns title, type, snippet, and direct link

---

## Versies / Versions

| Package | Version |
|---|---|
| Next.js | 16.2.4 |
| React | 19.2.5 |
| TypeScript | 5.8.3 |
| Tailwind CSS | 3.4.17 |
| Pagefind | 1.3.0 |
| Decap CMS (CDN) | 3.3.3 |
| Decap Server (proxy) | 3.7.0 |
| Node.js (required) | 20+ |

---

## Open Source

**NL:** Deze repository is volledig open source en bedoeld om uitgebreid te worden via content en CMS-configuratie.  
**EN:** This repository is fully open source and intended for extension through content and CMS configuration.

Repository: https://github.com/sim007/simmagic
