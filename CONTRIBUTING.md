# Contributing

Thanks for helping improve the template. This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).

## Setup

```bash
npm install
npm run tauri:dev
```

See the [Tauri prerequisites](https://v2.tauri.app/start/prerequisites/) for the platform packages the Rust core needs.

## Before opening a pull request

Run everything CI runs:

```bash
npm run check          # ESLint + TypeScript
npm run rust:fmt       # or `npm run rust:fmt` to apply formatting
npm run rust:clippy
npm run rust:test
npm run build          # verify the static export still works
```

Notes:

- Keep the frontend fully static. The app ships without a server, so do not introduce SSR-only APIs, route handlers with a runtime, or `next start` dependencies.
- New Rust commands need a typed wrapper in `src/lib/ipc.ts`, a registration in `tauri::generate_handler![]`, and a unit test where practical.
- Grant webview permissions in `src-tauri/capabilities/` only for what a feature actually needs.

## Commits and branches

- Use short, imperative commit subjects (`add window state plugin`, not `added...`).
- Keep pull requests focused; one change per PR is easiest to review.

## Pull requests

Fill in the PR template: what changed, how to test it, and a screenshot for UI changes. Maintainers may ask for changes before merging.
