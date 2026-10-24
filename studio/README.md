# Spotlight Society redesign

Spotlight Society redesign source, matching the private preview. The existing site at the repository root is retained so its current Cloudflare Pages deployment can continue during migration.

- `/`: homepage, one-time spotlight entrance, selected photography, films, services, and contact.
- `/gallery`: a live, draggable media gallery sourced from the supplied public Google Drive folder, with grid mode and a media viewer.

The homepage source is `site/home.html`; the gallery source is `site/gallery.html`. Browser scripts, styles, and optimized assets are in `public/`. `app/` contains the HTTP routes. `lib/gallery-source.mjs` owns the public Drive listing and restricted image delivery.

Use the supplied Sites helpers for dependency installation, preview, build, source packaging, and private publication. `dist/` is generated and should not be edited. Keep the project identity in `.openai/hosting.json`.

Read `GALLERY.md` for synchronization behavior and limits, and `DOMAIN_FIX.md` for the diagnosed domain issue that remains pending account access.


## Local build

From this directory, use Node.js 22.13 or newer:

```sh
npm ci
npm run build
npm run start
```

The build outputs a Cloudflare Worker and static assets into `dist/server/` and `dist/client/`. The live Drive gallery and demo form require these server routes; publishing only the static files will not provide those features.

## Launch status

This branch does not change the existing root site's Cloudflare Pages deployment. Before switching production, configure hosting for the generated Worker, confirm the public domain and form origin, and verify gallery loading and a consented form submission on that domain. The form currently identifies the private preview URL to FormSubmit; review `lib/demo-request.mjs` during the production migration.

The Sites project identity and development helpers are retained for preview compatibility. No account credentials or local environment files are included.

## Remaining requested work

The gallery still includes both Jonah clips. Removing the longer duplicate, further gallery styling, and a weekly scheduled check have not been completed. The gallery currently refreshes from Drive every 60 seconds while visible; this is separate from a weekly scheduled check.

See `DEMO_FORM.md` for the activation and delivery-test status, and `DOMAIN_FIX.md` for the unresolved apex-domain setup.
