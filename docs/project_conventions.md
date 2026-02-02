# Project Conventions

This document standardizes how we create issues and use the project board so work stays consistent and traceable.

## Where Work Is Tracked
- GitHub Issues are the source of truth for tasks and deliverables.
- The project board is **Fantasy Autobattler — Battles Only** and is used for iteration planning and status.

## Issue Creation
Use the issue templates (Feature/Task, Bug, Spike). A ticket is considered **Ready** when it has:
- A clear goal and scope
- Acceptance criteria that are testable
- Any dependencies called out or resolved

## Project Fields (How to Use Them)
**Status**
- `Backlog`: not ready or not prioritized yet
- `Ready`: fully scoped, unblocked, and can be picked up
- `In progress`: actively being worked on (move here before starting)
- `In review`: PR opened and ready for review
- `Done`: merged and verified, and the issue is closed

**Priority**
- `P0`: blocks work or major milestone
- `P1`: important for current milestone/iteration
- `P2`: useful but not critical
- `P3`: nice-to-have or deferred

**Size**
- `XS`: < 2 hours
- `S`: up to 1 day
- `M`: 2–3 days
- `L`: 1 week
- `XL`: multi-week (should be split)

**Type**
- `Feature`, `Bug`, `Chore`, `Spike`, `Tech-debt`

**Target**
- `v1`, `v1.1`, `Later`

**Area**
- `App`, `Sim`, `Server`, `Tools/Infra`, `Content`

**Subsystem**
- `Setup`, `Scripting`, `Replay Viewer`, `Results/Report`, `Core UI`, `Input/Controls`, `Assets`, `Networking/Sync`

**Iteration**
- Assign when the issue is scheduled for the current iteration.

## Labels
- `bug`, `enhancement`, `spike` align with issue templates.
- `blocked` indicates a dependency that prevents progress.
- `v1` indicates current release scope.
- `good-first-task` marks small, well-scoped tasks suitable for quick pickup.
- `documentation` for doc-only updates.

## Branching & Status Flow
- Create branches as `issue-<number>-<short-slug>`.
- Move the issue to `In progress` before starting work.
- When a PR is ready, move to `In review`.
- After merge and verification, set to `Done` and close the issue.

## Definition of Done
- Acceptance criteria met
- Tests updated/added where applicable
- Determinism preserved if touching sim/log
- Performance concerns noted (if relevant)
- PR linked and merged
- Docs updated if behavior or formats changed

## Session Docs
- Session docs live in `sessions/` and store agent context for cross-machine work.
- Prefix the filename with `codex` for Codex agents or `claude` for Claude agents.
