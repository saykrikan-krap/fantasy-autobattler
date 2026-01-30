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

2. **External Assistant** — Separate system. Game exposes interface for external systems (LLM agents, player scripts, future systems) to assist with army building. Player provides their own system. MCP server is one possible implementation.

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
- External Assistant interface for agent-assisted army building (power user feature)

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
| 03 | Units & Abilities | `03_units_and_abilities.md` | Draft complete |
| 05 | Army Building | `05_army_building.md` | Draft complete |
| 06 | Scripting & Orders | `06_scripting_and_orders.md` | Initial draft (outline + hero scripting brainstorm) |
| 08 | Multiplayer & Match Flow | `08_multiplayer_and_match_flow.md` | Draft complete |
| 09 | Replay System | `09_replay_system.md` | Draft complete |
| 07 | LLM Commander | `07_llm_commander.md` | Draft complete |
| 12 | External Assistant Integration | `12_external_assistant_integration.md` | Draft complete |

---

## Documents Remaining

| # | Document | Purpose |
|---|----------|---------|
| 04 | Factions | Faction design philosophy, Humans roster, Orcs roster |
| 10 | AI Opponents | Preset armies, AI behaviors for single-player |
| 13 | Content Roadmap | Units, abilities, items, maps needed for v1 |
| ?? | Magic System | May split out from 03 if scope warrants |

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

### Scripting & Orders (from 06 doc)
1. **Two layers of control:** Army-level orders (natural language → LLM Commander) and squad-level scripts (explicit config)
2. **Two types of AI:** Coded squad AI (deterministic, troop squads) and LLM Commander (adaptive, hero-focused)
3. **Troop squads:** Simple scripts—stance + target priority. Coded AI executes. Commander can modify config.
4. **Hero squads:** Complex scripts—opening actions with conditions, default behavior, fallbacks. Dominions-inspired but with conditions.
5. **Conditions:** Factorio train signal complexity. AND/OR supported. Can reference friendly units (known), not specific enemies (only types).
6. **Retinue:** No separate scripting—behavior determined by role/identity.

### Units & Abilities (from 03 doc)
1. **Chassis system:** Determines equipment slots (humanoid, dragon, hydra have different configs)
2. **Equipment rules:** Regular units = fixed, Heroes = customizable, Retinue = fixed
3. **Core stats:** HP, Stamina, Size, Movement Type, Attack, Defense, Protection, Precision, speeds, Encumbrance, XP
4. **Magic system:** 8 schools (4 elements + 4 sorceries), proficiency levels 1-10 soft cap, fatigue cost based on skill vs spell requirement in primary path
5. **Weapons:** Natural or equipped, some additive (dual wield), some mutually exclusive
6. **Protection:** Multiple sources (natural, armor, shield), shield bypass mechanic, stacking rules TBD
7. **Wounds:** Damage can cause wounds with penalties (lost eye, arm, head), multi-headed creatures can survive head loss
8. **Mounted units:** Composition of mount + rider, Size = mount's size, v1 treats as single unit
9. **Unit tags:** No rigid archetypes, tags help AI/scripting (infantry, caster, flying, etc.)

### Replay System (from 09 doc)
1. **Event log is authoritative:** Deterministic playback of recorded events. Replayer has no simulation logic.
2. **Playback controls:** Play, pause, speed levels, rewind, restart, event stepping
3. **Event stepping:** Advances to notable events (movement, attacks, spells, deaths, routing, Commander intervention)
4. **Event chains:** Causally-linked events display together (attack + resulting death). Structure TBD (chain ID vs nested vs hybrid).
5. **Visual spectacle:** Animations for combat, spells, abilities, projectiles. Event notation for significant actions.
6. **Camera:** Pan and zoom. No follow-unit camera.
7. **Unit inspection:** Click tile for stats, hero finder by name
8. **LLM Commander visibility:** Brief summary of intervention reasoning (not full CoT)
9. **Battle summary:** Survival report, kill counters per unit/squad, match result
10. **Sharing:** Through lobby/friends initially. Event-log based = resilient to game updates.

### Multiplayer & Match Flow (from 08 doc)
1. **Fully async:** No real-time play, multiple concurrent matches allowed
2. **Match creation:** Challenge friend, host game, random matchmaking. Ranked deferred for v1.
3. **One map type for v1:** Grasslands with random terrain variance (trees, water). Scenarios/map types deferred.
4. **Single submission phase:** Build, place, script, submit all at once. May split phases later.
5. **Match lobby:** Players can message each other, save progress while building
6. **Server-side resolution:** Battle runs when both submit, both notified
7. **Timeouts:** Configurable per match, forfeit if exceeded
8. **Army setup saves:** Save/load army configurations for reuse
9. **Spectating:** Watch friend games and replays, share replays
10. **Single-player modes:** Online (with Commander), offline (no LLM), same-player both sides (experimentation)

### Army Building (from 05 doc)
1. **Roster sources:** Core faction roster, mercenary roster (universal, higher cost), magic creatures (pre-summoned)
2. **Magic path affinity:** Factions have cost multipliers per school (abundant → none). Affects creatures, items, gems, empowerment.
3. **All mages are heroes:** Heroes may be casters or non-casters
4. **Items:** Have magic path requirements, cost modified by faction affinity
5. **Spells:** All unlocked, gated by mage capability. Powerful spells require gems.
6. **Gems:** Shared army resource, fixed base cost modified by affinity. Used for powerful spells or temporary empowerment.
7. **Empowerment:** Points can strengthen existing paths (scaling cost) or grant new paths (affinity-based cost). Some mages have personal discounts.
8. **Squad upgrades:** Defined per-squad (size, equipment, champion, training). Not all squads have all options.
9. **Unique units:** Good value for points; uniqueness is the constraint, not inflated pricing
10. **Composition rules:** Minimum one squad (can be solo hero). No same-faction mirror matches for v1.

### External Assistant Integration (from 12 doc)
1. **Full read access:** Anything the player can see, the External Assistant can read (rosters, stats, items, spells, replays)
2. **Full action access:** Anything the player can do during setup, the External Assistant can do (build, place, script)
3. **Batch operations allowed:** Efficiency convenience, not superpower (player could do same with more actions)
4. **No superpowers:** Cannot access opponent data, hidden data, active battles, or bypass validation
5. **Replay access:** Can read saved replays and currently-viewed replay for post-battle analysis
6. **No active battle access:** Battle-time AI is the Commander's domain
7. **Protocol agnostic:** MCP is one possible implementation; interface could take other forms

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

1. Draft **AI Opponents** doc (preset armies, behaviors for single-player)
2. Draft **Content Roadmap** doc (units, abilities, items, maps for v1)
3. Draft **Factions** doc (Humans and Orcs rosters, magic affinities for v1) — saved for near the end

UI design deferred to implementation phase after story scoping.

Or tackle whichever doc feels most pressing.

---

## How to Resume

Point Claude to this file:
```
Read the SESSION_CONTEXT.md in the design-docs branch to understand where we left off. Then let's continue working on the requirements documents.
```
