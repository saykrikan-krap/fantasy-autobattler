# Army Building

## Overview

Army building is the strategic phase before battle where players spend points to assemble their forces. The point budget determines the battle's scale and character—low-budget battles are mundane infantry affairs; high-budget battles feature powerful magic, legendary creatures, and heavily buffed combatants.

Army building occurs before submission. Once submitted, the army is locked for that match.

---

## Point Budget

Each match has a **point budget** that both players share (same limit for both sides).

**Budget tiers** (examples, values TBD):
- **Skirmish** — Small engagements, mostly mundane troops
- **Battle** — Standard scale, mix of troops and magic
- **Grand Battle** — Large armies, significant magical presence
- **Apocalypse** — Maximum scale, legendary creatures and artifacts

Higher budgets don't just mean *more* units—they unlock access to expensive heroes, powerful items, and rare creatures that wouldn't fit in smaller budgets.

---

## Roster Sources

Players draw from three sources when building an army:

### Core Faction Roster

Each faction has a unique roster of:
- **Squads** — The faction's native troop types
- **Heroes** — Named individuals and hero archetypes (may be non-casters or mages)

Faction rosters reflect their identity. An undead faction has skeleton squads and necromancers; a dwarven faction has ironbreakers and runesmiths.

### Mercenary Roster

A universal roster available to all factions:
- Higher cost for equivalent quality
- Used to plug gaps (e.g., a faction lacking ranged units or certain magic paths)
- May enable synergies not available in core roster

Mercenaries are a tax—you pay a premium for flexibility.

### Magic Creatures

Pre-battle magical beings that join the army (distinct from battlefield summons, which are temporary creatures conjured by spells during combat).

Magic creatures:
- Have a **magic path requirement** (e.g., `2F` for a fire elemental)
- Cost varies by faction affinity (see below)
- Can be regular creatures or heroes (including spellcasters)

---

## Magic Path Affinity

Each faction has a **magic affinity configuration**—cost multipliers for each magic school. This represents how easily the faction can acquire magic-related assets.

### Affinity Levels

Affinity has **levels** (exact values TBD):
- **Abundant** — Significant discount
- **Moderate** — Small discount or baseline cost
- **Limited** — Penalty
- **None** — Severe penalty

There is no "opposing" affinity—just degrees of access.

### What Affinity Affects

- Magic creature costs
- Magic item costs
- Gem costs
- Empowerment costs for gaining new paths

### Example Configurations

| Faction | Fire | Earth | Water | Air | Life | Death | Celestial | Infernal |
|---------|------|-------|-------|-----|------|-------|-----------|----------|
| Undead | Limited | Moderate | Limited | None | None | Abundant | None | Moderate |
| High Elves | Moderate | Moderate | Moderate | Moderate | Abundant | Limited | Abundant | None |
| Orcs | Moderate | Abundant | None | None | Limited | Limited | None | Moderate |

*(Values illustrative only)*

### Why It Matters

A faction without Air magic might still want an Air-affiliated creature or item for a specific tactic. They *can* acquire it—but at significant cost. This creates meaningful faction identity while preserving strategic options.

Affinity should align with faction lore and roster. A faction with many fire mages naturally has fire affinity.

---

## Items

### Item Acquisition

Every item has an associated **magic path requirement** (e.g., `2F1E`).

Item cost is modified by faction affinity:
- **Abundant affinity** — Discounted
- **Moderate affinity** — Baseline cost
- **Limited affinity** — Penalty
- **No affinity** — Severe penalty

### Item Assignment

- **Regular squad units**: Fixed equipment, not customizable (see Upgrades for exceptions)
- **Heroes**: Custom items assigned to equipment slots during army building
- **Retinue**: Fixed equipment, not customizable

### Magic Path Items

Some items **increase a mage's magic path levels** when equipped. A `+1F` amulet would raise a `2F` mage to effective `3F`, potentially unlocking stronger spells.

---

## Spells

### Spell Access

All spells are **unlocked by default**. Access is gated by having a mage capable of casting them:
- Spell requires `3F1E`
- Mage needs at least `3F1E` to cast it

No spell "purchasing" or "researching"—if you have the caster, you have the spell.

### Gem-Required Spells

Particularly powerful spells require **gems** of the associated school to cast:
- Powerful summons
- Battlefield-wide buffs
- Army enchantments

