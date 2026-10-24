# spotlightsociety.org: confirmed diagnosis and pending fix

Public DNS checked October 23, 2026 (Los Angeles).

- Authoritative nameservers: nsb1.squarespacedns.com through nsb4.squarespacedns.com.
- The apex `spotlightsociety.org` has neither an A nor an AAAA answer.
- `www.spotlightsociety.org` has a CNAME to `spotlight-society.pages.dev` and returns HTTP 200 over HTTPS.
- The private Sites preview is a separate deployment and has no custom domains attached.

## Smallest change to make both addresses work

In the Squarespace Domains account managing this domain, add a **root-domain forwarding rule** from `spotlightsociety.org` to `https://www.spotlightsociety.org`. Use a permanent (301), unmasked redirect, retain paths when offered, and turn forwarding over SSL on. Preserve the existing `www` CNAME and all email-related records. This makes typing the bare domain work immediately after DNS/SSL provisioning has completed.

Official instructions: https://support.squarespace.com/hc/en-us/articles/214767107-Forwarding-a-domain

## If Cloudflare is intended to manage DNS instead

First inspect the Cloudflare zone and the registrar together. The public delegation currently points to Squarespace, so editing an inactive Cloudflare zone alone will not change public resolution. Import and verify all existing records (especially MX, SPF, DKIM, and DMARC), confirm DNSSEC/delegation requirements, and only then change the registrar to the exact Cloudflare-assigned nameservers. Add the apex to the existing Pages project's custom domains, allow its DNS record and certificate to validate, and select one canonical hostname with an HTTPS redirect from the other.

Official instructions: https://developers.cloudflare.com/pages/configuration/custom-domains/

No DNS changes have been made. Account credentials were unavailable. Do not point the public domain at the private redesign without a separate launch decision.

## Verification after the account change

Check HTTP and HTTPS for both apex and `www`, including a deep URL, in a new browser session. Confirm a single redirect to the chosen HTTPS address, a valid certificate, and normal email delivery. Account changes and DNS propagation are not yet verified.
