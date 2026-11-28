# Humanitarian Tracker domain launch

Dedicated production repository: https://github.com/joelabbasi/humanitarian-tracker

Do not attach humanitariantracker.org to spotlight-society Pages: that repository hosts multiple client paths. Production content is served at the root of the dedicated repository. The existing Spotlight preview remains available.

DNS changes: replace the three Wix apex A records with GitHub Pages four A records (185.199.108.153 through 185.199.111.153); change www CNAME to joelabbasi.github.io. Preserve all other records, MX, SPF, DKIM, verification tokens, and Wix nameservers. Do not delete the Wix site or cancel hosting.

Before snapshot: domain-dns-before-2026-11-27.json. Wix UI full record snapshot saved locally at /tmp/ht-dns-before-nov27.txt.

Production includes 21 legacy URL redirects, a helpful 404, sitemap, robots.txt, and its own hourly aggregate statistics refresh workflow. Source remains maintained in this client directory; sync dist to production root while preserving CNAME, redirects, workflow, scripts, and launch metadata. Never overwrite a newer production stats.json with an older source snapshot.

Rollback: restore apex A 185.230.63.171, 185.230.63.186, 185.230.63.107 and www CNAME cdn3.wixdns.net. No email changes are needed.
