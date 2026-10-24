# Demo request form

The homepage's `#demo` section collects request details, email, and phone. All three are required. The same-origin `/api/demo` endpoint validates fields and forwards only those fields to the fixed recipient `joe@spotlightsociety.org` through FormSubmit. It does not accept recipient overrides. The visitor's email becomes Reply-To.

The form requests a conversation; it does not reserve a calendar appointment. It shows success only after a successful provider response without an activation warning. Invalid requests, oversized bodies, cross-origin submissions, and honeypot entries are rejected before any provider call. There is basic, per-server-instance abuse throttling. Submitted contact details are not logged or stored by the application. FormSubmit has its own processing and retention policies.

## Activation confirmed by user; delivery test accepted

The user confirmed clicking the activation link. They then explicitly approved a test via FormSubmit to `joe@spotlightsociety.org` containing only “Spotlight demo form delivery test — no customer inquiry,” with no phone or customer details.

FormSubmit returned `success: "true"` and “The form was submitted successfully.” This verifies provider acceptance after activation. Joe still needs to confirm inbox receipt; inbox delivery and a full customer-form submission have not been independently verified. The production domain may require its own activation after launch.

An earlier test containing contact details was rejected by automatic approval review and was not sent. Do not send further test emails without authorization.

Do not tell users that a demo is booked or an email has arrived based only on a successful HTTP response. Never send real customer data as part of a development test.

Provider documentation: https://formsubmit.co/documentation and https://formsubmit.co/ajax-documentation
