# Fantasy Autobattler (V1) — Roadmap (No Timelines)

**Document status:** Draft  
**Last updated:** 2026-02-02  
**Audience:** Project owner (human), multi-agent developers

This roadmap is organized by milestones and relative effort, not dates. Each milestone ends in a demoable artifact.

---

## 1. Project management approach (multi-agent)

### 1.1 Tracking system
Use **GitHub Issues + GitHub Projects** (single Project for V1).

- Parent issues represent **deliverables** (epics/specs)
- Sub-issues represent **implementation tasks** (parallelizable)
- Dependencies are modeled explicitly when sequencing matters

### 1.2 Issue state (“in development”)
Issues are open/closed, but the Project adds a **Status** field to represent states:

- Backlog
- Ready
- In Progress
- In Review
- Blocked
- Done

**Multi-agent rule:** Agents pull only from **Ready**, then assign themselves and move to **In Progress** immediately.

### 1.3 UX ticket pattern
Yes, treat UX work as real deliverables:

- Parent issue: UX spec/deliverable with acceptance criteria + artifact links
- Sub-issues: implementation steps, polish passes, usability fixes

### 1.4 Definition of Done (recommended)
An issue is “Done” when:
- Acceptance criteria met
- Tests updated/added (where applicable)
- Determinism preserved (if touching sim/log)
- Performance concerns noted (if relevant)
- PR linked and merged
- Documentation updated if it changes public behavior or formats

---

## 2. Milestones overview

Effort scale: **XS / S / M / L / XL**  
Each milestone lists: Outcome, Scope, Dependencies, Exit Criteria.

---

## M0 — Foundations and guardrails (S)

### Outcome
Agents can work safely with minimal coordination overhead.

### Scope
- Repo structure for desktop + core + server
- CI skeleton (lint/format/test)
- Basic “hello world” desktop app build
- Basic “hello world” battle_core CLI
- Issue templates + Project fields + labels
- Coding conventions and PR rules (small PRs, tests, linking)

### Exit criteria
- A PR can be opened and CI runs reliably
- Desktop app builds locally
- Core library builds + tests run

---

## M1 — Battle core MVP + deterministic event log (L)

### Outcome
A headless battle can run locally and produce an event log that can be decoded.

### Scope
- Minimal unit model:
  - positions, move, melee, ranged projectile, death
- Seeded RNG
- Event schema + encoder/decoder
- Determinism tests:
  - golden log hash for known scenario
- Performance harness:
  - 2000 units stress case
- Content stub:
  - placeholder unit definitions (data-driven skeleton)

### Dependencies
- M0

### Exit criteria
- `battle_core` runs a sample battle and outputs a replayable log
- Determinism test passes in CI

---

## M2 — Desktop Replay Viewer MVP (L)

### Outcome
The desktop app can load an event log and play it back smoothly.

### Scope
- Event log ingestion (local file)
- Playback controls:
  - play/pause, speed, seek, step
- WebGL renderer:
  - 2k units placeholder sprites
  - projectiles as sprites/particles
- Unit inspection:
  - click tile → list units
- Basic battle summary UI (placeholder stats)

### Dependencies
- M1

### Exit criteria
- Replay viewer plays the M1 golden log end-to-end at multiple speeds
- Stress replay with 2000 units stays responsive on target machines

---

## M3 — Offline “Playable Loop” (XL)

### Outcome
Users can build an army, run a local battle, and watch the replay — all inside the desktop app.

### Scope
- Army Builder MVP:
  - point budget
  - buy squads + upgrades (minimal)
  - placement in deployment zones
  - troop scripts: stance + target priority
- Local validation errors are actionable
- Run local resolver and immediately open replay viewer
- Save/load army configs (simple)

### Dependencies
- M1, M2

### Exit criteria
- A non-developer can do: build → run → replay → iterate
- This becomes the main development playtest loop

---

## M4 — Data-driven content slice: Humans vs Orcs (L–XL)

### Outcome
Two factions exist as real content (even if small).

### Scope
- Content format finalized (units/squads/items/spells minimal set)
- Data loaders integrated in both builder and resolver
- Minimal roster per faction:
  - infantry, archers, cavalry, one mage/hero
- Initial balance knobs:
  - point costs, basic stats

### Dependencies
- M3 (so content can be playtested immediately)

### Exit criteria
- Humans vs Orcs offline matches are playable and interesting
- Changes to content do not require code edits (mostly data-only)

---

## M5 — Online async multiplayer skeleton (XL)

### Outcome
End-to-end online match flow works:
create/join → submit → resolve → fetch replay.

### Scope
- Backend API:
  - match creation/join
  - submission
  - match list/history
  - replay access (download/stream)
- Worker:
  - run resolver server-side
  - store logs in object storage
- Minimal anti-footgun validation server-side (budget, placement bounds)
- Desktop:
  - basic online lobby + submit + results screen

### Dependencies
- M3, M4 (so you already have a fun offline experience)

### Exit criteria
- Two real machines can complete a match asynchronously
- Result is durable; replay can be watched later

---

## M6 — Auth + identity for alpha (M–L)

### Outcome
Online play has reliable identity and permissions.

