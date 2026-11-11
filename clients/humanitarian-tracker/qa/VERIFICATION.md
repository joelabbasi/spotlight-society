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
