import gameState from "../models/GameState.js";
import { ParticipantActions } from "../models/Participant.js";
import { GamePhase } from "../types/GamePhase.js";
import { createDefaultLobby, WaitDuration } from "../models/Lobby.js";
import { createDefaultDungeon } from "../models/Dungeon.js";
import { participantDefaultStats } from "../models/Participant.js";
import { broadcast } from "../../api/Server.js";
import { startGame } from "./GameController.js";
export function openLobby() {
    gameState.status = GamePhase.Lobby;
    gameState.lobby = createDefaultLobby();
    gameState.dungeon = createDefaultDungeon();
    gameState.rounds = [];
    gameState.log.push("🔓 Lobby opened. Players can join.");
    console.log("🔓 Lobby opened. Players can join.");
    broadcast({ gameState });
    console.log(`⏳ Game will begin in ${gameState.lobby.waitTime} seconds.`);
    const interval = setInterval(() => {
        if (typeof gameState.lobby.waitTime === "number") {
            gameState.lobby.waitTime--;
            broadcast({ gameState });
            if (gameState.lobby.waitTime <= 0) {
                clearInterval(interval);
                gameState.lobby.waitTime = WaitDuration.Pause;
                startGame();
            }
        }
    }, 1000);
}
export function handlePlayerJoin(username, className) {
    if (gameState.status !== GamePhase.Lobby)
        return;
    if (gameState.lobby.players[username])
        return;
    const baseStats = participantDefaultStats[className];
    if (!baseStats)
        return;
    gameState.lobby.players[username] = {
        name: username,
        class: className,
        stats: { ...baseStats },
        lastAction: ParticipantActions.Idle,
    };
    gameState.log.push(`✅ ${username} joined as ${className}`);
    broadcast({ gameState });
}
export function handlePlayerLeave(username) {
    if (!gameState.lobby.players[username])
        return;
    delete gameState.lobby.players[username];
    gameState.log.push(`${username} left the lobby.`);
    broadcast({ gameState });
}
