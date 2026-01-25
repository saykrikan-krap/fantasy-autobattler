# Scripting & Orders

## Overview

There are two layers of control:

1. **Army-level orders** — Natural language instructions given to the LLM Commander. The Commander interprets these and influences army behavior, particularly hero squads.

2. **Squad-level scripts** — Explicit, structured configurations assigned to individual squads (stance, target priority, ability conditions, etc.).

There are also two types of AI:

- **Coded squad AI** — Deterministic, rule-based AI that controls troop squad behavior. It handles pathfinding and actions based on stance and target priority settings.

- **LLM Commander** — Interprets natural language orders, manages hero ability usage, and can make adaptive decisions during battle.

Troop squads primarily rely on coded AI. Hero squads are where the LLM Commander provides the most value.

---

## Design Goals

1. **Troop squad scripts should be simple** — Stance and target priority. No complex condition trees. Easy to configure, predictable to execute.

2. **Hero squad scripts are where depth lives** — Spell/ability selection, conditions, and timing are the skill expression layer. Players invest thought here.

3. **The LLM Commander operates at the army level** — It receives natural language orders about overall strategy, not per-squad instructions. It coordinates and adapts within the bounds of squad scripts.

4. **The LLM Commander reduces tedium, not skill** — Commander handles boring conditional logic (immunity detection, resource pacing) so players focus on strategy rather than exhaustive edge-case scripting.

5. **Manual scripting is viable but opt-in** — Players who want full control can disable the Commander and script everything. This is harder but deterministic.

6. **Scripts don't assume enemy knowledge** — You can target enemy *types* (mages, cavalry, large units) but not specific enemy unit IDs. No scouting or pre-battle intel required.

7. **Scripts execute deterministically** — Given the same battlefield state and script, behavior is identical. Variance comes from RNG, Commander adaptation, and enemy actions—not script execution.

---

## High-Level Requirements

### Troop Squad Scripts

Troop squads are controlled by **coded AI**, which executes based on the squad's configuration:

- **Stance**: Determines pathing behavior, when to engage, and how to fight
- **Target priority**: What type of enemies to focus on

The coded squad AI handles pathfinding and action selection based on these settings. This makes **initial positioning during setup important**—stance determines where the squad tries to go.

**LLM Commander can modify troop configurations** during battle based on army-level orders and battlefield conditions. Examples:
- Target priority is "mages," but Commander changes it if enemy has no mages
- Stance is "Hold," but Commander switches to "Aggressive" if enemy is buffing a dangerous unit—better to charge than let them power up

The coded AI always executes; the Commander adjusts what it's executing *on*.

**Example stances** (names TBD, to be refined):
- **Aggressive**: Close to melee immediately, attack on contact
- **Hold/Delay**: Hold position, wait for buffs or enemy softening before engaging
- **Skirmish**: Maintain distance, engage at range (for ranged units)
- **Mixed engagement**: Close distance, fire ranged volley, then engage melee (for units with both capabilities)

*(Full stance and target priority definitions in later sections)*

### Hero Squad Scripts

Script is assigned to the **squad as a whole**, with the **hero as the primary actor**.

#### Design Challenges

Heroes are complex. They may have:
- Multiple buff spells to cast before engaging
- Offensive spell options (artillery, short-range AoE, sniping, melee)
- Support abilities (healing, buffing allies)
- Need for both **enemy** and **friendly** target priorities

"No plan survives contact with the enemy." Things go wrong:
- Self-buffing SC gets engaged before buffs complete
- Combo requires spell A before spell B, but caster order is unclear
- Enemy casts countermeasures (rain diminishes fire spells, fatigue curse)

It's **impractical to script turn-by-turn** for a 100+ turn battle. The LLM Commander helps, but cost constraints mean it can't choose every action for dozens of heroes.

#### Example Scenarios

*(Not comprehensive—just illustrative examples)*

**The Self-Buffing SC:**
- Cast Mirror Image, then Quickness, then engage
- Balance buff duration vs. when combatant becomes useful
- Handle disruption (enemy engages early, fatigue curse cast)

**The Combo Casters:**
- Mage A casts Grease, Mage B casts Fireball on same spot
- Order of who acts first is uncertain
- Adapt if enemy casts Rain (fire spells weakened)

**The Healer/Buffer:**
- Buff priority targets, heal wounded high-value friendlies
- React to battlefield needs

#### Reference: Dominions Approach