Gems are purchased during army building and consumed on use.

### Gem Empowerment

Gems have a second use: **temporarily empowering casters** during battle to cast spells beyond their normal capability.

*(Full gem mechanics detailed in Magic System doc)*

---

## Gems

Gems are a **shared army resource** purchased during army building.

- Fixed base point cost per gem
- Cost modified by **faction affinity** for that school (like items and creatures)
- Pool is shared across all casters in the army
- Consumed when casting gem-required spells or empowering casters mid-battle

Factions naturally gravitate toward gem-heavy strategies in their strong schools, where gems are cheaper.

---

## Empowerment

Points can be spent to **empower mages** during army building:

### Strengthening Existing Paths

Increase a mage's proficiency in a path they already have.
- Cost scales with current level (higher levels cost more)
- Example: Raising `3F` to `4F` costs more than raising `1F` to `2F`

### Gaining New Paths

Grant a mage proficiency in a path they don't have.
- Base cost depends on **faction affinity** for that path
- Easier for factions with native access (if your faction has fire mages, empowering a non-fire mage into fire is cheaper)

### Personal Empowerment Discounts

Some mages have **individual discounts** for specific paths:
- An Augur mage might have discounted Fire empowerment
- Independent of faction affinity
- Represents the mage's latent potential or training

---

## Squad Purchasing

### Regular Squads

Purchased as a unit. Players buy the squad, not individual soldiers.

**Composition:**
- Predominantly one unit type (Swordsmen squad, Archer squad)
- Not a hard rule—mixed squads may exist

**Squad Upgrades:**

Each squad definition specifies its available upgrades. Options vary per squad and may include:

| Upgrade Type | Example |
|--------------|---------|
| **Size increase** | Add more members |
| **Equipment upgrade** | Better gear (magic swords, heavy armor) |
| **Champion attachment** | Superior unit with better stats/gear (not customizable) |
| **Special training** | Abilities or stat bonuses |

Not all squads have all upgrade types. Check the squad's definition for available options.

### Hero Squads

Purchased as hero + optional retinue.

**Hero Customization:**
- Custom items for each equipment slot (per chassis)
- Empowerment purchases (if mage or to become a mage)

**Retinue:**
- Not all heroes have retinue options
- Retinue units have fixed equipment (not customizable)
- Available retinue types depend on the hero

---

## Unique Units

Some units are **unique**—only one per army:

| Type | Example |
|------|---------|
| **Unique Heroes** | Named legendary individuals |
| **Squads of Renown** | Famous regiments with history |

Unique units are **good value for points**—their power justifies their cost. The constraint is uniqueness itself, not inflated pricing.

Unique status is per-army. The faction restriction (below) prevents both players from fielding the same faction's unique units.

---

## Army Composition Rules

### Minimum Requirement

- At least **one squad**
- This can be a single hero with no retinue (armies of one are legal)

### Faction Restriction

- Both players **cannot choose the same faction** (for v1)
- May revisit for mirror matches later

### No Other Restrictions

No mandatory units, no "must have at least X infantry," no force organization charts. If you can afford it and it's in your roster, you can field it.

---

## Validation

An army is **legal** if:

1. Total cost ≤ point budget
2. At least one squad
3. No duplicate unique units
4. All items assigned to valid slots
5. All empowerments applied to valid mages

That's it. Validation is simple—the complexity is in *optimizing* within those constraints.

---

## Strategic Depth

Army building skill involves:
- Maximizing value within budget
- Leveraging faction affinities for discounts
- Identifying when to pay mercenary/affinity penalties for key synergies
- Balancing mundane troops vs expensive magic
- Empowerment decisions (strengthen specialists vs broaden generalists)
- Item allocation across heroes
- Gem investment aligned with faction strengths

Significant balancing work required by developers to ensure diverse viable strategies.

---

## Open Questions

1. **Affinity multiplier values**: What are the actual discount/penalty percentages per level?
2. **Empowerment cost curve**: Exact scaling for path increases?
3. **Gem base cost**: Point cost per gem?
4. **Mercenary roster scope**: How large? Overlap with factions?
5. **Budget tier values**: Exact point amounts per tier?

---

## References

- `03_units_and_abilities.md` — Equipment slots, chassis system
- `04_factions.md` — Faction rosters and affinities (TBD)
- Magic System doc — Gem mechanics, spell requirements (TBD)
