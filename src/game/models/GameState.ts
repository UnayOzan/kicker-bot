import { Round } from "./Round.js";
import { GamePhase } from "../types/GamePhase.js";
import { Dungeon, createDefaultDungeon } from "./Dungeon.js";
import { createDefaultLobby, Lobby } from "./Lobby.js";

export class GameState {
    status: GamePhase;
    lobby: Lobby;
    rounds: Round[];
    dungeon: Dungeon;
    log: string[];

    constructor() {
        this.status = GamePhase.Idle;
        this.lobby = createDefaultLobby();
        this.dungeon = createDefaultDungeon();
        this.rounds = [];
        this.log = [];
    }

    recreate(): void {
        this.status = GamePhase.Idle;
        this.lobby = createDefaultLobby();
        this.dungeon = createDefaultDungeon();
        this.rounds = [];
        this.log = [];
    }

    getCurrentRound(): Round | null {
        return this.rounds.length > 0 ? this.rounds[this.rounds.length - 1] : null;
    }
}


const gameState = new GameState();

export default gameState;