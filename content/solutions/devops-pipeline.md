---
slug: devops-pipeline
date: "2026-05-04"
featured: true
tags:
  - docker
  - github-actions
title:
  nl: "Deployment pipeline"
  en: "Deployment pipeline"
summary:
  nl: "Consistente lokale en server-omgeving met Docker Compose en SSH-deploy."
  en: "Consistent local and server environment with Docker Compose and SSH deploy."
body:
  nl: |
    ## Focus

    Reproduceerbare builds en veilige uitrol zonder handmatige stappen.

    ## Uitkomst

    Push naar main of handmatige trigger activeert build en deploy.
  en: |
    ## Focus

    Reproducible builds and secure rollout without manual steps.

    ## Outcome

    Push to main or manual trigger starts build and deploy.
flow:
  problem:
    title:
      nl: "Inconsistente omgeving"
      en: "Inconsistent environments"
    description:
      nl: "Lokaal en server liepen uit elkaar, waardoor bugs moeilijk reproduceerbaar waren."
      en: "Local and server environments drifted, making bugs hard to reproduce."
  magic:
    title:
      nl: "Container-first"
      en: "Container-first"
    description:
      nl: "Zelfde image en compose-profiel voor development en productie-simulatie."
      en: "Same image and compose profile for development and production simulation."
    repoUrl: "https://github.com/sim007/simmagic"
  solution:
    title:
      nl: "Automatische uitrol"
      en: "Automated rollout"
    description:
      nl: "GitHub Actions deployt via SSH met secrets en restart compose op de server."
      en: "GitHub Actions deploys via SSH with secrets and restarts compose on server."
---

Managed by Decap CMS.
