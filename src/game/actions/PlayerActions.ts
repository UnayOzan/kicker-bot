
import gameState from "../models/GameState.js";
import { Participant, ParticipantActions } from "../models/Participant.js";
import { broadcast } from "../../api/Server.js";

type ActionResult = { success: true } | { error: string };

export function handleAttack(username: string): ActionResult {
    return handleAction(username, ParticipantActions.Attack);
}

export function handleDefend(username: string): ActionResult {
    return handleAction(username, ParticipantActions.Defend);
}

export function handleHeal(username: string): ActionResult {
    return handleAction(username, ParticipantActions.Heal);
}

function handleAction(username: string, action: ParticipantActions): ActionResult {
    const player = gameState.lobby.players[username];
    if (!player) return { error: "Oyuna dahil değilsin." };

    const currentRound = gameState.getCurrentRound();
    if (!currentRound) return { error: "Tur aktif değil." };

    currentRound.pairs[username].player.lastAction = action;
    gameState.log.push(`${username} sonraki aksiyonunu seçti; ${action}`);

    broadcast({ gameState });

    return { success: true };
}

export function handleStats(username: string): { stats: typeof gameState.lobby.players[string]["stats"] } | { error: string } {
    const player = gameState.lobby.players[username];
    if (!player) return { error: "Karakter bulunamadı." };

    return { stats: player.stats };
}

export function handlePlayers(): { players: Participant[] } {
    return { players: Object.values(gameState.lobby.players), };
}

export function handleHelp(): { commands: string[] } {
    return {
        commands: [
            "!join <healer-warrior-archer> - Yaz oyuna katıl.",
            "!attack - Saldırmayı seç",
            "!defend - Savunmayı seç",
            "!heal - Can bas",
            "!stats - Karakter özelliklerini gör",
            "!players - Oyundaki oyuncuları gör",
            "!leave - Oyundan ayrıl",
            "!help - Yardım mesajını görüntüle"
        ]
    };
}
