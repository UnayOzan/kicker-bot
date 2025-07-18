import { broadcast } from "../server.js";
import gameState from "./gameState.js";
import { isActionAllowed } from "./stateManager.js";

export function handleAttack(username) {
    return handleAction(username, "attack");
}

export function handleDefend(username) {
    return handleAction(username, "defend");
}

export function handleHeal(username) {
    return handleAction(username, "heal");
}

function handleAction(username, action) {
    if (!isActionAllowed(action)) return { error: "Cannot perform action now." };

    const player = gameState.lobby.players[username];
    if (!player) return { error: "You are not in the game." };

    gameState.round.actions[username] = action;
    player.lastAction = action;

    gameState.log.push(`${username} chose to ${action}`);
    broadcast({ gameState });

    return { success: true };
}

export function handleStats(username) {
    const player = gameState.lobby.players[username];
    if (!player) return { error: "No character found." };

    const stats = player.stats;
    return { stats };
}

export function handlePlayers() {
    const list = Object.entries(gameState.lobby.players).map(([name, player]) => {
        return `${name} (${player.class})`;
    });

    return { players: list };
}

export function handleHelp() {
    return {
        commands: [
            "!join <class> - Join the game",
            "!start - Ready up",
            "!attack - Attack the enemy",
            "!defend - Defend against attacks",
            "!heal - Heal yourself",
            "!stats - Show your stats",
            "!players - Show current players",
            "!leave - Leave the game",
            "!help - Show this help message"
        ]
    };
}