### Scope
- Minimal auth method (recommended: email code/magic link)
- User profile basics
- Permission checks:
  - only match participants can submit/view private matches
- Rate limiting on auth endpoints
- Admin/dev override for internal testing (optional)

### Dependencies
- M5 (or can be built alongside M5 if you prefer)

### Exit criteria
- Alpha testers can log in and play without manual DB setup

---

## M7 — LLM Commander V1 (L–XL)

### Outcome
The differentiator exists: orders → scripts, bounded interventions, visible in replay.

### Scope
- Pre-battle interpretation:
  - orders → scripts + summary
  - log orders + interpretation
- Intervention system:
  - event triggers + strict budget
  - structured patch outputs only
  - log interventions with brief reasoning
- Replay UI:
  - timeline markers for interventions
  - viewer panel showing “what changed” (at least high level)

### Dependencies
- M3 (offline loop) and ideally M5/M6 (online makes it meaningful)

### Exit criteria
- Commander produces understandable behavior changes
- Interventions are visible and not spammy
- Failure mode is safe (no battle break)

---

## M8 — External Assistant (MCP) for dev + power users (M–L)

### Outcome
Agents (and optionally power users) can interact with the game via tool calls to build armies, run battles, and analyze replays.

### Scope
- MCP server/bridge in dev mode
- Tool surface for:
  - listing content
  - constructing armies
  - setting scripts
  - running local battles
  - exporting replay bundles and summary stats
- Gate in release builds:
  - hidden behind “Developer Mode”

### Dependencies
- M3 (needs the builder + local run loop)

### Exit criteria
- A dev agent can “playtest” end-to-end without UI clicks
- Automated playtest scripts can run nightly (optional)

---

## M9 — Alpha distribution + polish pack (XL)

### Outcome
You can hand builds to external testers on Windows/macOS/Linux with manageable friction.

### Scope
- Packaging:
  - Windows installer or portable zip
  - macOS dmg/app (sign/notarize as needed)
  - Linux AppImage
- Crash reporting + basic telemetry (optional but useful)
- Replay sharing basics (even if just “copy log”)
- UX polish:
  - reduce friction in builder and replay viewer
  - better error messages, empty states
- Observability:
  - server logs/metrics sufficient for debugging

### Dependencies
- M5/M6 (online alpha) or M3 (offline alpha)

### Exit criteria
- A tester can install/run with minimal coaching
- A bug report includes enough info to reproduce

---

## 3. Suggested sequencing (why this order)

The fastest path to a real game experience is:

1) Resolver + log (M1)  
2) Replay viewer (M2)  
3) Offline playable loop (M3)  
4) Content slice (M4)  
5) Online async (M5) + auth (M6)  
6) Commander (M7)  
7) Assistant (M8)  
8) Distribution polish (M9)

This ensures you are iterating on gameplay and UX early, not infrastructure.

---

## 4. Parallelization plan (agents)

After M0, you can run parallel tracks with minimal collision:

- Track A (Core): resolver + log schema + determinism tests
- Track B (Desktop): replay viewer rendering + playback controls
- Track C (Desktop): army builder UI + validation + placement
- Track D (Server): match flow + storage + worker integration
- Track E (LLM): commander summarizer + patch format + budgets
- Track F (Content): data definitions + initial factions + balance knobs

The key shared contracts to stabilize early:
- Event log schema
- Content data format
- Minimal API endpoints (once online starts)

---

## 5. CI/CD (practical, lightweight)

### 5.1 PR CI (every pull request)
- Rust:
  - fmt, clippy, tests
- TypeScript:
  - lint, typecheck, unit tests
- Determinism:
  - generate golden battle log and verify hash
- Optional smoke perf test (loose threshold)

### 5.2 Nightly builds (on main)
- Build desktop artifacts for Windows/macOS/Linux
- Attach to GitHub Release as “nightly”
- Include dev-mode assistant bridge (optional)

### 5.3 Tagged releases (alpha)
- Signed/notarized builds where feasible
- Release notes template includes:
  - known issues
  - replay compatibility notes (schema/content version)

### 5.4 Backend CD (simple)
- Build container images for API + Worker
- Deploy to a small environment
- Run migrations as part of deploy pipeline (guarded)

---

## 6. Checklist: what “V1 playable” means (definition)

V1 should minimally support:
- Build armies (two factions)
- Script squads/heroes (basic)
- Run online async match
- Watch replay with clarity
- Commander optional and visible (if included in V1 scope)
- Stable enough for repeated playtests and iteration

---

## Appendix: Example top-level epics (issue seeds)

- Epic: Battle Core MVP (M1)
- Epic: Event Log Schema + Codecs (M1)
- Epic: Replay Viewer MVP (M2)
- Epic: Army Builder MVP (M3)
- Epic: Content Data Model + Loaders (M4)
- Epic: Humans vs Orcs Content Slice (M4)
- Epic: Online Match Flow (M5)
- Epic: Auth (M6)
- Epic: LLM Commander V1 (M7)
- Epic: MCP Assistant Bridge (M8)
- Epic: Alpha Packaging + Distribution (M9)
