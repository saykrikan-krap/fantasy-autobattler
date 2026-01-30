# Game Vision & Design Pillars

## Overview

A fantasy autobattler where players compete by crafting armies and issuing strategic orders to an LLM-powered commander. Battles resolve asynchronously on the server, and players watch deterministic replays to analyze outcomes and refine their strategies.

**Inspirations:** Dominions 6 (depth, factions, magic systems), Total War multiplayer (point-buy army building)

---

## Core Fantasy

You are a general. You don't control individual soldiers—you build your army, equip your forces, and issue orders to your commanders. Then you watch the battle unfold and learn from the results.

The skill is in preparation: army composition, equipment choices, and the orders you give. Once battle begins, your soldiers and commanders execute based on what you've prepared.

---

## Design Pillars

### 1. LLM Commander (V1 Differentiator, Experimental)

Players don't write detailed scripts—they issue natural language orders to an AI commander who interprets intent and directs units.

**Pre-battle:** The LLM Commander translates player orders into unit behaviors.
- "Protect the archers"
- "Mages focus on enemy cavalry"
- "Infantry hold until they close to melee range"

**During battle:** The LLM Commander adapts to battlefield conditions.
- Enemy casts fire immunity → Commander switches mages to different spells
- Flank exposed → Commander redirects reserves

**Why this matters:**
- Lowers barrier to entry (no programming required)
- Preserves depth (order quality matters—prompting is a skill)
- Creates emergent gameplay (LLM interpretation adds variance)
- Benchmark potential (compare LLM performance)

**Status (v1):** Highly experimental and included in v1. See `06_llm_commander.md` for opt-out and balance policy.

**Note:** The Commander (server-side, game-managed) is distinct from the LLM Assistant (client-side MCP integration for power users). See LLM Commander doc for details.

### 2. Async Multiplayer

Battles don't require both players online simultaneously.

**Flow:**
1. Build army using point-buy system
2. Issue orders to your LLM Commander
3. Submit
4. Server resolves battle when opponent also submits
5. Both players notified, watch replay

**Why this matters:**
- Respects player time
- Enables thoughtful army building (no time pressure)
- Scales globally (no latency concerns)
- Natural fit for mobile play sessions

### 3. Scripting as Skill Expression

Beyond army composition, players differentiate through the quality of their orders.

**Layers of skill:**
1. **Army composition** - Unit selection, point allocation, synergies
2. **Equipment & spells** - Item choices for heroes, spell loadouts for mages
3. **Order quality** - Clear intent, contingency thinking, understanding unit capabilities

**Priority-based system (Dominions-inspired):**
- Script specific actions for opening turns
- Set default behaviors for remainder of battle
- LLM Commander interprets and adapts within these constraints

### 4. Distinct Factions

Each faction has unique identity, roster, items, and point economy.

**V1 Factions:** Humans, Orcs (sufficient to validate mechanics)

**Faction differentiation:**
- Different unit rosters and stat profiles
- Faction-specific items and spells
- Different point costs reflecting faction strengths
- Distinct playstyles and army archetypes

### 5. Deterministic Replay

Every battle produces a complete event log. Replays are authoritative playback of what happened.

**Replay features:**
- Play, pause, rewind
- Speed controls
- LLM Commander decision visibility (understand why units changed behavior)
- Full battle analysis

**Why this matters:**
- Learn from losses
- Share interesting battles
- Spectator/content creation potential

**Note on randomness:** Battles are NOT deterministic. The same armies with the same orders will produce different outcomes due to RNG and LLM decisions. The *replay* is deterministic—it's authoritative playback of what happened in that specific battle. For testing core mechanics, a seeded mode without LLM intervention can ensure reproducibility.

---

## What This Game Is NOT

- **Not real-time** - No APM, no micro, no twitch skills
- **Not a deckbuilder** - Army composition, not card draws
- **Not pay-to-win** - Point-buy equalizes armies; skill is in composition and orders. Content packs may unlock additional unit options within a faction, but these expand choices rather than provide unfair advantages.
- **Not requiring programming** - LLM Commander abstracts scripting complexity
- **Not a strategy layer game (v1)** - No campaign map, territory control, or persistence between battles

---

## Target Experience

**Session flow:**
1. Open game, check for completed battles (watch replays)
2. Queue new match or challenge friend
3. Spend time crafting army and orders (the "puzzle")
4. Submit and go about your day
5. Get notified when battle resolves
6. Watch replay, analyze, iterate

**Emotional beats:**
- Satisfaction from a well-crafted army performing as intended
- "Aha" moments when LLM Commander makes smart adaptations
- Learning from losses by watching what went wrong
- Theory-crafting and experimentation between matches

---

## V1 Scope Summary

**Included:**
- Core battle system (tick-based, deterministic resolution)
- 2 factions (Humans, Orcs) with distinct rosters
- Point-buy army builder
- Natural language order system with LLM Commander interpretation (see `06_llm_commander.md` for opt-out policy)
- Server-side battle resolution with LLM adaptation
- Async multiplayer (challenge friend)
- Replay viewer with full playback controls
- Single-player vs AI presets
- MCP server for agent-assisted army building (LLM Assistant—power user feature, player provides own LLM)

**Deferred:**
- Ranked matchmaking / ELO
- Additional factions (3+)
- Strategy layer / campaign map
- Tournaments

**Tech stack note:** Client platform TBD. Must support ~1000 units per side. Desktop client likely for v1 due to easier MCP interfacing (players connecting CLI agent harnesses as assistants). Web and mobile clients may follow.

---

## Success Metrics (V1)

- Players can complete full match flow (build → submit → replay)
- LLM Commander demonstrably adapts to battlefield conditions
- Two factions feel meaningfully different
- Replays are watchable and informative
- Agent-assisted army building works via MCP

---

## Open Questions

1. **LLM decision visibility** - How verbose should commander reasoning be in replays?
2. **LLM intervention frequency** - How often can the LLM Commander intervene during battle? Cost considerations make per-tick intervention impractical. What triggers intervention (time-based cadence, significant events, threshold conditions)?
