# LLM Commander Requirements

## Overview

The LLM Commander is the AI system that interprets player orders and directs unit behavior during battle. It serves as an abstraction layer between high-level player intent and low-level unit scripts, removing the need for players to be programmers while preserving strategic depth.

This is included in v1 and intentionally experimental. See Policy Summary for opt-out and balance details.

---

## Policy Summary (V1)

- Included in v1 as a major differentiator; intentionally experimental
- Commander runs server-side for battle resolution; players cannot bring their own LLM for battles
- Opt-out allowed at any time; mixed matches supported
- Balance assumes Commander-enabled play; if opt-out dominates, the Commander needs improvement
- Offline mode uses scripted-only behavior (Commander unavailable)

---

## Commander vs. Assistant: Key Distinction

The game involves two separate LLM-powered systems that must not be conflated:

| Aspect | LLM Commander | LLM Assistant |
|--------|---------------|---------------|
| **When** | During battle resolution | During army setup (pre-submission) |
| **Where** | Server-side, game-managed | Client-side via MCP server |
| **LLM Provider** | Game server (cost absorbed by game) | Player's own LLM agent harness |
| **Required?** | Optional (players can script manually) | Optional (power user feature) |
| **Purpose** | Interprets orders, adapts scripts during battle | Helps player build army, write orders, analyze replays |

**LLM Commander:** Receives player's natural language orders at submission time, generates scripts, and adapts during battle. Players who prefer full control can disable the Commander and micromanage scripts directly.

**LLM Assistant:** An optional integration for power users who have an LLM agent setup (e.g., Claude Code, Codex). The game ships with an MCP server that exposes army building, order writing, and replay analysis capabilities. The Assistant has full command and control during setup, following player prompts. Most players may not use this—it's a power user feature.

This document focuses on the **LLM Commander**. See the MCP Integration doc for the Assistant.

---

## Role & Responsibilities

### What the LLM Commander Does

1. **Interprets player orders** - Translates natural language or structured orders into unit behaviors
2. **Generates initial scripts** - Before battle begins, produces the starting behavior scripts for all units
3. **Adapts during battle** - Monitors battlefield conditions and adjusts scripts when circumstances warrant
4. **Operates within constraints** - Respects player-defined boundaries and priorities

### What the LLM Commander Does NOT Do

- Make army composition decisions (that's the player's job)
- Spend points or select units
- Override explicit player prohibitions
- Act outside the scripting system's capabilities

### Opting Out of the Commander

Some players prefer full control and may disable the LLM Commander entirely. These players:
- Write scripts directly using the scripting system
- Have complete determinism in their unit behavior (no LLM adaptation)
- Trade flexibility for predictability

Opt-out is allowed at any time. The game should be designed so that the Commander provides clear benefits (adaptation, convenience) that make most players *want* to use it, while respecting that some players prefer manual control. If opting out is consistently stronger, that signals the Commander needs improvement.

---

## Pre-Battle: Order Interpretation

Before battle resolution begins, players submit orders to their LLM Commander.

### Order Types (Examples)

**Formation & Positioning:**
- "Infantry hold the center"
- "Archers stay behind the infantry line"
- "Cavalry on the flanks, ready to sweep"

**Targeting Priorities:**
- "Mages focus on enemy cavalry"
- "Archers target their mages first"
- "Ignore skirmishers, focus on heavy infantry"

**Timing & Triggers:**
- "Hold position until they close to melee range"
- "Cavalry charge when their archers are exposed"
- "Mages hold fire until enemy groups cluster"

**Spell Usage:**
- "Lead with fireballs on dense formations"
- "Save lightning for armored targets"
- "Don't waste AoE on single units"

**Contingencies:**
- "If flanked, infantry form defensive square"
- "If mages die, archers fall back"
- "Protect the archers at all costs"

### Order Format

Orders are **natural language prompts**, just like any other LLM interaction. Players write orders the way they would instruct a human general.

**Order management features:**
- **Save/load prompts** - Players can save successful order sets and reuse them (standalone or as part of a full army setup)
- **Prompt review (optional)** - Before final submission, players can request the Commander show how it interprets the orders. This allows refinement before committing to battle.

### Interpretation Output

The LLM Commander produces:
1. **Initial scripts** for each unit/squad (priority-based behavior sequences)
2. **Adaptation rules** - Conditions under which it will intervene during battle
3. **Interpretation summary** - Human-readable explanation of how it understood the orders

The interpretation summary is stored and shown to the player so they can understand how their orders were translated.

---

## During Battle: Adaptation

The LLM Commander monitors the battle and can adjust scripts when conditions warrant.

### Intervention Triggers

The LLM Commander may intervene when:

1. **Assumptions invalidated** - Enemy does something unexpected that changes optimal behavior
   - Example: Fire immunity cast → switch mages away from fire spells

2. **Tactical opportunities** - Conditions arise that weren't anticipated but align with player intent
   - Example: Enemy flank exposed → redirect cavalry per "sweep the flanks" order

3. **Threats to priorities** - Something the player said to protect is endangered
   - Example: "Protect the archers" + archers under attack → redirect nearby units