Dominions (no LLM) handles this with:
- **Scripted opening actions**: Explicit sequence (hold, cast X, advance)
- **Terminal general order**: Overall behavior after script completes (stay behind troops, attack melee, fire, cast spells)
- **Fallback**: If script fails (can't cast spell), hard-coded AI takes over

**Pros:** Simple to script, predictable
**Cons:** No conditions, no adaptation, silent failures

#### Our Starting Point (Conservative)

Similar to Dominions, but with:
- Basic conditions on scripted actions
- LLM Commander can intervene and modify

**Structure (Draft):**

```
Hero Script:
  1. Opening Actions (ordered list, may have conditions)
     - [Condition?] Action (cast spell, hold, advance, etc.)
     - [Condition?] Action
     - ...

  2. Default Behavior (terminal)
     - Combat style (melee, ranged, cast spells, support)
     - Enemy target priority
     - Friendly target priority (if support)
     - Positioning preference (front, behind troops, stay back)

  3. Fallback Behavior
     - What to do if scripted action fails
     - May differ from default (e.g., defend self vs. continue script)
```

**Conditions:**

Complexity baseline: **Factorio train signals**. Simple conditional logic checking battlefield state. Conditions support **AND/OR** combinations.

**What can be referenced:**
- **Friendly units**: YES — they're known (e.g., "IF Mage A has cast Grease")
- **Enemy-specific units**: NO — they're unknown pre-battle (can only reference enemy *types*)

**Signal categories (starting set):**
- **Self state**: Wounded, Low stamina, Under attack, Buff active/expired
- **Friendly state**: Specific ally wounded, Specific ally has buff, Specific ally in range
- **Enemy state**: Enemy type in range, Cluster detected, No enemies nearby
- **Battlefield**: Battle phase (opening/mid/late), Casualties above threshold

**Example: Self-Buffing SC**
```
Opening:
  1. Cast Mirror Image
  2. Cast Quickness
  3. IF not under attack: Cast Stoneskin

Default: Attack melee, priority Large enemies, stay aggressive

Fallback: If under attack during opening, skip remaining buffs and engage
```

**Example: Combo Coordination**
```
Mage A (Fire Mage):
  Opening:
    1. Cast Grease on enemy cluster
  Default: Cast spells, priority Clusters

Mage B (Battle Mage):
  Opening:
    1. IF (Fire Mage has cast Grease) AND (Grease target in range): Cast Fireball on Grease location
    2. ELSE: Hold
  Default: Cast spells, priority Clusters
```

Mage B references the friendly Fire Mage by name—this is allowed because friendly units are known. The LLM Commander can handle this coordination more fluidly, but manual scripting should be possible.

#### LLM Commander's Role with Heroes

- Interpret high-level orders ("buff up then engage," "combo fire spells with grease")
- Generate opening sequences and conditions
- **Intervene** when battlefield changes (skip buffs if engaged, change target if immune)
- Handle coordination between multiple heroes

Commander can't choose every action (cost), but can:
- Set up good initial scripts
- Intervene at key moments (configurable frequency)
- Adjust default behaviors mid-battle

#### Open Questions (Hero Scripting)

- How many opening actions can be scripted?
- Nested conditions—how deep? (AND inside OR inside AND?)
- What's the intervention budget for Commander per hero?
- How do we handle "wait for X" without deadlocks?
- What happens when a condition can never be satisfied?

### Retinue (Hero Squad Support Units)

- **No separate scripting** — retinue behavior is determined by their identity/role
- Bodyguards protect the hero, attendants support, etc.
- Behavior is implicit based on unit type, not player-configured

---

## Document Sections (To Be Developed)

### Stances (Troop & Hero Squads)
What stances exist and what they mean for squad behavior.

### Target Priorities (Troop Squads)
The vocabulary of target categories (not specific units).

### Conditions (Hero Squads)
What conditions can be expressed for ability usage.

### Ability Prioritization (Hero Squads)
How players express which abilities to prefer and when.

### Army-Level Orders & LLM Commander
How natural language orders work and what the Commander can do.

### Manual Scripting (Commander Opt-Out)
What the experience looks like without the Commander.

### Fallback Behavior
What happens when intended actions fail.

---

## Open Questions (Parking Lot)

- Condition complexity limits for manual scripters
- Whether squad upgrades unlock new scripting options
- Order templates and sharing
- Opponent script visibility in replays
- Cross-faction scripting differences (if any)

---

## References

- `02_battle_system.md` — Combat mechanics that scripts control
- `07_llm_commander.md` — How the Commander interprets and adapts scripts
