import { broadcast } from "../../api/Server.js";
import gameState from "../models/GameState.js";
import { GameControlCommands, InfoCommands } from "../types/Commands.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantClasses } from "../models/Participant.js";
import { handlePlayerJoin, handlePlayerLeave, openLobby } from "../controllers/LobbyController.js";
import { eventBus } from "../misc/EventBus.js";
export function prepareCommandListener() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;
        const [cmd, ...args] = content.trim().split(" ");
        switch (cmd) {
            case GameControlCommands.Start:
                if (gameState.status === GamePhase.Idle) {
                    openLobby();
                }
                break;
            case GameControlCommands.Join:
                if (gameState.status === GamePhase.Lobby) {
                    let classNameInput = args[0]?.toLowerCase();
                    const validClasses = Object.values(ParticipantClasses);
                    if (!classNameInput || !validClasses.includes(classNameInput)) {
                        broadcast({ type: "error", message: "Invalid class." });
                        return;
                    }
                    handlePlayerJoin(username, classNameInput);
                }
                break;
            case GameControlCommands.Leave:
                handlePlayerLeave(username);
                break;
            case InfoCommands.Stats:
                showStats(username);
                break;
            case InfoCommands.Players:
                showPlayers();
                break;
            case InfoCommands.Help:
                showHelp();
                break;
            default:
                // Not a normal command, do nothing
                break;
        }
    });
}
function showStats(username) {
    const player = gameState.lobby.players[username];
    if (!player)
        return;
    const stats = player.stats;
    broadcast({ type: "stats", username, stats });
}
function showPlayers() {
    const players = Object.values(gameState.lobby.players).map(p => `${p.name} (${p.class})`);
    broadcast({ type: "players", players });
}
function showHelp() {
    const commands = [
        ...Object.values(GameControlCommands),
        ...Object.values(InfoCommands)
    ];
    broadcast({ type: "help", commands });
}
