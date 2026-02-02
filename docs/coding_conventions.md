# Coding Conventions & PR Rules

This document defines how we write, review, and ship code in this repo.

## Core Principles
- **Clarity first**: optimize for readability and maintainability.
- **Determinism by default**: simulation and log outputs must be reproducible.
- **Small, focused changes**: keep PRs scoped to one goal.
- **Document the why**: explain intent and tradeoffs where needed.

## Tooling & CI (Authoritative)
When available, these are required and CI-enforced:
- Rust: `cargo fmt`, `cargo clippy`, `cargo test`
- TypeScript: formatter + linter + typecheck (e.g., `prettier`, `eslint`, `tsc --noEmit`)

CI is the source of truth. Prefer fixing issues over debating style in review.

**Clippy policy**
- Deny-by-default lints cannot be ignored.
- Allow-by-default lints can be allowed only with a brief justification in code or the PR.
- If a lint is too noisy, propose a targeted lint policy change rather than suppressing broadly.

## Determinism Rules (Sim/Logs/Outputs)
- Do not rely on `HashMap`/`HashSet` iteration order for any user-visible output.
- Any ordering that affects output must be explicit (e.g., stable sorts, sorted keys, `BTreeMap`).
- Randomness must use explicit, logged seeds.
- Avoid wall-clock timestamps or thread IDs in deterministic logs; prefer sim time/tick counters.
- If concurrency is introduced, it must not change results or output ordering; add tests to enforce this.

## Code Style (General)
- Follow the existing style in each area until a formatter/linter is introduced.
- Prefer explicit names over abbreviations.
- Avoid large files; split by responsibility when a module grows.
- Comments should explain *why* something exists, not restate the code.

## Rust Conventions (core/server)
### Safety & Failure Modes
- Avoid `unwrap()`/`expect()`/`panic!()` in production code.
  - Allowed in tests/examples, or to assert a proven internal invariant with a clear message/comment.
- `unsafe` requires a `// SAFETY:` comment explaining the invariants and why they hold.
  - Include a focused test or reasoning that exercises those invariants.

### Error Handling
- Errors should carry context (what failed and why).
- Prefer typed errors at public boundaries; avoid erasing types too early.
- Use dynamic errors internally only when they reduce churn and do not obscure ownership of failures.

### Module/Layout Guidance
- Prefer small modules with clear boundaries (domain vs. IO, pure logic vs. side effects).
- Keep `types + impl + tests` together unless it harms readability.
- Avoid circular dependencies; consider a `core` module that is deterministic and pure.

## TypeScript Conventions (desktop/tools)
- Prefer strict typing; avoid `any` unless unavoidable.
- Keep React components small and composable.
- Use `const` by default; avoid mutation unless necessary.

## Testing & Validation
- Prefer unit tests for logic and integration tests for IO boundaries.
- Determinism-affecting code paths require explicit tests or golden logs.
- If golden outputs change, the PR must explain why and include a single command to regenerate them.
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
- Include reviewer-friendly impact notes:
  - Determinism impact: yes/no
  - Breaking change: yes/no
  - Performance impact: measured / not measured (why)
  - Security/safety impact: none / explain

## Definition of Done
A change is done when:
- Acceptance criteria are met
- Tests updated/added where applicable
- Determinism preserved if touching sim/log
- CI is green (or exemptions are documented)
- Formatting/lints pass when tooling exists
- Performance concerns noted (if relevant)
- PR linked and merged
- Docs updated if behavior or formats changed
- Benchmarks run when relevant and feasible

## Issue Status
- Move items to `In progress` before starting work.
- Move to `In review` when the PR is ready.
- Move to `Done` **and close the issue** after merge and verification.
