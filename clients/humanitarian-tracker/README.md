# Humanitarian Tracker — Global Action Mosaic 2.0

Spotlight client draft, isolated at `clients/humanitarian-tracker/`. Existing Spotlight marketing and studio files are unchanged. Buildless HTML/CSS/JavaScript is appropriate for this presentation site: no dependency install, backend, accounts or payment processing is needed.

## Run and verify

- `npm run dev` — serves `dist/` at http://127.0.0.1:4173
- `npm test` — JavaScript syntax checks and four Python standard-library checks for asset/navigation integrity, safe external links, placeholder links and the disabled payment boundary.
- Deploy `dist/` as a static site. Both `index.html` and `donate.html` are real pages and work under a subdirectory.

## Implemented

Responsive cinematic HT globe hero; three portfolio-backed GAM tracks and their supplied submission URLs; on-demand map/dashboard iframes with persistent direct links; all 17 interactive SDGs linked to the official UN goal pages; supplied-gallery photography and keyboard-dismissable lightbox; responsive Google Drive film embed; project/coverage archive; contact/project CTAs; four recognition milestones linking to original sources; donation frequency, presets, custom amount and validation.

Donation settings are temporary browser state only. There is no Stripe code, payment form, request, payment data collection, persistence, checkout endpoint or success state. Checkout is disabled. Any actual submission on the external GAM platform is a separate service.

## Before client launch

1. Confirm video publication rights, captions and Google Drive sharing permissions for the supplied film.
2. Confirm captions, final photo selection, publication consent and image credits for the supplied gallery.
3. Have HT approve current mission copy, contact, donation allocations, giving terms and relevant privacy/accessibility information.
4. Confirm map/dashboard availability and iframe permissions on the final domain. Cross-origin content cannot reliably be inspected for rendering success; direct links remain visible regardless.
5. Review any Replit-only content when that attempt is available again. It returned a Replit unavailable page during this build.
6. Later, connect the authorized payment account using a separate implementation with server-side checkout, verified webhooks, receipts and recurring-giving cancellation. No payment integration is included here.

See `references/SOURCES.md` for provenance and `qa/VERIFICATION.md` for checks and limitations. Screenshots are in `qa/`.

## Complete archive update

`archive.html` is a dedicated searchable library with all nine original projects, five independently sourced milestone entries plus the separately attributed 2017 HT announcement, 62 news entries, 69 publication listings, six talks/panels and two analysis clips. Sources includes the full page/link/image reference collection and downloadable metadata indexes. `about.html` adds mission, methods, ethics context, team-source references and involvement routes. Homepage Archive navigation now opens the dedicated page.

Regenerate archive markup and indexes with `python3 scripts/build_archive.py`. Inputs are retained in `references/archive-input/` as metadata, without long copied article excerpts. `dist/archive.js` provides category/search filters, progressive expansion and click-to-load videos. Static entries remain readable with JavaScript disabled.
