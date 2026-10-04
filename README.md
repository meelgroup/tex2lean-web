# Tex2Lean tutorial website

A responsive, static guide for paper authors using the Tex2Lean VS Code extension. The page covers installation, connection, setup, scanning, theorem review, proof work, verification, advanced workflows, and FAQ.

The reviewed editorial plan and its source evidence are in [docs/content-plan.md](docs/content-plan.md).

## Local preview

Requires Node.js 22+ and Python 3. No packages need to be installed.

```sh
npm run check
npm run build
npm run preview
```

Open http://localhost:4173. The root page also works without a build; the build explicitly copies only public assets to `_site/`.

## GitHub Pages

The Pages workflow validates and builds on every push to `main`, then uploads `_site/` and deploys it using GitHub Actions. Configure **Settings → Pages → Build and deployment → Source → GitHub Actions**. The expected project URL is https://meelgroup.github.io/tex2lean-web/.

This repository's visibility is maintained as configured. Private repository Pages requires a supported GitHub plan; the public tutorial artifact does not include this README, the content plan, or scripts.

Relative asset links support the project path without a custom domain. No custom domain is configured.

## Editing

- `index.html`: all tutorial and FAQ content; readable without JavaScript.
- `assets/styles.css`: responsive layout, keyboard focus, and reduced-motion support.
- `assets/main.js`: mobile menu, FAQ deep links, and active navigation section.
- `assets/icon.svg`: existing Tex2Lean Marketplace mark, reused from the extension.
- `scripts/check.py`: local link, image-alt, and heading validation.

Review extension implementation when updating copy: several extension design notes describe historical or proposed behavior. Avoid claims of guaranteed proof completion, unconditional results with Prior hypotheses, or semantic correctness based on a successful build alone.

## Validation performed

Static checks and the public build pass. The page was checked in headless Chrome at 320, 375, 600, 768, 900, 1024, and 1440px, including mobile navigation, keyboard FAQ controls, deep links, and the no-JavaScript fallback. Desktop/mobile WCAG A/AA automated checks were run with every disclosure open. These are website checks; no paid Tex2Lean proof run was executed.
