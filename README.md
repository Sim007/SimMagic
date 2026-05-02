# SimMagic

SimMagic is a bilingual open-source website for GitHub user sim007.

Core stack:
- Next.js (App Router)
- Tailwind CSS (dark by default, accent cyan #06b6d4)
- Decap CMS with markdown content
- Pagefind search index generated during build
- Docker Compose for consistent local/server environment

## Repository

- GitHub: https://github.com/sim007/simmagic
- CMS route: /admin
- Locales: /nl and /en

## Local Development

Requirements:
- Node.js 20+
- npm 10+

Install and run:

```bash
npm ci
npm run dev
```

Open:
- http://localhost:3000/nl
- http://localhost:3000/en

## Production Simulation on Laptop

```bash
npm ci
npm run build
npm start
```

This runs the production server locally, including static page generation and Pagefind index creation.

## Docker Compose

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

## Content Structure

- content/pages: static page content (home, about, model, solutions, blog)
- content/blog: blog posts
- content/solutions: projects with model-flow
- content/navigation.md: menu items managed by CMS
- messages/nl.json and messages/en.json: UI labels and system text

## Publish a Blog Post

Option 1: Decap CMS
1. Open /admin
2. Login via GitHub OAuth
3. Create a new entry in Blogposts
4. Fill NL and EN fields
5. Save and publish

Option 2: Markdown in git
1. Add a file in content/blog
2. Use frontmatter fields: slug, date, tags, title, summary, body
3. Commit and push

## Add a New Page

1. In Decap CMS, open Pagina's collection
2. Create a page markdown file with slug and bilingual fields
3. If it should be in navigation, add it in Navigatie -> Menu
4. The menu is read from content/navigation.md, so no code change is required

## Add a New Language

Current implementation is built for NL and EN.

To add a language:
1. Add a new locale in src/lib/i18n.ts
2. Add messages/<locale>.json
3. Add locale fields in CMS config (public/admin/config.yml)
4. Update content localization fields where needed
5. Update route generation for the new locale

## Decap CMS OAuth Setup

Current CMS backend config targets GitHub repository sim007/simmagic.

Set these values in public/admin/config.yml for your server:
- backend.base_url
- backend.auth_endpoint

Typical setup flow:
1. Run an OAuth bridge service for Decap (self-hosted endpoint)
2. Register GitHub OAuth app with callback URL to your bridge
3. Configure bridge with:
   - GitHub client ID
   - GitHub client secret
   - repo access policy
4. Ensure callback and base URL are HTTPS

## GitHub Actions Deployment

Workflow file:
- .github/workflows/deploy.yml

Triggers:
- push to main
- workflow_dispatch

Required GitHub secrets — configure these under Settings → Secrets and variables → Actions:

| Secret name      | Description                                                     | Example value                   |
|------------------|-----------------------------------------------------------------|---------------------------------|
| SSH_HOST         | Hostname or IP of your server                                   | 203.0.113.42                    |
| SSH_USER         | SSH username on the server                                      | deploy                          |
| SSH_PRIVATE_KEY  | Full PEM-encoded private key matching the user's authorized_key | -----BEGIN OPENSSH PRIVATE KEY----- ... |
| SERVER_APP_DIR   | Absolute path to the project folder on the server              | /opt/simmagic                   |

Optional — set as repository variable (not secret):

| Variable name          | Description                | Example value                       |
|------------------------|----------------------------|-------------------------------------|
| NEXT_PUBLIC_SITE_URL   | Public URL of your site    | https://simmagic.example.com        |

Setup steps on the server:
1. Create the deploy user account
2. Generate an SSH key pair: `ssh-keygen -t ed25519 -C "github-actions"`
3. Add the public key to `~/.ssh/authorized_keys` on the server
4. Add the private key as GitHub secret `SSH_PRIVATE_KEY`
5. Install Docker and Docker Compose on the server
6. Clone the repository into `SERVER_APP_DIR` once manually
7. Subsequent deploys happen automatically on push to main

The workflow builds the project and deploys through SSH to your own server.

## Search

Pagefind index is generated during build:
- npm run build runs Next build and Pagefind indexing

Search bar behavior:
- visible on every page under navigation
- defaults to active language filter (nl or en)
- returns title, type, snippet, and direct link

## Open Source

This repository is fully OSS and intended for extension through content and CMS configuration.
