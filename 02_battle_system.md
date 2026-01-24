# Battle System

## Overview

The battle system is the core simulation engine that resolves combat between two armies. It operates as a tick-based simulation that produces a complete event log for deterministic replay.

**Deployment:**
- **Multiplayer**: Resolver runs server-side
- **Single-player**: Resolver runs locally on the client

**Design Goals:**
- Support ~1000 units per side (2000 total)
- Deterministic replay from event log
- Clear separation between simulation (resolver) and visualization (replayer)
- Support LLM Commander intervention at defined points
- Rich enough to reward army composition and order quality

**Open Question:** How does the LLM Commander function in offline single-player? Options include: requiring internet for Commander features, bundling a local model, or limiting single-player to scripted-only mode.

---

## Tick-Based Resolution

Time in battle is measured in **ticks**. All actions, movement, and projectile travel are expressed in tick costs.

### Core Concepts

- **Tick**: The fundamental unit of battle time. All events are stamped with their tick number.
- **Action Cost**: Each action (move, attack, cast) has a tick cost. A unit cannot act again until that cost elapses.
- **Simultaneous Resolution**: Multiple events can occur on the same tick. A defined ordering ensures determinism.

### Tick Flow

Each tick, the resolver:
1. Resolves projectile impacts and effect expirations scheduled for this tick
2. Processes unit actions for units whose cooldown has elapsed
3. Advances to the next tick

### Tick Rate (Replay)

The tick rate determines how fast replays play back. **Placeholder value: 20 ticks/second** at 1× speed.

The actual tick rate will be determined after scoping out actions, spells, and abilities. It needs to feel right at normal playback speed.

Configurable playback speeds: 0.5×, 1×, 2×, 4× (and potentially faster for skimming).

---

## The Battlefield

### Grid

Battles take place on a 2D grid. Grid dimensions are configurable per battle/map.

- **Reference size**: 80 × 40 tiles (prototype scale)
- **Tile coordinate system**: (x, y) with (0, 0) at top-left

### Tile Constraints

Multiple units can occupy the same tile, subject to limits.

**Placeholder values (to be tuned):**

| Constraint | Value |
|------------|-------|
| Max units per tile | 4 |
| Max total size per tile | 10 |

Units have a **size** value that varies by unit type. Final size values will be determined during faction/roster design. A tile's occupants cannot exceed either limit.

**Side exclusivity**: A tile can only contain units from one side at a time under normal circumstances. Enemy units cannot share tiles. (Exception: Trampling mechanics may temporarily force enemies out—see Movement section.)

### Terrain Types

Terrain affects movement, combat, and visibility. Below are starting terrain types; the full game will support many more.

| Terrain | Base Cost | Notes |
|---------|-----------|-------|
| Open / Grassland | 1× | Default terrain |
| Forest / Trees | 2× | May block projectiles, restricts mounted movement |
| Water (shallow) | Variable | May be passable for amphibious units |
| Water (deep) | Impassable | Passable for swimming/flying units |
| Hills | TBD | Potential range/defense bonuses |
| Walls / Fortifications | TBD | Cover, restricted movement |

### Movement Types and Terrain Costs

Different units have different **movement types** that interact with terrain differently. Rather than special-casing (e.g., "cavalry in forests"), we use a **cost matrix**:

| Movement Type | Open | Forest | Shallow Water | Deep Water | Hills |
|---------------|------|--------|---------------|------------|-------|
| Foot | 1× | 2× | 3× | — | 1.5× |
| Mounted | 1× | 3× | — | — | 1.5× |
| Flying | 1× | 1× | 1× | 1× | 1× |
| Amphibious | 1× | 2× | 1× | 2× | 1.5× |

*(Values are illustrative. "—" means impassable for that movement type.)*

This approach scales cleanly as we add terrain and movement types.

### Terrain Effects on Projectiles

Terrain may affect projectile travel:
- **Forest/Trees**: May block or reduce accuracy of arrows and other physical projectiles
- **Walls**: May provide cover

Details TBD in the Units & Abilities doc.

### Deployment Zones

Each side has a designated deployment zone where their army starts:

- Deployment zones are on opposite ends of the battlefield
- Zone dimensions are map-dependent
- Units must be placed within their side's zone at battle start

---

## Victory Conditions

