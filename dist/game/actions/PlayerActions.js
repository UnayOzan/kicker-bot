import gameState from "../models/GameState.js";
import { ParticipantActions } from "../models/Participant.js";
import { broadcast } from "../../api/Server.js";
export function handleAttack(username) {
    return handleAction(username, ParticipantActions.Attack);
}
export function handleDefend(username) {
    return handleAction(username, ParticipantActions.Defend);
}
export function handleHeal(username) {
    return handleAction(username, ParticipantActions.Heal);
}
function handleAction(username, action) {
    const player = gameState.lobby.players[username];
    if (!player)
        return { error: "Oyuna dahil değilsin." };
    const currentRound = gameState.getCurrentRound();
    if (!currentRound)
        return { error: "Tur aktif değil." };
    currentRound.pairs[username].player.lastAction = action;
    gameState.log.push(`${username} sonraki aksiyonunu seçti; ${action}`);
    broadcast({ gameState });
    return { success: true };
}
export function handleStats(username) {
    const player = gameState.lobby.players[username];
    if (!player)
        return { error: "Karakter bulunamadı." };
    return { stats: player.stats };
}
export function handlePlayers() {
    return { players: Object.values(gameState.lobby.players), };
}
export function handleHelp() {
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
