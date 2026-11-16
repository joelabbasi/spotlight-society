# Verification

- `npm test`: PASS — two JavaScript syntax checks and four content/payment-boundary tests.
- Local HTTP: homepage returns 200.
- Desktop browser: 1710px viewport, no horizontal overflow; hero, donation and gallery visually inspected. All three gallery images loaded from local files.
- Mobile browser: 390 × 844, homepage and donation page have no horizontal overflow. Menu opens, closes after section selection. Desktop viewport restored after mobile checks.
- SDG selector: Goal 17 changes detail and UN link to `/goals/goal17`.
- Gallery: clicking opens image dialog; close returns to page. Escape behavior uses native dialog.
- Donation: monthly $100 displayed correctly; custom $72.25 displays per month; negative amount produces validation error; checkout remains disabled. No payment or donor-detail fields exist.
- Platforms: both switches update direct links correctly; loading creates the expected titled iframe; direct links remain visible. Provider availability, framing restrictions and live data are not guaranteed by this draft. No live project counts are invented.
- Screenshots: desktop-home.jpg, mobile-home.jpg, donation-preview.jpg.

Automated checks intentionally do not make any donation, submit any project, or assert third-party availability. A full assistive-technology audit and broad device/browser matrix remain pre-launch work.

## Motion pass

Added layered globe parallax, floating platform cards, CSS perspective on track cards, staggered reveal transitions, persistent platform shortcuts, scroll progress and native horizontal gallery snapping. Motion pause toggle changes state correctly. Gallery next control advances scroll position. Browser checks at 1710px and 390px show no page-level horizontal overflow. Gallery supports native touch scrolling, arrow controls and keyboard arrows. Reduced-motion preferences disable decorative animations and reveal hiding. Screenshot: motion-home.jpg. No new animation library or WebGL dependency.

## Complete archive update

Six automated checks pass, including exact archive content counts and exclusion of long copied excerpts from public indexes. Browser: category filtering works; Show all exposes all 62 news records; impossible search shows empty state; publication search for “polio” finds two records; source search finds matching references; archived video click creates the correct titled iframe. At 390px, archive and approach pages have no horizontal overflow. Homepage Archive link resolves to `archive.html`; five independently sourced homepage timeline entries remain linked. Third-party article/link availability and playback of every historical video are not guaranteed. Screenshot: archive-desktop.jpg.

## November 14 client review, applied November 15

Nine automated checks pass. Added checks for exact current figures, the single homepage About paragraph, five requested team names, removed former team members/sections, simplified archive hero, and 50 local gallery photo links. JavaScript syntax checked for homepage, donation, archive and gallery scripts. Browser checks: official GAM logo and portraits load; desktop and 390px mobile pages have no horizontal overflow; gallery expands from 12 to 24 images, opens local files, advances photos and closes; impact reads 369 / 79 / One / infinity; archive totals are removed. Desktop screenshots: client-review-home.jpg and client-review-team.jpg. Jeni's bio and final photo approval remain client dependencies.
