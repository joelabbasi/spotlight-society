# Custom-domain HTTPS edge

This isolated Worker serves the existing public GitHub Pages frontend. The frontend source and hourly figure refresh remain in the parent client project. No visitor payment information is handled here.

The bound Sites project is declared in `.openai/hosting.json`. The edge and WWW certificate are active; WWW redirects to the secure main domain, which remains hosted on GitHub Pages. Do not deploy the parent static manifest over this Worker.

Run `npm test`, `npm run build`, and `npm run validate` here. Use the Sites source workflow to synchronize this Worker with its native source repository before saving and deploying a new version. The native source checkout is `ht-secure-hosting/.sites-checkout` in the Spotlight workspace.

Canonical behavior: HTTPS `www` redirects to `https://humanitariantracker.org`, preserving the path and query. GET and HEAD alone reach the public GitHub origin; cookies, authorization headers, and submitted bodies are not forwarded. Figure snapshots are served without browser caching.
