# Desktop App

This is the Tauri v2 + React desktop scaffold for Fantasy Autobattler.

## Prerequisites
- Node.js 18+
- Rust toolchain (via rustup)
- Linux system deps (Ubuntu/Debian):
  - `libwebkit2gtk-4.1-dev`
  - `libgtk-3-dev`
  - `libayatana-appindicator3-dev`
  - `librsvg2-dev`
  - `libssl-dev`
  - `pkg-config`

## Commands
```bash
npm install
npm run tauri:dev
```

Build a release binary:
```bash
npm run tauri:build
```

If you are on WSL with the repo under `/mnt`, `tauri build` can fail when cleaning temp archives. Use a Linux-path target directory instead:
```bash
CARGO_TARGET_DIR=/tmp/fantasy-autobattler-tauri-target npm run tauri:build
```

## Notes
- Frontend entry point: `src/main.tsx`
- Tauri config: `src-tauri/tauri.conf.json`
