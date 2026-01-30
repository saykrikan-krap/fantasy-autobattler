# Multiplayer & Match Flow

## Overview

Multiplayer is **fully asynchronous**. There is no real-time play, no waiting in lobbies, no simultaneous turns.

The flow:
1. Match is created with configuration
2. Each player builds, places, and scripts their army
3. Each player submits when ready
4. Server resolves battle when both have submitted
5. Both players are notified and can watch the replay

Players can have **multiple matches in progress** simultaneously. Submit one, play another, go to dinner—the game doesn't demand your attention until a result is ready.

---

## Match Creation

### Challenge a Friend

Direct challenge to a specific player. Both players agree on configuration before the match begins.

### Host a Game

Player creates a match with specific configuration and waits for someone to join. Listed publicly (or with invite code for semi-private).

### Random Matchmaking

Join any open hosted game that matches desired criteria (point budget range, timeout settings).

### Ranked Matchmaking

**Deferred for v1.** No ELO or ranking system initially. May be added later once balance is validated.

---

## Match Configuration

When creating a match, the following are configured:

### Point Budget

Determines army size and power level. See `04_army_building.md` for budget tiers.

Both players have the same budget.

### Submission Timeout

How long each player has to submit their army.
- Configurable per match
- Shorter timeouts for quick games
- Longer timeouts for async "play when you can" matches
- If exceeded → forfeit (see Timeouts below)

### Map

**For v1:** One map type—predominantly grasslands with some random terrain variance (trees, water).

**Future considerations:**
- Different map types (volcanic, swamp, frozen)
- Scenario modifiers (e.g., fire-enhanced volcanic region buffs fire mages)
- Would need careful balance consideration
- Good for friendly/casual matches

Map variance is generated per match but both players see the same battlefield.

---

## Match Lobby

Once a match is created and both players have joined, they enter a **match lobby**.

### What Happens in the Lobby

- **Build armies** — May be time-intensive; progress can be saved
- **Load saved armies** — Use pre-built setups for faster preparation
- **Exchange messages** — Chat with opponent during setup

### Messaging

Players can write messages to each other in the lobby:
- Casual conversation
- Coordination ("I'll submit tonight")
- Commentary on the match or previous games
- Messages persist with the match record

Messaging exists because army building can take time, and players may want to communicate even if they're building asynchronously.

### Lobby Duration

No fixed time limit in the lobby—the submission timeout (configured at match creation) applies to the overall submission deadline, not lobby activity.

---

## Army Submission

### The Submission Phase

Players complete all preparation in a **single phase**:
1. **Build army** — Select squads, heroes, items, upgrades within budget
2. **Place units** — Position squads in deployment zone
3. **Script orders** — Configure squad scripts, write army-level orders for LLM Commander
4. **Submit** — Lock and send to server

Once submitted, the army cannot be modified.

### What Gets Submitted

- Complete army roster (including upgrades, items, gems)
- Unit positions in deployment zone
- Squad scripts (stance, target priority, hero scripts)
- Army-level orders (natural language for Commander)
- Commander enabled/disabled flag

### Validation

Server validates the submission:
- Total cost ≤ point budget
- All units legal for faction
- No duplicate unique units
- Valid item assignments
- Valid deployment positions

Invalid submissions are rejected with error details.

### Future Consideration

