---
slug: simmagic-site
date: "2026-05-02"
featured: true
tags:
  - nextjs
  - cms
title:
  nl: "SimMagic website"
  en: "SimMagic website"
summary:
  nl: "Tweetalige OSS-site met Decap CMS, model-flow en lokale zoekindex."
  en: "Bilingual OSS site with Decap CMS, model flow, and local search index."
body:
  nl: |
    ## Doel

    Een schaalbare website waar content en navigatie zonder codewijziging beheerd kunnen worden.

    ## Kern

    Next.js + Tailwind + Decap CMS + Pagefind.
  en: |
    ## Goal

    A scalable website where content and navigation can be managed without code changes.

    ## Core

    Next.js + Tailwind + Decap CMS + Pagefind.
flow:
  problem:
    title:
      nl: "Content in code"
      en: "Content trapped in code"
    description:
      nl: "Pagina-updates kostten telkens een deploy en codewijziging."
      en: "Page updates required deploys and code changes every time."
    codeSnippet: "const content = \"hardcoded\";"
  magic:
    title:
      nl: "CMS + i18n"
      en: "CMS + i18n"
    description:
      nl: "Content in markdown met NL/EN velden en centrale rendering."
      en: "Markdown content with NL/EN fields and centralized rendering."
    repoUrl: "https://github.com/sim007/simmagic"
  solution:
    title:
      nl: "Herbruikbare site"
      en: "Reusable site"
    description:
      nl: "Beheerbare, zoekbare en tweetalige website die lokaal en op server draait."
      en: "Manageable, searchable, bilingual website running locally and on server."
    demoUrl: "https://simmagic.example.com"
---

Managed by Decap CMS.
