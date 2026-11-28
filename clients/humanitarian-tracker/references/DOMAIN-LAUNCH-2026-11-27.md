# Humanitarian Tracker domain launch

Dedicated production repository: https://github.com/joelabbasi/humanitarian-tracker

Do not attach humanitariantracker.org to spotlight-society Pages: that repository hosts multiple client paths. Production content is served at the root of the dedicated repository. The existing Spotlight preview remains available.

DNS changes: replace the three Wix apex A records with GitHub Pages four A records (185.199.108.153 through 185.199.111.153); change www CNAME to joelabbasi.github.io. Preserve all other records, MX, SPF, DKIM, verification tokens, and Wix nameservers. Do not delete the Wix site or cancel hosting.

Before snapshot: domain-dns-before-2026-11-27.json. Wix UI full record snapshot saved locally at /tmp/ht-dns-before-nov27.txt.

Production includes 21 legacy URL redirects, a helpful 404, sitemap, robots.txt, and its own hourly aggregate statistics refresh workflow. Source remains maintained in this client directory; sync dist to production root while preserving CNAME, redirects, workflow, scripts, and launch metadata. Never overwrite a newer production stats.json with an older source snapshot.

Rollback: restore apex A 185.230.63.171, 185.230.63.186, 185.230.63.107 and www CNAME cdn3.wixdns.net. No email changes are needed.

Primary address configured as https://humanitariantracker.org/; www is the alias. HTTPS enforcement enabled. Certificate for the apex approved; www certificate and resolver propagation verification remain in progress at this checkpoint. Production first hourly-statistics workflow completed successfully. Verified all 210 assets and the primary pages over HTTP, plus a certificate-validated HTTPS request directly to GitHub Pages for the apex.

Nine original project and analysis URLs now preserve the reviewed historical text and original references instead of redirecting back to the archive. Where the audited source preserved matching inline “here” anchors, those original hyperlinks are restored in order. All site checks pass; representative project layout visually verified.

Final checkpoint: main site verified in Chrome at https://humanitariantracker.org/ with valid HTTPS, and Map/Dashboard switching and the donation page checked. Both authoritative Wix name servers and public resolvers return the new DNS. Only the www certificate remains pending because GitHub diagnostics still sees the old cached Wix CNAME. Do not claim www verified until a normal certificate-validated HTTPS request succeeds and redirects to the apex. Main, original Wix site, and email configuration are preserved. Client update sent to Hend and Safaa in the existing website thread.

Twice-daily email monitoring is active at 09:00 and 17:00 America/Los_Angeles; it reports new relevant replies only.
