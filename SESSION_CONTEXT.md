# Session Context — Fantasy Autobattler Design Docs

This document captures the current state of the design documentation effort to enable continuity across sessions.

---

## Project Overview

Building a **fantasy autobattler** game where players:
1. Build armies using a point-buy system
2. Issue natural language orders to an LLM Commander
3. Submit for async battle resolution on the server
4. Watch deterministic replays of the outcome

**Key inspirations:** Dominions 6 (depth, factions, magic), Total War multiplayer (point-buy armies)

---

## Core Pillars (Decided)

1. **LLM Commander** — Server-side AI interprets player orders, generates unit scripts, adapts during battle. Optional (players can script manually). Game absorbs LLM cost.

2. **LLM Assistant** — Separate system. Client-side MCP server ships with game. Power users connect their own LLM agent (Claude Code, Codex) for army building assistance. Player provides own LLM.

3. **Async Multiplayer** — Build army → submit → server resolves when opponent submits → watch replay. No simultaneous play required.

4. **Scripting as Skill** — Order quality matters. Natural language prompts to Commander. Contradiction handling is Commander's job (incentivizes clear prompting).

5. **Distinct Factions** — Humans vs Orcs for v1. Unique rosters, items, point economies.

6. **Deterministic Replay** — Battles have randomness (RNG + LLM decisions). Replays are deterministic playback of the event log.

---

## V1 Scope (Decided)

**Included:**
- Core tick-based battle system (~1000 units per side)
- 2 factions (Humans, Orcs)
- Point-buy army builder
- Natural language orders + LLM Commander (optional)
- Server-side battle resolution
- Async multiplayer (challenge friend)
- Replay viewer (pause, rewind, speed controls)
- Single-player vs AI presets
- MCP server for LLM Assistant (power user feature)

**Deferred:**
- Ranked matchmaking / ELO
- Additional factions
- Strategy layer / campaign map
- Tournaments

**Tech stack:** TBD. Must support ~1000 units per side. Desktop client likely for v1 (easier MCP interfacing).

---

## Documents Completed

| # | Document | Location | Status |
|---|----------|----------|--------|
| 01 | Game Vision & Pillars | `01_game_vision_and_pillars.md` | Draft complete |
| 07 | LLM Commander | `07_llm_commander.md` | Draft complete |

---

## Documents Remaining

| # | Document | Purpose |
|---|----------|---------|
| 02 | Battle System | Tick-based resolution, terrain, victory conditions, determinism |
| 03 | Units & Abilities | Unit archetypes, stats, abilities, status effects |
| 04 | Factions | Faction design philosophy, Humans roster, Orcs roster |
| 05 | Army Building | Point-buy system, constraints, items, spells |
| 06 | Scripting & Orders | Priority system, what behaviors are expressible, script format |
| 08 | Multiplayer & Match Flow | Async model, submission, resolution, replay delivery |
| 09 | Replay System | Event log spec, replay controls, LLM decision visibility |
| 10 | AI Opponents | Preset armies, AI behaviors for single-player |
| 11 | User Interface | Army builder, order input, replay viewer screens |
| 12 | MCP Integration | Agent-assisted army building, exposed capabilities |
| 13 | Content Roadmap | Units, abilities, items, maps needed for v1 |

---

## Key Decisions Made

1. **Order syntax:** Natural language prompts (like prompting any LLM)
2. **Contradiction handling:** Commander decides — this is part of the skill (prompting)
3. **Prompt management:** Players can save/load prompts, optional prompt review before submission
4. **Commander opt-out:** Players can disable Commander and script directly
5. **Factions for v1:** Humans vs Orcs (enough to validate mechanics)
6. **AI opponents:** Presets + basic scripts (expandable later)
7. **Randomness model:** Battles are NOT deterministic (RNG + LLM). Replays ARE deterministic (event log playback).

---

## Open Questions (To Resolve)

### LLM Commander
- Intervention frequency (time-based, event-based, budget-based, hybrid?)
- Interpretation transparency level during prompt review
- Learning/feedback to help players write better orders
- LLM model selection (single model or player choice from list?)
- Fallback behavior if LLM call fails mid-battle
- Matchmaking between Commander users vs opt-outs

### General
- LLM selection during battle resolution (single server LLM or options?)

---

## Reference Material

The prototype design doc is in `reference/`:
- `reference/tick_battle_scale_prototype_base_requirements.md`

This prototype validated:
- Tick-based deterministic battle at ~2000 units
- Resolver/Replayer split architecture
- Event log for replay
- Basic unit types, terrain, projectiles
- Formation and squad movement

The prototype is throwaway code, but the design doc provides context for battle mechanics.

---

## Next Steps (Suggested)

1. Draft **Battle System** doc (foundation for everything else)
2. Draft **Scripting & Orders** doc (defines what Commander can express)
3. Draft **Army Building** doc (core player-facing feature)

Or tackle whichever doc feels most pressing.

---

## How to Resume

Point Claude to this file:
```
Read the SESSION_CONTEXT.md in the design-docs branch to understand where we left off. Then let's continue working on the requirements documents.
```
