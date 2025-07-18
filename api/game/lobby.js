import { broadcast } from "../server.js";
import gameState from "./gameState.js";
import { playerClasses } from "./playerManager.js";
import { startGame } from "./game.js";

export function openLobby() {
    gameState.status = "Lobby";
    gameState.lobby.createdAt = Date.now();
    gameState.lobby.players = {};
    gameState.round = {};
    gameState.log.push("🔓 Lobby opened. Players can join.");

    console.log(`🔓 Lobby opened. Players can join.`);
    broadcast({ gameState });

    console.log(`🔓 Game will begin in 10 seconds.`);
    setTimeout(() => startGame(), 10 * 1000);
}

export function handleJoin(username, className) {
    if (gameState.status !== "Lobby") return { error: "Lobby is not open." };
    if (gameState.lobby.players[username]) return { error: "Already joined." };

    const baseStats = playerClasses[className];
    if (!baseStats) return { error: "Invalid class." };

    gameState.lobby.players[username] = {
        name: username,
        class: className,
        stats: { ...baseStats },
        lastAction: "Idle",
    };

    gameState.stats.totalPlayersJoined++;
    gameState.log.push(`✅ ${username} joined as ${className}`);
    broadcast({ gameState });

    return { success: true };
}

export function handleLeave(username) {
    if (!gameState.lobby.players[username]) return { error: "You are not in the lobby." };

    delete gameState.lobby.players[username];
    gameState.log.push(`${username} left the lobby.`);
    broadcast({ gameState });

    return { success: true };
}