A battle ends when any of the following occur:

### Primary Conditions

| Condition | Result |
|-----------|--------|
| One side has 0 units remaining **on the battlefield** | Other side wins |
| Both sides reach 0 units on same tick | Draw |
| Time limit reached | See below |

**"On the battlefield"** includes all living, active units. Units that have **routed off the battlefield edge** count as no longer present (even if alive). Units that are dead but trackable (for resurrection mechanics) are not present.

### Time Limit Resolution

When the time limit is reached:

1. All units become **idle** (stop taking actions)
2. All in-flight projectiles resolve to completion
3. All active effects and spells with durations resolve/expire
4. Final state is evaluated

**Result:**
- If one side has survivors and the other doesn't → that side wins
- If both sides have survivors → **Draw**
- If neither side has survivors → **Draw**

**Time limit placeholder**: 5000 ticks. Final value TBD based on typical battle pacing.

### Edge Cases and Hard Stop

Effects with infinite duration (if any exist) may need special handling at time limit. If any edge case causes a battle to not terminate after the time limit resolution phase, this should be treated as a **bug** to be fixed.

As a safety net, a secondary hard time limit could force termination, but triggering it indicates a problem that needs addressing.

---

## Unit State and Death

### Unit Tracking

Units are **never deleted** from the battle state. When a unit dies, it transitions to a dead state but remains tracked. This enables:

- Resurrection abilities
- Undead mechanics (raising fallen enemies)
- Post-battle statistics
- Replay accuracy

### Death Conditions

A unit dies when:
- **HP reaches 0**, or
- **Critical wound** is suffered (e.g., decapitation)
  - Note: Some units may survive wounds that would kill others (multi-headed creatures, undead, etc.)

### Unit States

| State | Description |
|-------|-------------|
| Active | Alive and on the battlefield |
| Dead | Killed, still tracked, potentially resurrectable |
| Routed | Fled the battlefield, no longer participating |
| Incapacitated | TBD—stunned, knocked out, etc. |

---

## Combat Stats and Resources

### Hit Points (HP)

Units have HP. Damage reduces HP. Death occurs at 0 HP (or from critical wounds).

**Note:** The prototype used one-hit removal as a placeholder. The full game uses HP with a wounds system.

### Wounds System

Beyond HP damage, attacks may inflict **wounds**—specific injuries with mechanical effects:

- Leg wound → reduced movement
- Arm wound → reduced attack effectiveness
- Critical wound (decapitation, heart destruction) → instant death

Wound thresholds and effects TBD in Units & Abilities doc.

### Fatigue / Stamina

Units have a **stamina** resource that depletes through:
- Combat actions (attacks, blocks)
- Spellcasting (replaces traditional "mana")
- Sprinting / forced march
- Sustained exertion

**Stamina depletion effects:**
- Reduced action speed
- Reduced effectiveness
- Eventually: inability to act, collapse

Stamina recovery occurs over time and may be enhanced by rest or abilities.

---

## Unit Actions & Timing

### Action Types

Below are starting action types. The full game will support many more.

| Action | Description |
|--------|-------------|
| Move | Move one tile (cardinal or diagonal) |
| Melee Attack | Attack enemy in melee range |
| Ranged Attack | Fire projectile at enemy in range |
| Cast Spell | Use an ability |
| Defend | Defensive stance, reduced incoming damage |
| Wait | Do nothing for 1 tick |
| Rout | Flee toward battlefield edge |

### Action Costs (Placeholder Reference)

The following are **placeholder values** from the prototype. These unit types are not intended for the final game—they serve as reference points for understanding the system. Actual rosters will be defined in the Factions doc.

| Unit Type | Move | Attack | Wait |
|-----------|------|--------|------|
| Infantry (placeholder) | 6 | 12 | 1 |
| Heavy Infantry (placeholder) | 7 | 13 | 1 |
| Archer (placeholder) | 6 | 14 | 1 |
| Cavalry (placeholder) | 4 | 12 | 1 |
| Mage (placeholder) | 6 | 16 | 1 |

### Action Resolution

When a unit's action cooldown reaches the current tick:
1. Unit evaluates available actions based on its script/orders and battlefield state
2. Unit selects and executes one action
3. Unit's next available tick = current tick + action cost

### Failed Actions and Fallback Behavior