4. **Stalemates or ineffective behavior** - Current scripts aren't making progress
   - Example: Melee units stuck behind friendly lines → redirect to useful position

### Intervention Constraints

**Cost-driven limitations:**
- LLM calls are expensive; cannot intervene every tick
- Intervention frequency must be bounded (TBD: time-based cadence, event-triggered, or hybrid)

**Scope limitations:**
- Each intervention adjusts scripts; it doesn't directly control units
- Changes take effect on subsequent ticks as units complete current actions

**Player intent preservation:**
- Interventions must align with stated orders
- Cannot contradict explicit player instructions
- Should be explainable in terms of original orders

---

## Event Logging

All LLM Commander activity must be captured in the event log for replay visibility.

### Events to Log

**Pre-battle:**
- `CommanderOrdersReceived` - Raw player orders
- `CommanderInterpretation` - How orders were understood, initial scripts generated

**During battle:**
- `CommanderIntervention` - When, why, and what changed
  - `tick` - When intervention occurred
  - `trigger` - What prompted it (battlefield condition)
  - `reasoning` - Brief explanation
  - `changes` - What scripts were modified

### Replay Visibility

Players watching replays should be able to:
- See when the LLM Commander intervened
- Understand why (trigger + reasoning)
- See what changed (before/after scripts)

This supports learning and debugging:
- "Why did my cavalry charge early?" → Commander saw opportunity
- "Why did my mages stop casting fireballs?" → Detected fire immunity

---

## Integration with Scripting System

The LLM Commander operates **through** the scripting system, not around it.

### Scripting System Capabilities

The underlying scripting system (see Scripting & Orders doc) defines what behaviors are possible:
- Target selection (nearest, weakest, priority type, specific unit)
- Action priorities (attack, move, hold, cast spell X)
- Conditions (if in range, if health below, if enemy count above)
- Formation behaviors (maintain position, follow anchor, free movement)

### LLM Commander's Role

The LLM Commander:
1. Translates player orders into valid script configurations
2. Can modify scripts during battle within the system's capabilities
3. Cannot invent behaviors the scripting system doesn't support

This separation ensures:
- Deterministic execution (scripts run predictably)
- Bounded complexity (LLM doesn't control everything)
- Testability (can test scripts without LLM)

---

## Fairness & Competitive Integrity

### Server-Side Execution

- LLM Commander runs on the game server, not client
- Both players' commanders use the same LLM (or same tier of LLM)
- Players cannot bring their own LLM for battle resolution

### Skill Expression

Player skill is expressed through:
1. Quality of orders (clear, specific, good contingencies)
2. Understanding of LLM Commander capabilities
3. Anticipating opponent strategies in orders

The LLM Commander is a tool that rewards good communication of intent.

### Variance Acceptance

Different battles with same armies/orders will have different outcomes due to:
- RNG in combat resolution
- LLM interpretation variance
- Different battlefield dynamics triggering different interventions

This variance is intentional and adds replayability.

---

## Cost Considerations

LLM inference has real costs. The system must balance responsiveness with sustainability.

### Cost Drivers

- **Pre-battle interpretation** - One call per player per battle (acceptable)
- **During-battle intervention** - Variable; potentially many calls per battle (concerning)

### Mitigation Strategies (To Explore)

1. **Cadence-based intervention** - Commander evaluates every N ticks (e.g., every 100 ticks)
2. **Event-triggered intervention** - Only evaluate when significant events occur (unit type eliminated, spell cast, formation broken)
3. **Budget per battle** - Fixed number of interventions allowed
4. **Tiered intervention** - Cheap/fast checks determine if expensive/full evaluation needed
5. **Cached patterns** - Common situations → cached responses

### Player-Facing Implications

- Players may see "Commander evaluating..." moments during replay
- Intervention limits may be visible (e.g., "3 of 5 interventions used")
- Transparency about what the commander can/cannot do

---

## Resolved Decisions

1. **Order syntax** - Natural language prompts. Players write orders as they would instruct a human general.

2. **Contradiction handling** - The Commander decides. Ambiguous or contradictory orders are part of the skill expression—players who write clear, well-prioritized orders with good contingencies will see better results. This incentivizes good prompting.

---

## Open Questions

1. **Intervention frequency** - What's the right balance? Options:
   - Time-based (every N ticks)
   - Event-based (on significant battlefield changes)
   - Hybrid (regular check-ins + event triggers)
   - Budget-based (X interventions per battle)

2. **Interpretation transparency** - How much should players see during prompt review? Full script dump? Summary? Just "Commander understands: [paraphrase]"?

3. **Learning/feedback** - Should the system help players write better orders? ("Your order 'attack' is vague—consider specifying targets")

4. **Fallback behavior** - What happens if LLM call fails mid-battle? Continue with existing scripts? Pause? Default behaviors?

---

## Success Criteria

For v1, the LLM Commander should:

- [ ] Successfully interpret a variety of natural language orders
- [ ] Generate valid, sensible initial scripts from orders
- [ ] Intervene appropriately when battlefield conditions change
- [ ] Log all decisions for replay visibility
- [ ] Operate within sustainable cost bounds
- [ ] Feel like a "smart general" that understands player intent
- [ ] Not feel random or frustrating—players should understand why it acted
