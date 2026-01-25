# Units & Abilities

## Overview

This document defines the **framework** for unit stats, equipment, abilities, and related systems. It does not enumerate every specific unit, ability, or status effect—those will number in the hundreds and are defined elsewhere (Factions doc, content databases).

---

## Chassis System

A combatant's **chassis** determines what equipment slots they have. Different creature types have different slot configurations.

**Example chassis:**

| Chassis | Slots |
|---------|-------|
| Humanoid | Head, Chest, Legs, Gloves, Left Hand, Right Hand, 2× Misc |
| Dragon | Head, 3× Misc |
| Hydra | 9× Head, no Misc |
| Beast (quadruped) | Head, Body, 2× Misc |

*(More chassis types defined as needed)*

### Equipment Rules by Unit Type

| Unit Type | Equipment |
|-----------|-----------|
| **Regular squad units** | Fixed equipment set. Generally mundane items, no misc items. Squad upgrades may change equipment (e.g., leather → heavy armor). |
| **Hero combatants** | Custom items in each slot. Configured during army setup. |
| **Retinue** | Fixed equipment like regular units. Not customizable. |

---

## Core Stats

| Stat | Description |
|------|-------------|
| **HP** | Hit points. Death at 0 (or from critical wounds). |
| **Stamina** | Resource for actions and spellcasting. Depletion is debilitating. |
| **Size** | Physical size. Affects tile capacity, some combat interactions. |
| **Movement Type** | Foot, Mounted, Flying, Amphibious, etc. Determines terrain costs. |
| **Attack** | Offensive capability in melee/ranged combat. |
| **Defense** | Ability to avoid being hit. |
| **Protection** | Damage reduction when hit. Multiple sources (armor, natural, shield). |
| **Precision** | Accuracy for ranged attacks. Affects projectile deviation. |
| **Attack Speed** | How quickly attacks execute (tick cost). |
| **Movement Speed** | How quickly movement executes (tick cost). |
| **Casting Speed** | How quickly spells cast (tick cost). Mages only. |
| **Encumbrance** | How rapidly the unit fatigues from actions. Higher = faster fatigue. |
| **Experience Level** | Combat experience. May affect various capabilities. |

*(Additional stats may be defined as needed)*

---

## Magic System

### Schools of Magic

There are **8 schools** organized into two categories:

**The 4 Elements:**
- Fire (F)
- Earth (E)
- Water (W)
- Air (A)

**The 4 Sorceries:**
- Life (L)
- Death (D)
- Celestial (C)
- Infernal (I)

### Proficiency

- **Regular units**: Never proficient in magic schools
- **Heroes**: May have proficiency in one or more schools

Proficiency is measured as a **skill level**:
- Starts at 1
- Soft cap around 10 for balance purposes
- Technically unbounded (powerful beings may exceed 10)

A mage's profile might be written as: `3F1E2L` (Fire 3, Earth 1, Life 2)

### Spell Requirements

Spells require proficiency in one or more magic paths:
- One path is designated the **primary proficiency**
- Spell notation: `3F1E` means requires Fire 3, Earth 1

### Fatigue Cost

Spell fatigue cost is based on the **difference** between:
- Caster's skill level in the spell's **primary** proficiency
- Spell's required level in that proficiency

**Example:**
- Spell requires `3F1E` (Fire primary)
- Mage A has `5F1E` → Fire is 2 above requirement → lower fatigue cost
- Mage B has `3F4E` → Fire is exactly at requirement → higher fatigue cost

Higher skill in the primary path = easier (less fatiguing) to cast.

*(Full magic system may warrant a separate document)*

---

## Weapons

### Weapon Sources

Units may have weapons from:
- **Natural weapons**: Claws, bite, fire breath, tail swipe
- **Equipment**: Swords, bows, staves (from equipment slots)

### Weapon Interaction Rules

| Type | Behavior |
|------|----------|
| **Additive** | Multiple weapons can be used (e.g., dual swords), possibly with penalty |
| **Mutually Exclusive** | Only one can be used per action (e.g., fire breath OR sword, not both) |

Which weapons are additive vs. mutually exclusive is defined per weapon type.

### Weapon Selection

When a unit has multiple weapon options:
- **Hero squads**: Script or LLM Commander determines choice
- **Troop squads**: Hard-coded AI selects based on situation

*(Exact mechanism TBD)*

---

## Abilities

### Ability Categories

| Category | Description |
|----------|-------------|
| **Offensive spells** | Direct damage, AoE, artillery, sniping |
| **Buffs** | Enhance self or allies (Mirror Image, Quickness, etc.) |
| **Debuffs** | Weaken enemies (slow, fatigue curse, etc.) |
| **Healing** | Restore HP to allies |
| **Utility** | Terrain modification, summoning, teleportation |
| **Natural abilities** | Like spells but no magic path requirement, may have different encumbrance rules |

### Spells vs. Natural Abilities

| Aspect | Spells | Natural Abilities |
|--------|--------|-------------------|
| Magic path required | Yes | No |
| Fatigue mechanism | Based on proficiency difference | May have unique rules |
| Who has them | Caster heroes | Any unit (heroes or regular) |

**Examples of natural abilities:**
- Fire breath (offensive, natural)
- Regeneration (passive, natural)
- Poison bite (offensive, natural)

### Passive Abilities

Some abilities are always active:
- Regeneration (HP recovery over time)
- Fire immunity
- Fear aura

