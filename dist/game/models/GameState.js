import { GamePhase } from "../types/GamePhase.js";
import { createDefaultDungeon } from "./Dungeon.js";
import { createDefaultLobby } from "./Lobby.js";
export class GameState {
    constructor() {
        this.status = GamePhase.Idle;
        this.lobby = createDefaultLobby();
        this.dungeon = createDefaultDungeon();
        this.rounds = [];
        this.log = [];
    }
    recreate() {
        this.status = GamePhase.Idle;
        this.lobby = createDefaultLobby();
        this.dungeon = createDefaultDungeon();
        this.rounds = [];
        this.log = [];
    }
    getCurrentRound() {
        return this.rounds.length > 0 ? this.rounds[this.rounds.length - 1] : null;
    }
}
const gameState = new GameState();
export default gameState;
