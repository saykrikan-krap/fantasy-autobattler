# Session Context — Fantasy Autobattler Design Docs

This document captures the current state of the design documentation effort to enable continuity across sessions.

---

## Project Overview

Building a **fantasy autobattler** game where players:
1. Build armies using a point-buy system
2. Issue natural language orders to an LLM Commander
3. Submit for async battle resolution on the server (or local for single-player)
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
- Server-side battle resolution (multiplayer) / local resolution (single-player)
- Async multiplayer (challenge friend)
- Replay viewer (pause, rewind, speed controls)
- Single-player vs AI presets
- MCP server for LLM Assistant (power user feature)

**Deferred:**
- Ranked matchmaking / ELO
- Additional factions
- Strategy layer / campaign map
- Tournaments
- Fog of war / hidden information

**Tech stack:** TBD. Must support ~1000 units per side. Desktop client likely for v1 (easier MCP interfacing).

---

## Documents Completed

| # | Document | Location | Status |
|---|----------|----------|--------|
| 01 | Game Vision & Pillars | `01_game_vision_and_pillars.md` | Draft complete |
| 02 | Battle System | `02_battle_system.md` | Draft complete |
| 07 | LLM Commander | `07_llm_commander.md` | Draft complete |

---

## Documents Remaining

| # | Document | Purpose |
|---|----------|---------|
| 03 | Units & Abilities | Unit archetypes, stats, abilities, status effects, wounds |
| 04 | Factions | Faction design philosophy, Humans roster, Orcs roster |
| 05 | Army Building | Point-buy system, squad purchasing, upgrades, items, spells |
| 06 | Scripting & Orders | Priority system, what behaviors are expressible, script format, fallback heuristics |
| 08 | Multiplayer & Match Flow | Async model, submission, resolution, replay delivery |
| 09 | Replay System | Event log spec, replay controls, LLM decision visibility |
| 10 | AI Opponents | Preset armies, AI behaviors for single-player |
| 11 | User Interface | Army builder, order input, replay viewer screens |
| 12 | MCP Integration | Agent-assisted army building, exposed capabilities |
| 13 | Content Roadmap | Units, abilities, items, maps needed for v1 |

---

## Key Decisions Made

### General
1. **Order syntax:** Natural language prompts (like prompting any LLM)
2. **Contradiction handling:** Commander decides — this is part of the skill (prompting)
3. **Prompt management:** Players can save/load prompts, optional prompt review before submission
4. **Commander opt-out:** Players can disable Commander and script directly
5. **Factions for v1:** Humans vs Orcs (enough to validate mechanics)
6. **AI opponents:** Presets + basic scripts (expandable later)
7. **Randomness model:** Battles are NOT deterministic (RNG + LLM). Replays ARE deterministic (event log playback).
8. **No fog of war:** Battlefield is fully visible. Invisible units may come later.

### Battle System (from 02 doc)
1. **Resolver deployment:** Server-side for multiplayer, local for single-player
2. **Damage model:** HP + wounds system (prototype one-hit removal was placeholder only)
3. **Stamina/Fatigue:** Replaces mana for magic. Combat and spells drain stamina. Depletion is debilitating.
4. **Diagonal movement:** Supported at 1.5× cost
5. **Diagonal distance:** Counts as 1.5 tiles for ranged
6. **Terrain/movement:** Cost matrix approach — each movement type (Foot, Mounted, Flying, Amphibious) has different costs per terrain
7. **Projectile precision:** Ranged attacks have precision stat; lower precision = more deviation from target
8. **Units never deleted:** Dead units remain tracked for resurrection/undead mechanics
9. **Victory condition:** 0 units "on battlefield" — routed units count as gone
10. **Time limit resolution:** All units idle, all effects/projectiles resolve, both survivors = draw
11. **Morale and routing:** Yes, will be in the game
12. **Squad types:** Standard squads (primary units + upgrades) and Hero squads (powerful individual + retinue)
13. **Squad purchasing:** Players buy squads, not individual units
14. **Failed action fallbacks:** Context-aware heuristics, not just wait (blocked by enemy → attack, etc.)

### Terminology
- **Thug:** Single powerful unit for tactical goals. Cost-effective "special forces."
- **Super Combatant (SC):** One-person army. Examples: titans, ancient dragons, demon lords. Viable strategy: single buffed SC.

---

## Open Questions (To Resolve)

### LLM Commander
- Intervention frequency (time-based, event-based, budget-based, hybrid?)
- Interpretation transparency level during prompt review
- Learning/feedback to help players write better orders
- LLM model selection (single model or player choice from list?)
- Fallback behavior if LLM call fails mid-battle
- Matchmaking between Commander users vs opt-outs
- **Offline single-player:** How does Commander work without internet? (Local model? Scripted-only? Require connection?)

### Battle System
- Wounds system details: Which wounds exist? Thresholds? Recovery?
- Stamina tuning: Depletion rates, recovery, effect severity?
- Trampling mechanics: Size thresholds, push rules, damage?
- Precision system: How does precision scale with range? Environmental factors?
- Morale thresholds: What triggers morale checks? Break points?
- Rally mechanics: Radius, cooldown, requirements?
- Large unit melee range: How does size map to reach?
- Squad upgrade limits: How many upgrades per squad? Point costs?

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

1. Draft **Units & Abilities** doc (defines stats, wounds, stamina, abilities that Battle System references)
2. Draft **Scripting & Orders** doc (defines what Commander/scripts can express)
3. Draft **Factions** doc (Humans and Orcs rosters for v1)

Or tackle whichever doc feels most pressing.

---

## How to Resume

Point Claude to this file:
```
Read the SESSION_CONTEXT.md in the design-docs branch to understand where we left off. Then let's continue working on the requirements documents.
```