If a unit's intended action fails (e.g., movement blocked), the unit should **not** simply wait. Instead, it evaluates fallback options based on context:

- Movement blocked by enemy → consider attacking
- Movement blocked by terrain → consider alternate path
- Target out of range → consider moving closer
- No valid action → wait as last resort

The exact fallback heuristics need to be designed. Scripts may specify preferred fallbacks.

---

## Combat Resolution

### Distance Metrics

| Measurement | Method |
|-------------|--------|
| Cardinal distance | Manhattan: `\|x1 - x2\| + \|y1 - y2\|` |
| Diagonal distance | Each diagonal step counts as **1.5 tiles** |

Diagonal distance applies to ranged attacks and movement costs.

### Melee Combat

- **Range**: Adjacent tiles (distance = 1) for most units
- **Large units**: May have extended melee range (e.g., size 10 giant with greatsword → 2 tile range, including diagonals)
- **Resolution**: Attack roll vs. defense, modified by stats, wounds, fatigue, etc.
- **Damage**: Successful hits deal HP damage and may inflict wounds

### Ranged Combat

- **Range**: Unit/weapon specific (e.g., shortbow ~8, longbow ~12, siege ~20+)
- **Minimum range**: Cannot target own tile (minimum distance = 1); some weapons may have larger minimum ranges
- **Projectile**: Attack spawns a projectile that travels to target
- **Precision**: Ranged attacks have a **precision** value that determines potential deviation from the intended target. Lower precision = more scatter.

### Magic / Spellcasting

- Uses **stamina** (not mana)
- Spells may create projectiles, apply effects, summon units, etc.
- Detailed in Units & Abilities doc

---

## Projectiles

Ranged attacks and many spells create projectiles that travel across the battlefield.

### Projectile Properties

| Property | Description |
|----------|-------------|
| Speed | Ticks per tile traveled |
| Damage/Effect | What happens on impact |
| Target tile | Intended destination (may deviate based on precision) |
| AoE | Whether impact affects single target or area |
| Friendly fire | Whether it can harm allies |

### Precision and Deviation

Projectiles may deviate from intended target based on:
- Shooter's precision stat
- Range to target
- Target movement
- Environmental factors (wind, terrain)

Deviation is determined at fire time and baked into the projectile's actual target tile.

### Travel Time

```
impactTick = fireTick + ceil(speed × distance)
```

Example speeds (prototype reference):
- Arrow: 2 ticks/tile
- Fireball: 3 ticks/tile

### Impact Resolution

When a projectile reaches its impact tick:
1. Check target tile for valid targets
2. Apply damage/effect to targets

**Target movement**: Projectiles travel to their target tile (which may have deviated from the aimed tile). If original targets moved, projectile hits whoever is there now.

### Impact Types

| Type | Effect |
|------|--------|
| Single target | Hits one unit on the tile (selection logic TBD) |
| Area of Effect | Hits all units on the tile (or radius) |
| Piercing | Continues through to affect tiles beyond |

### Friendly Fire

Friendly fire is **per-ability**:
- Fireball → affects all units (friendly fire enabled)
- Seeking arrow → homes to enemies only
- Healing spell → affects allies only

---

## Movement

### Basic Movement

- Units move one tile per move action
- **Cardinal movement** (N, E, S, W): Base cost
- **Diagonal movement** (NE, SE, SW, NW): **1.5× base cost**

### Movement Cost Calculation

```
actualCost = baseMoveTickCost × terrainMultiplier × diagonalMultiplier
```

### Passability by Movement Type

Terrain passability depends on unit movement type:

| Unit Type | Can Pass |
|-----------|----------|
| Foot | Land terrain |
| Mounted | Land terrain (no deep water) |
| Flying | All terrain |
| Amphibious | Land and water |
| Aquatic | Water only |

### Tile Entry Rules

A unit can normally enter a tile if:
- The tile is passable for its movement type
- Adding the unit would not exceed max units per tile
- Adding the unit would not exceed max total size per tile
- The tile is empty OR occupied by friendly units only

### Trampling (Advanced)

Large or charging units may be able to **trample** into enemy-occupied tiles:
- Enemies are pushed out of the tile
- Requires specific abilities or size thresholds
- Pushed units may take damage or be knocked down
- Mechanics TBD—needs careful design to avoid exploits

