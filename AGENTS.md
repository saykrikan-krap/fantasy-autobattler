# AGENTS

## Project
Fantasy Autobattler is a fantasy-themed autobattle project. The goal is a shared deterministic battle core, a desktop replay viewer, and supporting tooling that leads into online async matches.

## Docs
- `README.md` for the current repo overview and structure.
- `docs/` for design notes and longer-form plans.
- GitHub Project `Fantasy Autobattler — Battles Only` for milestones, iteration planning, and task status.

## Repo Structure
- `desktop/`, `core/`, `server/` are the primary product components.
- `docs/` holds architecture and planning docs.
- `assets/` stores art/audio and other game assets.
- `tools/` holds developer tooling and automation.
- `infra/` holds deployment and infrastructure configuration.

## Session Docs
- Use session docs to store agent context when working across machines.
- Prefix the filename with `codex` for Codex agents, or `claude` for Claude agents.

## Ticket Workflow
1. List `Ready` items in the current iteration (GitHub UI or `gh project item-list 1 --owner saykrikan-krap`).
2. Pick a `Ready` item and move it to `In progress` before starting work to prevent duplicate pickup.
3. Create a branch from `master` in your active worktree (example: `issue-<number>-<short-slug>`).
4. Implement the work and open a PR.
5. When the PR is ready for review, set the status to `In review`.
6. After merge and verification, set the status to `Done`.
