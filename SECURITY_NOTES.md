# Jobseuro Security Hardening Notes

## Implemented in this source package

- Added a correct `vercel.json` deployment configuration with security headers: Content-Security-Policy, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy, and X-Permitted-Cross-Domain-Policies.
- Added `/.well-known/security.txt` for vulnerability reporting.
- Enforced the application consent checkbox correctly; unchecked consent can no longer pass client-side validation.
- Limited CV uploads to PDF files and 5 MB before the browser encodes or submits them.
- Sanitized the submitted CV filename and added field length limits to reduce accidental oversized or malformed submissions.
- Added autocomplete metadata and disabled form autocomplete for the application form.
- Preserved textContent-based rendering in the support widget so user-entered questions are not inserted as HTML.

## Important deployment and backend actions

The site is static, but the application form sends personal data and CV content to a Google Apps Script endpoint. Client-side controls are not a substitute for server-side validation. The Apps Script backend should independently validate fields, reject unexpected properties, enforce file-size and MIME limits, restrict access to the intended spreadsheet/Drive destination, avoid logging sensitive data, and apply retention/deletion rules.

Deploy `vercel.json` at the project root if Vercel is used. If another host is used, configure equivalent response headers in that host’s dashboard or server configuration. Test the final live response headers with a security scanner after deployment.

## Operational recommendations

Use least-privilege access for the Google account and Apps Script project, rotate or replace the public submission endpoint if abuse is detected, monitor failed submissions and unusual volume, keep dependencies and third-party embeds minimal, and review the privacy policy so its retention and CV-handling statements match the actual backend behavior.