These don't require actions to use—they apply automatically.

---

## Status Effects

Status effects are temporary (or permanent) modifiers applied to units.

### Categories

| Category | Examples |
|----------|----------|
| **Buffs** | Haste, Protection, Invisibility, Berserk |
| **Debuffs** | Slow, Weakness, Blindness, Fatigue curse |
| **Damage over time** | Poison, Burning, Bleeding |
| **Control** | Stun, Freeze, Charm, Fear |
| **Immunities** | Fire immunity, Magic resistance |

### Effect Properties

- **Duration**: Ticks or permanent
- **Stacking**: Does it stack? Replace? Refresh duration?
- **Source tracking**: Who applied it (for combo/interaction purposes)

*(Hundreds of specific effects will exist—this is the framework)*

---

## Wounds

When taking damage, units may acquire **wounds**—specific injuries with mechanical effects.

### Wound Acquisition

Exact mechanism TBD. Likely factors:
- Damage amount relative to max HP
- Damage type (slashing more likely to sever)
- Random chance
- Attacker abilities (vorpal weapons)

### Wound Effects

| Wound | Effect |
|-------|--------|
| Lost eye | Reduced Attack, Defense, Precision |
| Lost arm | Removes hand slot (and equipped item), reduced Attack |
| Lost leg | Severely reduced Movement Speed, may fall prone |
| Lost head | **Fatal** (usually—multi-headed creatures survive) |
| Internal injury | Reduced Stamina recovery, ongoing damage |
| Broken bones | Various penalties based on location |

### Special Cases

- **Multi-headed creatures**: Can lose heads without dying until last head lost
- **Undead**: May ignore certain wound types
- **Regenerating creatures**: Wounds may heal over time

*(Full wound list defined elsewhere)*

---

## Mounted Units

Mounted units are a **composition** of two entities: mount and rider.

### Composition

| Component | Contributes |
|-----------|-------------|
| **Mount** | Size, Movement Type, Movement Speed, natural weapons, some Protection |
| **Rider** | Attack, weapons, abilities, spellcasting |

### Size

The composite unit's Size = mount's Size (which must be larger than rider).
This is why cavalry is larger than infantry.

### v1 Simplification

For v1: Mount and rider are **treated as one unit**.
- Live together, die together
- Single HP pool (combined or mount's—TBD)
- Cannot be separated during combat

*(Separation mechanics may be revisited post-v1)*

### Complex Mounts

Some mounts are more complex:
- **Chariots**: May have driver, archer, and horses as components
- **War elephants**: May carry multiple riders

*(Handled as special cases)*

---

## Protection System

Protection reduces damage when a unit is hit. Multiple sources contribute.

### Protection Sources

| Source | Description |
|--------|-------------|
| **Natural protection** | Scales, thick hide, magical nature |
| **Armor** | Worn equipment (chest, helm, etc.) |
| **Shield** | Held shield (special bypass mechanic) |

### Shield Bypass Mechanic

Shields provide both Defense bonus and Protection, but with a twist:

**Example:**
- Unit has base Defense 10
- Shield provides: +4 Defense, +10 Protection
- Effective Defense range: 10-14

**Attack resolution:**
- Attack roll that would hit Defense 10-14: Shield blocks, +10 Protection applies
- Attack roll that would hit Defense 15+: Bypasses shield entirely, no shield Protection

This represents attacks that get past the shield.

### Stacking Rules

- **Natural + Armor**: Should NOT stack additively (would be overpowered)
- Likely: Take higher value, or diminishing returns formula
- *(Exact mechanism TBD)*

---

## Encumbrance & Fatigue

### Encumbrance

Encumbrance determines how rapidly a unit fatigues from actions.

**Factors that increase encumbrance:**
- Heavy armor
- Heavy weapons
- Carried items

**Effects of high encumbrance:**
- Faster Stamina drain from actions
- Especially impactful for spellcasting

### Fatigue Effects

As Stamina depletes:
- Reduced action effectiveness
- Slower action speed
- Eventually: inability to act, collapse

### Encumbrance Reduction

Some abilities may reduce encumbrance effects for specific action types:
- "Battle mage training" reduces casting encumbrance
- "Conditioned athlete" reduces movement encumbrance

*(Specific abilities defined elsewhere)*

---

## Unit Tags

There are no rigid archetypes, but units may be **tagged** to help AI systems and scripts handle them appropriately.

**Example tags:**
- `infantry`, `ranged`, `cavalry`, `caster`, `support`
- `large`, `flying`, `undead`, `demon`
- `hero`, `leader`, `elite`

Tags are not exclusive—a unit might be `caster`, `flying`, `hero`.

Scripts and AI use tags for targeting (e.g., "target casters first").

---

## Open Questions

1. **Wound acquisition mechanism**: Threshold-based? Random? Damage-type dependent?
2. **Protection stacking formula**: How do natural + armor combine?
3. **Mounted unit HP**: Combined pool or mount's HP?
4. **Weapon selection for troops**: Always hard-coded AI, or simple script option?
5. **Encumbrance reduction abilities**: How granular? Per action type?
6. **Experience system**: How is XP gained? What does leveling provide?

---

## References

- `02_battle_system.md` — Combat resolution, damage, movement
- `04_factions.md` — Specific unit rosters (TBD)
- `06_scripting_and_orders.md` — How abilities are scripted for heroes
- Magic System doc — May be split out if scope warrants
