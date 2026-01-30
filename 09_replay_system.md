# Replay System

## Overview

The replay is the **payoff** of the game. After async army building and submission, players finally see what happened when their forces clashed. The replay must deliver both **spectacle** and **clarity**—exciting to watch, informative about what occurred.

Replays are **deterministic playback** of the battle's event log. The battle itself has randomness (RNG, LLM Commander decisions), but once resolved, the event log is the authoritative record. The replayer reads this log and renders what happened.

The replayer contains no simulation logic—only animation, effects, and UX. All game logic lives in the resolver.

---

## Event Log

The event log is the **authoritative record** of everything that happened in the battle.

### Event Types

The log contains events for all significant occurrences:

| Category | Examples |
|----------|----------|
| **Battle lifecycle** | Battle start, battle end, victory/defeat/draw |
| **Unit actions** | Movement, melee attack, ability use, spell cast |
| **Projectiles** | Fired, in-flight, impact |
| **Damage & death** | Damage dealt, unit killed, unit routed |
| **Status effects** | Buff applied, debuff applied, effect expired |
| **Morale** | Morale check, unit breaks, unit rallies |
| **LLM Commander** | Intervention occurred, decision made (with summary) |

Each event has:
- Tick number (when it occurred)
- Event type
- Relevant payload (units involved, location, outcome, etc.)

### Event Chains

Some events are **causally linked** and should be displayed together:

**Immediate chains** (same tick):
- Attack → Death (showing attack without the resulting death is confusing)
- Fireball Impact → Multiple Deaths (one moment, multiple casualties)

**Delayed chains** (across ticks):
- Spell Cast → Projectile Launched → *(N ticks later)* → Impact → Deaths

**Design options:**

| Approach | Description |
|----------|-------------|
| **Chain ID** | Independent events share a common identifier. Replayer groups related events for display. Works for both immediate and delayed chains. |
| **Nested payload** | Source event's payload contains immediate follow-on events. Simple for same-tick consequences, but awkward for delayed events or deep chains. |
| **Hybrid** | Immediate consequences nested in payload; delayed consequences linked via chain ID. |

The replayer uses chain information to present causally-related events together, regardless of underlying structure.

*(Final approach TBD)*

### Resilience

Because replays are event-log based, they should be **resilient to game updates** within reason. Minor balance changes or visual updates shouldn't break old replays.

---

## Playback Controls

Players control replay progression:

| Control | Function |
|---------|----------|
| **Play** | Advance through events at selected speed |
| **Pause** | Freeze playback |
| **Speed** | Multiple speed levels (slow, normal, fast, very fast) |
| **Rewind** | Go backward through the battle |
| **Restart** | Return to battle start |
| **Step** | Advance event-by-event for notable events |

### Event Stepping

When stepping manually, the replay advances to the next **notable event**:
- Movement
- Attacks (melee or ranged impact)
- Spell cast
- Ability used
- Unit killed
- Unit routed
- Commander intervention

**Grouping:** When stepping, causally-linked events display together (see Event Chains above). Stepping to an attack that kills a unit shows both the attack and the death as one step.

---

## Visual Presentation

The replay is a **spectacle**. Players should enjoy watching battles unfold.

### Combat Animations

- **Melee attacks**: Attack animations for engaged units
- **Spell casts**: Visual effects for spells, noted in UI
- **Abilities**: Visual effects and UI notation
- **Projectiles**: Visible in flight from origin to impact
- **Deaths**: Death animations, unit removal
- **Routing**: Fleeing animations for broken units

### Event Notation

When significant events occur, they should be **noted visually**:
- Spell name appears when cast
- Ability name appears when used
- Damage numbers (optional, may be configurable)
- Kill notifications for important units

The goal: a viewer can follow what's happening without needing to click on every unit.

---

## Camera

### Controls

- **Pan**: Move the view across the battlefield
- **Zoom**: Zoom in for detail, zoom out for overview

### Default View

Start with a battlefield overview showing both armies' deployment.

---

## Unit Inspection

Players can inspect any unit during replay:

### Tile Selection

Click on any tile to see:
- All units on that tile
- Current stats for each unit (HP, stamina, active effects)
- Status (alive, dead, routed)

### Hero Finder

Mechanism to quickly locate a specific hero:
- Search/select by name
- Camera jumps to their location
- Useful in large battles where heroes may be hard to spot

---

## LLM Commander Visibility

When the LLM Commander intervenes during battle, the replay shows:

### What's Displayed

- **That an intervention occurred** — Visual indicator
- **What was decided** — The action or modification made
- **Why** — A brief summary of the Commander's reasoning

### What's NOT Displayed

- Full chain-of-thought reasoning (too verbose, potentially confusing)
- Internal confidence scores or alternatives considered

The summary should be player-readable, e.g., "Commander switched target priority to mages—detected enemy caster cluster threatening flank."

Commander decision summaries are part of the intervention event payload in the log.

---

## Battle Summary

At the end of the replay, players see a **breakdown** of the battle:

### Survival Report

| Status | Information |
|--------|-------------|
| **Survived** | Units still alive and on the battlefield |
| **Routed** | Units that fled (broken morale) |
| **Killed** | Units that died |

Breakdown by squad and unit type.

### Kill Counters

**Critical feature**: Which units were most effective?

- Kills per unit (especially heroes)
- Kills per squad
- Damage dealt (if tracked)

This demonstrates unit effectiveness and informs future army building decisions. A hero with 50 kills earns their points; a squad that routed without killing anything may need different scripting.

### Match Result

- Winner (or draw)
- Final tick count
- Point value of surviving forces (optional)

---

## Sharing

Replays can be **shared** with other players:

### Initial Mechanism

Share through the match lobby / friends system (see `08_multiplayer_and_match_flow.md`):
- Friends can view your match history and replays
- Share replay links within the game

### Future Considerations

- Export replays for external sharing
- Embed replays (web viewer?)
- Community replay browsing

For v1, in-game sharing through existing social features is sufficient.

---

## Open Questions

1. **Damage numbers**: Show by default, optional, or never?
2. **Kill attribution**: How to handle assists, AoE kills, damage-over-time?
3. **Replay commentary**: Allow players to add notes/markers to replays for sharing?

---

## References

- `02_battle_system.md` — Combat mechanics being replayed
- `07_llm_commander.md` — Commander intervention behavior
- `08_multiplayer_and_match_flow.md` — Replay delivery and sharing context
