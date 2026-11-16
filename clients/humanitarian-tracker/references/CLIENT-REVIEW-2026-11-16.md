# Safaa review — November 16, 2026

- Supplied transparent GAM logo copied unchanged into assets/gam-logo.png.
- Tracks, 17 SDGs and other approved homepage sections retained.
- The client subsequently supplied facing-1-.jpg, facing-2-.jpg and facing-3-.jpg through three Drive links. These now replace the two homepage carousel images, in the supplied order. Source IDs retained in featured-media.json; display derivatives capped at 1920 pixels. Bios/profiles pending client delivery.
- Gallery contains all 156 images from the seven event folders in the supplied Drive gallery. Source IDs and original filenames retained in gallery-media.json. Two Damascus videos linked to original Drive files. Logos folder excluded from event photos.
- Dashboard public API: https://dashboard-endpoint.onrender.com/api/projects. Counts match dashboard MapView: projects keyed by postId; country names from locations, falling back to country fields in row; case-insensitive deduplication. Verified 346 projects, 79 countries on November 16. This supersedes the former fixed 369 project figure.
- API does not allow the hosted site's browser origin. An hourly GitHub Action on main writes aggregate-only stats.json to gh-pages; the homepage checks its same-origin snapshot on load, every 15 minutes and on return to the tab. GitHub schedules may be delayed. Snapshots older than 3 hours are labeled delayed. Failed refreshes preserve last good figures.
- Workflow is isolated to .github/workflows/refresh-gam-stats.yml and scripts/refresh_gam_stats.py on main; website implementation remains on the existing feature branch. No unrelated main source changed.

## Additional approved copy

Replaced homepage About description verbatim with Safa’s revised paragraph, including ECOSOC consultative status. Added EIN | 46-3356967 immediately beneath the HT footer branding on home, donation, archive and gallery pages. Updated archive/gallery generators to retain the EIN on rebuild.
