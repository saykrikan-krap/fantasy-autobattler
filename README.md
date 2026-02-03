# Fantasy Autobattler

## Repo Structure
- `desktop/` Desktop app (Tauri v2 + React). Frontend entry in `desktop/src/main.tsx`, Tauri entry in `desktop/src-tauri/src/main.rs`, config in `desktop/src-tauri/tauri.conf.json`.
- `core/` Shared battle core library. Placeholder build/config in `core/BUILD.stub`, placeholder entry point in `core/ENTRYPOINT.stub`.
- `server/` Backend services. Placeholder build/config in `server/BUILD.stub`, placeholder entry point in `server/ENTRYPOINT.stub`.
- `docs/` Architecture, planning, and conventions (see `docs/architecture/v1_architecture.md`, `docs/planning/v1_roadmap.md`, `docs/project_conventions.md`, and `docs/coding_conventions.md`).
- `assets/` Art, audio, and other game assets (to be organized as they arrive).
- `tools/` Dev tooling, automation, and helper scripts.
- `infra/` Deployment and infrastructure configuration.

Core and server stubs remain until concrete stacks are chosen.