### Failed Movement Fallbacks

When intended movement fails, units evaluate alternatives:

1. **Blocked by enemy**: Attack if in melee range
2. **Blocked by friendly**: Wait briefly, try alternate direction
3. **Blocked by terrain**: Pathfind around
4. **No path available**: Hold position or revert to defensive behavior

Exact heuristics are script-configurable and have sensible defaults.

### Pathfinding

Units navigate toward objectives using strategic distance fields:
- Efficient at scale (no per-unit BFS)
- Formation-aware for squads
- Accounts for terrain costs by movement type

---

## Squads

Squads are the fundamental organizational unit for armies. Players purchase and deploy **squads**, not individual units.

### Squad Types

#### Standard Squads

The core of most armies. Built around a primary unit type with optional upgrades.

**Structure:**
- **Primary units**: The main body (e.g., 20 infantry)
- **Support upgrades**: Special units attached to the squad
  - Standard bearer (morale bonus)
  - Champion (enhanced combat stats)
  - Musician (coordination bonus)
  - Sergeant (leadership)

**Scripting:** Scripts target the squad as a whole. Commands are relatively simple: attack closest, hold position, advance toward objective, focus fire on target type.

**Examples:** Infantry squad, archer squad, cavalry squadron

#### Hero Squads

Built around a powerful individual with a supporting retinue.

**Structure:**
- **Primary unit**: The hero (mage, champion, monster)
- **Retinue**: Bodyguards, attendants, lesser beings

**Scripting:** Scripts target the hero. Retinue acts in support (protect hero, follow hero, assist attacks). Hero scripts can be complex, including ability/spell usage.

**Examples:**
- Battle mage with apprentices and guards
- Dragon with handler/worshippers
- Warlord with honor guard
- Thug with mercenary band

### Special Squad Categories

| Category | Description |
|----------|-------------|
| **Thug** | Single powerful unit operating independently for tactical goals. Cost-effective "special forces." |
| **Super Combatant (SC)** | Extremely powerful single unit capable of defeating armies alone. A "one-person army." Entire army strategies may revolve around a single buffed SC. Examples: titans, ancient dragons, demon lords. |

### Squad Properties

| Property | Description |
|----------|-------------|
| ID | Unique identifier |
| Side | Which army |
| Type | Standard or Hero |
| Formation | How units arrange spatially |
| Upgrades | Special units/equipment attached |
| Unique | If true, only one per army allowed |

### Formations

| Formation | Description |
|-----------|-------------|
| Square | Compact block, balanced protection |
| Line | Wide front, thin depth—maximizes attack surface |
| Column | Narrow front, deep—for movement through gaps |
| Wedge | Pointed front for charges |
| Skirmish | Spread out, loose—reduces AoE vulnerability |
| Guard | Retinue surrounds hero |

### Squad Behavior

- Squads have a virtual **anchor point** that moves toward objectives
- Units attempt to maintain formation relative to anchor
- Stragglers may detach temporarily and rejoin
- Squads can receive collective orders or be broken into independent action

---

## Morale and Routing

Units and squads have **morale** that affects their willingness to fight.

### Morale Factors

Morale is affected by:
- Casualties in squad
- Nearby friendly casualties
- Nearby friendly routs
- Leadership presence/loss
- Being flanked or surrounded
- Winning/losing combat

### Morale Failure

When morale breaks:
- Unit/squad attempts to **rout** (flee toward nearest battlefield edge)
- Routing units do not attack
- Routing units may be rallied by leadership abilities
- Units that exit the battlefield are removed from play (but tracked)

### Rally

Routed units may be rallied:
- Leadership abilities
- Proximity to commander/standard
- Distance from threat

---

## LLM Commander Intervention

The LLM Commander can modify unit behavior during battle, not just at the start.

### Intervention Points

The Commander cannot intervene every tick (cost-prohibitive). Intervention occurs at defined points:

| Trigger | Description |
|---------|-------------|
| Time-based | Every N ticks (e.g., every 100 ticks) |
| Event-based | Significant events (squad eliminated, flank exposed, spell cast) |
| Budget-based | Fixed number of interventions per battle |

Exact trigger model TBD. Likely a hybrid approach.

### What the Commander Can Do

