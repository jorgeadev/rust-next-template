# rust-next-template

A GitHub template for desktop apps: a **Rust core** (Tauri 2) behind a **Next.js 16** frontend, statically exported and rendered in the system webview.

[![CI](https://github.com/jorgeadev/rust-next-template/actions/workflows/ci.yml/badge.svg)](https://github.com/jorgeadev/rust-next-template/actions/workflows/ci.yml)
[![Release](https://github.com/jorgeadev/rust-next-template/actions/workflows/release.yml/badge.svg)](https://github.com/jorgeadev/rust-next-template/actions/workflows/release.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

```
                system webview                          rust process
┌─────────────────────────────────────┐   IPC   ┌──────────────────────────────┐
│  Next.js static export (`out/`)     │ ◀─────▶ │  Tauri core (`src-tauri/`)   │
│  React 19 · Tailwind CSS 4          │         │  #[tauri::command] fn greet  │
└─────────────────────────────────────┘         └──────────────────────────────┘
```

The frontend builds to plain HTML/CSS/JS with `output: "export"`, so there is no Node.js runtime in the shipped app. Rust owns the window and the system APIs; the UI reaches them with typed `invoke()` calls over [Tauri's IPC](https://v2.tauri.app/develop/calling-rust/).

## Requirements

- **Node.js** 20.9 or newer (24 recommended)
- **pnpm** 12 or newer (the version is pinned via `packageManager` in `package.json`)
- **Rust** stable with `rustfmt` and `clippy` (see `rust-toolchain.toml`)
- **Platform dependencies** for Tauri: [prerequisites guide](https://v2.tauri.app/start/prerequisites/)

## Quick start

```bash
pnpm install
pnpm tauri:dev
```

The first run compiles the Rust core, which takes a few minutes. Later runs are incremental.

## Scripts

| Command                 | What it does                                                                |
| ----------------------- | --------------------------------------------------------------------------- |
| `pnpm tauri:dev`        | Runs the desktop app with hot reload for both the UI and the Rust core.     |
| `pnpm tauri:build`      | Bundles an installer for the current OS into `src-tauri/target/release/bundle/`. |
| `pnpm dev`              | Browser preview of the UI at `localhost:3000` (no Rust bridge).             |
| `pnpm build`            | Static export of the frontend into `out/`.                                  |
| `pnpm lint`             | Checks formatting and lint rules with Biome.                                |
| `pnpm lint:fix`         | Applies Biome formatting and safe lint fixes.                               |
| `pnpm typecheck`        | Generates route types and runs TypeScript.                                  |
| `pnpm check`            | Biome plus TypeScript typechecking.                                         |
| `pnpm rust:test`        | Runs the Rust unit tests.                                                   |
| `pnpm rust:clippy`      | Runs Clippy with warnings denied.                                           |
| `pnpm rust:fmt`         | Formats the Rust code.                                                      |

## Project structure

```
├── src/                    # Next.js frontend
│   ├── app/                # App Router pages, layout, global styles
│   ├── components/         # React components (greet-demo.tsx is the IPC example)
│   └── lib/ipc.ts          # Typed wrappers around the Rust commands
├── src-tauri/              # Rust core
│   ├── src/lib.rs          # Commands + the Tauri builder
│   ├── src/main.rs         # Desktop entry point
│   ├── capabilities/       # Permissions granted to the webview
│   └── tauri.conf.json     # Window, bundle, and build configuration
├── .github/workflows/      # CI and cross-platform release pipelines
└── out/                    # Static export output (generated)
```

## Adding a Rust command

1. Write the command in `src-tauri/src/lib.rs` and register it:

   ```rust
   #[tauri::command]
   fn system_info() -> String {
       std::env::consts::OS.to_string()
   }

   // in run():
   .invoke_handler(tauri::generate_handler![greet, system_info])
   ```

2. Wrap it on the frontend in `src/lib/ipc.ts`:

   ```ts
   export function systemInfo() {
     return invoke<string>("system_info");
   }
   ```

3. Call it from a client component. `greet-demo.tsx` is a complete reference, including how to detect whether the Rust bridge is available with `isTauri()`.

Permissions for plugins and APIs live in `src-tauri/capabilities/default.json`. The default capability only grants `core:default`; add scoped permissions as you adopt plugins.

## Releases

The app version has a single source of truth: `package.json`. `tauri.conf.json` reads it via `"version": "../package.json"`.

```bash
pnpm version patch        # or minor / major
git push --follow-tags
```

Pushing a `v*` tag runs `.github/workflows/release.yml` and creates a **draft** GitHub release with installers for macOS (Apple Silicon and Intel), Linux, and Windows. Review the draft, then publish it. No signing secrets are required until you enable code signing or the updater; see the [Tauri distribution guides](https://v2.tauri.app/distribute/).

## Make it yours

- [ ] Click **Use this template** on GitHub (or push the files to a fresh repository), then enable it as a template in **Settings → General → Template repository**.
- [ ] Rename the app: `productName` and the unique `identifier` (reverse-DNS, e.g. `com.yourname.yourapp`) in `src-tauri/tauri.conf.json`.
- [ ] Replace the icons: `pnpm tauri icon path/to/icon.png`.
- [ ] Update name, description, and repository URLs in `package.json`, `src-tauri/Cargo.toml`, and this README.
- [ ] Update the copyright line in `LICENSE`.
- [ ] Set a Content Security Policy for `app.security.csp` in `src-tauri/tauri.conf.json` before shipping (see [Tauri security](https://v2.tauri.app/security/csp/)).
- [ ] Pick bundle targets and category in `src-tauri/tauri.conf.json` under `bundle`.

## License

[MIT](LICENSE)
