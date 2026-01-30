# External Assistant Integration

## Overview

The game provides an **interface for External Assistants** — any external system (LLM-powered agents, player scripts, or future systems) that helps players with army building and other setup tasks.

This is distinct from the LLM Commander:

| System | Purpose | When | Provided by |
|--------|---------|------|-------------|
| **LLM Commander** | Battle decisions | During battle | Game (server-side) |
| **External Assistant** | Setup help | During setup | Player's own system |

The game exposes an interface that External Assistants can connect to. The interface provides read access to game data and the ability to perform player actions. What systems players use — and how they work internally — is outside the game's scope.

**Example implementation:** An MCP server. But the interface could take other forms as tooling evolves.

---

## Use Cases

External Assistants help players with setup tasks:

- **Hero selection**: "Find me heroes that can cast Water 3 spells"
- **Composition advice**: "What's a good counter to heavy cavalry?"
- **Spell planning**: "Which mages can cast Fireball? What about after empowerment?"
- **Gem recommendations**: "How many Fire gems do I need for this strategy?"
- **Point optimization**: "I have 50 points left, what should I spend them on?"
- **Hypothetical validation**: "Would this army be legal if I added two more cavalry?"
- **Strategy discussion**: "How should I script this SC for self-buffing?"
- **Post-battle analysis**: "What went wrong with my cavalry charge?" (reviewing replays)

---

## Design Principles

### Full Read Access

**Anything the player can see, the External Assistant can read.**

This includes:
- Faction rosters, unit stats, abilities
- Item and spell catalogs
- Magic path affinities
- Current army state and saved configurations
- Replays (saved or currently being viewed)

### Full Action Access

**Anything the player can do during setup, the External Assistant can do.**

This includes:
- Army building (squads, heroes, upgrades, items, gems)
- Placement (positioning units in deployment zone)
- Scripting (squad scripts, hero scripts, army-level orders)
- Saving and loading configurations

### Batch Operations

**External Assistants may perform actions more efficiently than the UI allows.**

For example, an External Assistant might add multiple squads in one operation, or equip items across all matching heroes at once.

This is a convenience — the player could accomplish the same through repeated individual actions.

### No Superpowers

**External Assistants cannot do anything the player couldn't do, given time.**

Restrictions:
- Cannot access opponent's army or strategy
- Cannot access hidden game data
- Cannot interact with active battles (that's the Commander's domain)
- Cannot bypass validation rules

The External Assistant is a helper, not a cheat.

---

## Readable Data

Examples of what should be readable through the interface:

**Game Data**
- Faction rosters (squads, heroes available)
- Magic path affinities and cost multipliers
- Unit stats, abilities, chassis, equipment slots
- Available upgrades per squad
- Hero details including retinue options
- Spell list with path requirements
- Item catalog with path requirements
- Magic creatures available

**Player State**
- Current army composition
- Point budget and remaining points
- Saved army configurations
- Current match configuration

**Replays**
- Saved replays
- Currently-viewed replay data

---

## Available Actions

Examples of what should be actionable through the interface:

**Army Building**
- Add/remove squads and heroes
- Apply/remove upgrades
- Equip/unequip items on heroes
- Add/remove retinue
- Empower mages
- Purchase/remove gems
- Save/load army configurations

**Placement & Scripting**
- Position units in deployment zone
- Configure squad scripts (stance, target priority)
- Configure hero scripts (opening actions, conditions, default behavior)
- Write army-level orders for Commander

**Batch Operations**
- Add multiple squads at once
- Equip items across multiple heroes
- Remove all units of a certain type

---

## Limitations

### No Active Battle Access

The interface has no access to:
- Active battles in progress
- Battle resolution as it happens
- LLM Commander decisions during battle

Battle-time AI is the Commander's domain.

### Replay Access

The interface **can** access replays:
- Saved replays
- The replay currently being viewed

This enables post-battle analysis.

### No Opponent Data

External Assistants cannot see:
- Opponent's army
- Opponent's faction choice (until revealed)
- Opponent's strategy or scripts

### No Rule Bypass

External Assistants cannot:
- Exceed point budget
- Use units not in faction roster (without mercenary cost)
- Equip invalid items
- Create illegal army configurations

All actions go through the same validation as player actions.

---

## References

- `05_army_building.md` — What army building involves
- `07_llm_commander.md` — The battle-time AI (distinct from this)
- `08_multiplayer_and_match_flow.md` — When setup occurs