At intervention points, the Commander can:
- Reassign squad targets
- Change squad behaviors (aggressive → defensive)
- Trigger ability usage
- Adjust formation or positioning
- Issue retreat/rally orders

### What the Commander Cannot Do

- Break game rules
- Access hidden information
- Act on every tick
- Override player-locked orders (if implemented)

### Commander Decision Logging

All Commander interventions are logged:
- Tick of intervention
- Battlefield state summary (what Commander "saw")
- Orders issued
- Reasoning (if available from LLM)

This enables replay viewers to understand AI decisions.

### Commander Opt-Out

Players can disable the Commander and script directly. Mixed matches (Commander vs. scripted) are supported.

### Testing Mode

For deterministic testing, a **mock LLM Commander** with seeded/predictable responses enables reproducible battles.

---

## Determinism & Randomness

### Sources of Randomness

- Hit/miss rolls
- Damage variance
- Precision deviation
- Target selection (when multiple valid)
- Morale checks
- LLM Commander decisions

### Seeded PRNG

All randomness except LLM decisions uses a **seeded pseudo-random number generator**:
- Seed is part of battle input
- Same seed + same inputs = same random outcomes
- Enables testing and debugging

### LLM Non-Determinism

LLM Commander decisions introduce true non-determinism:
- Same battle state may yield different orders
- Intentional—adds variance, rewards adaptable order-writing

### Event Ordering

When multiple events occur on the same tick, ordering is deterministic:

1. Projectile impacts and effect resolutions
2. Unit actions in stable order (by unit ID)

Events keyed by `(tick, sequence)` for stable ordering.

---

## Event Log

The resolver produces a complete event log for deterministic replay.

### Event Structure

Each event contains:
- `tick`: When it occurred
- `seq`: Ordering key within tick
- `type`: Event type identifier
- `payload`: Type-specific data

### Core Event Types (Starting Set)

| Event | Payload |
|-------|---------|
| BattleStart | Grid size, terrain, initial units, seed |
| UnitSpawned | Unit ID, type, position, side, squad |
| UnitMoved | Unit ID, from, to |
| MeleeAttack | Attacker, target, hit/miss, damage, wounds |
| ProjectileFired | Source, type, target tile, impact tick |
| ProjectileImpact | Projectile ID, tile, affected units, damage |
| SpellCast | Caster, spell, targets, effects |
| EffectApplied | Target, effect type, duration |
| EffectExpired | Target, effect type |
| UnitDied | Unit ID, cause, killer |
| UnitRouted | Unit ID, direction |
| SquadBroken | Squad ID, morale state |
| CommanderIntervention | Tick, state summary, orders |
| BattleEnd | Winner, ticks elapsed, survivors |

Many more event types will be added as abilities and mechanics are designed.

### Replay Requirements

The replayer reconstructs the battle from the event log alone:
- No resolver logic access
- No re-simulation
- Pure playback of recorded events

---

## Open Questions

1. **Offline LLM Commander**: How to handle Commander in offline single-player?
2. **Wounds system details**: Which wounds exist? Thresholds? Recovery?
3. **Stamina tuning**: Depletion rates, recovery, effect severity?
4. **Trampling mechanics**: Size thresholds, push rules, damage?
5. **Precision system**: How does precision scale with range? Environmental factors?
6. **Morale thresholds**: What triggers morale checks? Break points?
7. **Rally mechanics**: Radius, cooldown, requirements?
8. **Commander intervention model**: Best trigger combination?
9. **Large unit melee range**: How does size map to reach?
10. **Squad upgrade limits**: How many upgrades per squad? Point costs?

---

## Definitions

| Term | Definition |
|------|------------|
| **Thug** | A single powerful unit that operates independently for tactical goals. Cost-effective "special forces"—strong but not army-breaking. |
| **Super Combatant (SC)** | An extremely powerful single unit capable of defeating entire armies alone. Viable strategy: one SC buffed to maximum. |
| **Hero Squad** | Squad built around a powerful individual (mage, champion, monster) with supporting retinue. |
| **Standard Squad** | Squad built around a primary unit type (infantry, archers) with optional support upgrades. |

---

## References

- `01_game_vision_and_pillars.md` — Core design pillars
- `07_llm_commander.md` — Commander system details
- `reference/tick_battle_scale_prototype_base_requirements.md` — Prototype specifications
