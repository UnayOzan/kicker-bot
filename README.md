# Kickable Bot RPG - Game Flow & Documentation

## Game Flow Overview

1. **Game Start**: The game begins when a user issues the `!startrpg` command. This opens the lobby.
2. **Lobby Phase**: Players join the lobby using `!join <class>`, choosing a class (archer, healer, defender). The lobby waits for a set time before starting.
3. **Game Phase**: The game progresses in rounds. Each round, players are paired with random enemies and choose actions (`!attack`, `!defend`, `!heal`).
4. **Battle Resolution**: After a short wait, all actions are resolved, and results are broadcast. Players or enemies may be eliminated.
5. **Game End**: The game ends when all players are defeated or the dungeon is cleared.

---

## Main Classes & Interfaces

### Models
- **GameState**: Holds the current state of the game, including phase, lobby, rounds, dungeon, and logs.
  - `recreate()`: Resets the game state.
  - `getCurrentRound()`: Returns the current round or null.
- **Lobby**: Represents the game lobby, containing players, creation time, and wait time.
  - `createDefaultLobby()`: Returns a new, empty lobby.
- **Participant**: Represents a player or enemy with a name, class, stats, and last action.
- **ParticipantStats**: Holds HP, attack, and defense values.
- **Round**: Represents a single round, including turn number, wait time, boss flag, player-enemy pairs, and logs.
- **RoundPair**: A pairing of a player and an enemy for a round.
- **Dungeon**: Represents dungeon settings (round count, difficulty, biome).
  - `createDefaultDungeon()`: Returns a default dungeon setup.

### Controllers
- **LobbyController**
  - `openLobby()`: Opens the lobby and starts the countdown to game start.
  - `handlePlayerJoin(username, className)`: Adds a player to the lobby with the chosen class.
  - `handlePlayerLeave(username)`: Removes a player from the lobby.
- **GameController**
  - `startGame()`: Begins the game and starts the first turn.
  - `startTurn()`: Starts a new round, pairs players with enemies, and broadcasts the state.
  - `resolveTurn()`: Resolves all actions for the round, updates HP, and checks for game end.
  - `finishGame()`: Ends the game and broadcasts the result.

### Listeners & Utilities
- **CommandListener**
  - `prepareRPG()`: Listens for chat commands and routes them to the appropriate handlers.
  - `resolveCommand(input)`: Maps input strings/emotes to commands.
  - `resolveClassFromEmote(emote)`: Maps emotes to class names.
- **BattleSimulator**
  - `simulateBattleTurn(player, enemy)`: Simulates a battle turn and returns the result.
- **Permissions**
  - `isActionAllowed(action)`: Checks if an action is allowed in the current game phase.
- **EventBus**
  - `subscribe(event, callback)`: Subscribes to an event.
  - `unsubscribe(event, callback)`: Unsubscribes from an event.
  - `emit(event, data)`: Emits an event to all listeners.

---

## Player Classes
- **Archer**: Balanced stats, ranged attacks.
- **Healer**: Can heal, lower HP and attack.
- **Defender**: High defense and HP, lower attack.

## Enemy Types
- Orc Savaşçı (Defender)
- Orc Okçu (Archer)
- Orc Şaman (Healer)
- Orc Dev (Defender)

---

## Commands
| Command | Description |
|---------|-------------|
| `!startrpg` | Start a new RPG game (opens the lobby) |
| `!join <class>` | Join the lobby as a class (archer, healer, defender) |
| `!leave` | Leave the lobby or game |
| `!attack` | Queue an attack action for the next round |
| `!defend` | Queue a defend action for the next round |
| `!heal` | Queue a heal action for the next round |
| `!stats` | Show your character's stats |
| `!players` | List all players in the current game |
| `!help` | Show help message and available commands |

Emotes can also be used for actions and class selection.

---

## Lobby System
- The lobby is opened with `!startrpg` and remains open for a countdown period.
- Players join with `!join <class>`. Each player must choose a class.
- When the countdown ends, the game starts automatically.
- Players can leave the lobby/game with `!leave`.
- The lobby tracks all joined players and their chosen classes.

---

## Game Phases
- **Idle**: Waiting for a game to start.
- **Lobby**: Players can join; countdown to start.
- **InTurn**: Players select actions for the round.
- **Processing**: Actions are resolved and results are broadcast.
- **BossFight**: (Future) Special boss round.
- **Finished**: Game has ended.

---

## Development
- Restart TypeScript: `npx tsc`
- Start locally: `node dist/index.js`