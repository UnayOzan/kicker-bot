import { broadcast } from "../../api/Server.js";
import gameState from "../models/GameState.js";
import { Commands } from "../types/Commands.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions, ParticipantClasses } from "../models/Participant.js";
import { handlePlayerJoin, handlePlayerLeave, openLobby } from "../controllers/LobbyController.js";
import { eventBus } from "../misc/EventBus.js";

export function prepareRPG(): void {
    eventBus.subscribe("chat_message", (data: any) => {
        const { content } = data;
        const { username } = data.sender;

        const [cmd, ...args] = content.trim().split(" ");
        const command = cmd.toLowerCase();

        switch (command) {
            case Commands.Start:
                if (gameState.status === GamePhase.Idle) {
                    openLobby();
                }
                break;

            case Commands.Join:
                if (gameState.status === GamePhase.Lobby) {
                    const classNameInput = args[0]?.toLowerCase();
                    const validClasses = Object.values(ParticipantClasses);

                    if (!validClasses.includes(classNameInput as ParticipantClasses)) {
                        broadcast({ type: "error", message: "Invalid class." });
                        return;
                    }

                    handlePlayerJoin(username, classNameInput as ParticipantClasses);
                }
                break;

            case Commands.Leave:
                handlePlayerLeave(username);
                break;

            case Commands.Attack:
            case Commands.Defend:
            case Commands.Heal:
                queuePlayerAction(username, command.substring(1) as ParticipantActions);
                break;

            case Commands.Stats:
                showStats(username);
                break;

            case Commands.Players:
                showPlayers();
                break;

            case Commands.Help:
                showHelp();
                break;
            default:
                broadcast({ type: "error", message: `Unknown command: ${command}` });
                break;
        }
    });
}

function queuePlayerAction(username: string, action: ParticipantActions): void {
    if (gameState.status !== GamePhase.InTurn) return;

    const currentRound = gameState.getCurrentRound();
    if (!currentRound) return;

    const playerPair = currentRound.pairs[username];
    if (!playerPair) return;

    playerPair.player.lastAction = action;
    gameState.log.push(`${username} queued action: ${action}`);

    broadcast({ gameState });
}

function showStats(username: string): void {
    const player = gameState.lobby.players[username];
    if (!player) return;

    const stats = player.stats;
    broadcast({ type: "stats", username, stats });
}

function showPlayers(): void {
    const players = Object.values(gameState.lobby.players).map(p => `${p.name} (${p.class})`);
    broadcast({ type: "players", players });
}

function showHelp(): void {
    const commands = Object.values(Commands);
    broadcast({ type: "help", commands });
}
