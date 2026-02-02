# Fantasy Autobattler

## Repo Structure
- `desktop/` Desktop app (Tauri + React). Entry point: `desktop/src/main.tsx`, Tauri shell in `desktop/src-tauri/`.
- `core/` Shared battle core library. Placeholder build/config in `core/BUILD.stub`, placeholder entry point in `core/ENTRYPOINT.stub`.
- `server/` Backend services. Placeholder build/config in `server/BUILD.stub`, placeholder entry point in `server/ENTRYPOINT.stub`.
- `docs/` Architecture, planning, and conventions (see `docs/architecture/v1_architecture.md`, `docs/planning/v1_roadmap.md`, `docs/project_conventions.md`, and `docs/coding_conventions.md`).
- `assets/` Art, audio, and other game assets (to be organized as they arrive).
- `tools/` Dev tooling, automation, and helper scripts.
- `infra/` Deployment and infrastructure configuration.

Core and server are still stubbed to make the layout discoverable until concrete stacks are chosen.
