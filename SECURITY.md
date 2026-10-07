# Security policy

## Supported versions

Only the latest release receives security fixes.

| Version | Supported |
| ------- | --------- |
| latest  | yes       |

## Reporting a vulnerability

Please do **not** open a public issue for security problems. Report them privately with [GitHub Security Advisories](https://github.com/jorgeadev/rust-next-template/security/advisories/new).

Include:

- what the issue is and where it lives (frontend, Rust core, CI, or configuration),
- steps or a proof of concept to reproduce it,
- the affected versions or commits.

You can expect an initial response within a few days. Confirmed issues will be fixed in a release and credited unless you prefer to stay anonymous.

## Hardening notes for shipped apps

This template is a starting point, not a hardened build:

- `app.security.csp` is `null` (disabled) so the starter page runs without extra configuration. Set a real CSP before distributing, and keep it as tight as your app allows. See [Tauri CSP](https://v2.tauri.app/security/csp/).
- Capabilities in `src-tauri/capabilities/` start at `core:default`. Add permissions per feature instead of all at once.
- Enable code signing and the updater before distributing to end users. See [Tauri distribution](https://v2.tauri.app/distribute/).