May split into separate phases:
1. Army building (submit army composition)
2. Placement and scripting (after seeing opponent's faction)

This would add strategic depth but increases match duration. Starting with single phase for simplicity.

---

## Waiting State

After submission, the player waits for their opponent to submit.

**This is truly async:**
- No lobby to sit in
- No "opponent is typing..." indicators
- Player can close the game entirely

**While waiting, players can:**
- Play other multiplayer matches
- Play single-player
- Do anything else—it's async

The game tracks pending matches in the background.

---

## Battle Resolution

When **both players have submitted**:

1. Server retrieves both armies and configurations
2. Battle resolver runs the simulation
3. Event log is generated
4. Result is determined (winner or draw)
5. Both players are notified

Resolution happens on the server. Players don't need to be online.

### LLM Commander

If either player has Commander enabled, the server handles LLM calls during resolution. Players don't need to provide API keys—the game absorbs LLM cost.

---

## Result Delivery

### Notification

Both players receive notification that the battle is complete:
- **In-game notification** — If the game is running
- **Email notification** — Optional, for truly async players
- **Push notification** — If mobile companion app exists (future)

There's no expectation of immediate resolution given the async nature. Could be minutes (friendly match, both online) or days (casual match).

### Viewing Results

Players can:
- **Watch the replay** — See the battle unfold with full controls
- **Skip to result** — Just see who won and final stats
- **Watch later** — Result is stored, replay available anytime

The suspense of watching what happens is part of the draw, but players aren't forced to sit through replays.

---

## Timeouts & Forfeits

### Submission Timeout

If a player doesn't submit within the configured timeout:
- Match is forfeited
- Opponent wins by default
- No battle occurs (no replay)

### Why This Matters

Without ranking, forfeits are low-stakes. But they:
- Free up the opponent from waiting indefinitely
- Allow match cleanup
- May matter more when ranked play is added

### Timeout Configuration

Match creator sets the timeout. Examples:
- **Quick match:** 15 minutes
- **Standard:** 24 hours
- **Casual:** 7 days

Players joining hosted games see the timeout before joining.

---

## Rematch Flow

After a match completes, either player can propose a rematch:
- Same configuration (point budget, timeout, map type)
- Both players start fresh army building
- Quick path back into another game

Useful for:
- "Best of 3" with a friend
- Trying a different strategy against the same opponent
- Immediate revenge attempts

---

## Match History

Players can view their match history:
- Past opponents
- Results (win/loss/draw/forfeit)
- Point budget
- Date
- Link to replay (if available)

Replays are stored for some retention period (TBD).

### Statistics

Basic stats tracked:
- Wins / Losses / Draws
- Win rate
- Matches by point budget tier
- Most-played faction

More detailed statistics may be added later.

---

## Spectating

Players can watch matches involving their friends.

### Friend Games

- View friends' ongoing matches (after resolution)
- Watch replays of friends' completed matches
- Browse friends' match history

### Replay Sharing

- Share replay links with others
- Watch shared replays even if not friends with the players

### Privacy Considerations

- Players may control visibility of their matches (public, friends-only, private)
- Default settings TBD

---

## Army Setup Saves

Army configurations can be **saved and loaded**:
- Save a complete army setup (roster, items, upgrades)
- Load and modify for new matches
- Maintain a library of army builds

Saves include:
- Army composition
- All upgrades and items
- **Do not include:** placement, scripts (these are per-match)

Useful for:
- Quickly fielding a favorite army
- Iterating on builds across matches
- Sharing builds (export/import—future feature)

---

## Single-Player Flow

### Online Single-Player

Playing against AI opponents while connected to the server.

**Flow:**
1. Select AI opponent (preset difficulty/style)
2. Configure point budget
3. Build, place, script army
4. Submit
5. Server resolves immediately (no waiting—AI army is generated)
6. Watch replay

**Benefits:**
- LLM Commander available (server-side)
- Same experience as multiplayer
- Good for practice

**AI Opponent Selection:**
- Preset armies with varying difficulty
- Different AI behaviors (aggressive, defensive, magic-heavy)
- Details TBD

### Same-Player Both Sides

A player can control **both armies** in a match:
- Build and submit army A
- Build and submit army B
- Watch them fight

**Use cases:**
- Experimentation ("how does this army fare against that one?")
- Hotseat multiplayer (two players, one computer, take turns)
- Testing strategies
- Content creation (showcase battles)

Works online (with Commander) or offline.

### Offline Single-Player

Playing without server connection.

**Flow:**
1. Select AI opponent
2. Build, place, script army
3. Battle resolves locally
4. Watch replay

**Limitations:**
- **No LLM Commander** — Local hardware unlikely to support it
- AI uses scripted behavior only (no adaptive Commander decisions)
- Less dynamic battles

**Benefits:**
- No internet required
- Quick iteration for testing army configs
- Always available

Offline mode is simpler but useful for practice and experimentation.

---

## Open Questions

1. **Notification preferences:** Granularity of notification settings?
2. **Match abandonment:** What happens to matches if a player deletes their account?
3. **Concurrent match limit:** Maximum simultaneous matches per player?
4. **AI opponent variety:** How many presets for v1?
5. **Match privacy defaults:** Public, friends-only, or private by default?

---

## References

- `04_army_building.md` — Point budgets, army composition
- `05_scripting_and_orders.md` — Squad scripts, army-level orders
- `06_llm_commander.md` — Commander behavior during resolution
- `08_replay_system.md` — Replay format and controls
