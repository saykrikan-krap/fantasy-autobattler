# Coding Conventions & PR Rules

This document defines how we write, review, and ship code in this repo.

## Core Principles
- **Clarity first**: optimize for readability and maintainability.
- **Determinism by default**: simulation and log outputs must be reproducible.
- **Small, focused changes**: keep PRs scoped to one goal.
- **Document the why**: explain intent and tradeoffs where needed.

## Code Style (General)
- Follow the existing style in each area until a formatter/linter is introduced.
- Prefer explicit names over abbreviations.
- Avoid large files; split by responsibility when a module grows.
- Comments should explain *why* something exists, not restate the code.

## Language-Specific Expectations
These are defaults until tooling is added. If the repo adopts a formatter/linter, it is authoritative.

**Rust (core/server)**
- Use `rustfmt` and fix `clippy` warnings when available.
- Prefer `Result` error returns over panics in non-test code.
- Keep deterministic orderings explicit (e.g., stable sorts, fixed seeds).

**TypeScript (desktop/tools)**
- Prefer strict typing; avoid `any` unless unavoidable.
- Keep React components small and composable.
- Use `const` by default; avoid mutation unless necessary.

## Testing & Validation
- Add or update tests for behavior changes.
- Simulation changes should include deterministic test coverage or golden logs.
- If tests are not run, call out why in the PR.

## Documentation
- Update docs when behavior, formats, or workflows change.
- Link relevant docs in PR context when appropriate.

## PR Rules
- Use the PR template (`.github/pull_request_template.md`).
- Link the issue (e.g., `Closes #123`) and keep the PR scoped to that issue.
- Prefer small PRs; split large work into follow-up issues.
- Include a clear Summary, Context, and Testing notes.
- Avoid drive-by refactors unless they directly support the issue.

## Definition of Done
A change is done when:
- Acceptance criteria are met
- Tests updated/added where applicable
- Determinism preserved if touching sim/log
- Performance concerns noted (if relevant)
- PR linked and merged
- Docs updated if behavior or formats changed

## Issue Status
- Move items to `In progress` before starting work.
- Move to `In review` when the PR is ready.
- Move to `Done` **and close the issue** after merge and verification.
