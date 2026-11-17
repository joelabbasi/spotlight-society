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

## Final description and Jeni bio

Applied Safa’s final About paragraph verbatim (lasting impact; connect with impact projects worldwide). Added Jeni’s supplied bio, M.A. credential, senior advisor role, and portrait embedded in Jeni Craswell Bio.docx. Increased the GAM logo from 420px to 600px on desktop, with larger responsive sizes. Removed the duplicate project attribution line below the logo at the user’s request.

The user subsequently requested “Technology. Crowdsourcing. AI for social good.” as the line beneath the larger GAM logo, replacing the former repeated project attribution.

## Hero layout refinement

Moved the social-good tagline beneath the Humanitarian Tracker header branding. Expanded GAM wordmark to the full hero content width (1250px maximum) and placed it above the headline, filling the open blue area. Responsive header and mobile logo sizes retained.

## Logo size and Safa portrait adjustment

Reduced GAM hero logo to 76% width, capped at 900px on desktop; retained full available width on mobile. Replaced Safa’s team portrait with supplied AldibSafa_Headshot.png, copied unchanged.

Adjusted Jeni’s portrait to retain the full original framing and natural aspect ratio, replacing the fixed-height crop that cut off the image.

## Gallery organization

Removed All events. Albums display only their own photos; ordered earliest to latest using supplied numbered source folders (CSW69, Climate Forum, UNOC, Damascus, UNGA80, WSS, GlobalWA). No exact dates invented for Climate Forum or November events. Damascus films are visible only in its selected category, before its photos. Album selections have shareable URL fragments.

Correction: restored All events as the default view at the user’s request. Chronological album ordering and Damascus-only films above photos retained.

## Simplified map and dashboard navigation

Kept only the two hero globe platform cards as selectors. They scroll to the embedded view and select map or dashboard in-place. Removed persistent platform dock, duplicate hero CTAs, lower platform switch/load buttons and placeholder copy. Map is embedded by default with lazy loading; direct external fallback remains. Moved motion pause control into footer. Both cards remain available on mobile. Browser-checked both iframe targets and mobile overflow; no JS errors.
