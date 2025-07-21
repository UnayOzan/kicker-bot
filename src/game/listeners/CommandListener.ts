import { broadcast } from "../../api/Server.js";
import gameState from "../models/GameState.js";
import { Commands } from "../types/Commands.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions, ParticipantClasses } from "../models/Participant.js";
import { handlePlayerJoin, handlePlayerLeave, openLobby } from "../controllers/LobbyController.js";
import { eventBus } from "../misc/EventBus.js";

// Komutları ve emote'ları ana komutlara yönlendiren yardımcı fonksiyon
function resolveCommand(input: string): string | undefined {
    switch (input) {
        case Commands.Start:
            return Commands.Start;
        case Commands.Join:
            return Commands.Join;
        case Commands.Leave:
            return Commands.Leave;
        case Commands.Attack:
        case Commands.AttackEmote:
            return "attack";
        case Commands.Defend:
        case Commands.DefendEmote:
            return "defend";
        case Commands.Heal:
        case Commands.HealEmote:
            return "heal";
        case Commands.Stats:
            return Commands.Stats;
        case Commands.Players:
            return Commands.Players;
        case Commands.Help:
            return Commands.Help;
        case Commands.ArcherEmote:
        case Commands.DefenderEmote:
        case Commands.HealerEmote:
            return Commands.Join; // veya başka bir ana komut
        default:
            return undefined;
    }
}

// Emote'dan className çözen yardımcı fonksiyon
function resolveClassFromEmote(emote: string): string | undefined {
    switch (emote) {
        case Commands.ArcherEmote:
            return "archer";
        case Commands.DefenderEmote:
            return "defender";
        case Commands.HealerEmote:
            return "healer";
        default:
            return undefined;
    }
}

export function prepareRPG(): void {
    eventBus.subscribe("chat_message", (data: any) => {
        const { content } = data;
        const { username } = data.sender;

        const [cmd, ...args] = content.trim().split(" ");
        const command = resolveCommand(cmd);

        console.log(`command: ${command}`);

        switch (command) {
            case Commands.Start:
                if (gameState.status === GamePhase.Idle) {
                    openLobby();
                }
                break;

            case Commands.Join:
                if (gameState.status === GamePhase.Lobby) {
                    let classNameInput = args[0]?.toLowerCase();
                    if (classNameInput) {
                        const classFromEmote = resolveClassFromEmote(args[0]);
                        if (classFromEmote) {
                            classNameInput = classFromEmote;
                        }
                    } else {
                        const classFromEmote = resolveClassFromEmote(cmd);
                        if (classFromEmote) {
                            classNameInput = classFromEmote;
                        }
                    }
                    const validClasses = Object.values(ParticipantClasses);

                    if (!classNameInput || !validClasses.includes(classNameInput as ParticipantClasses)) {
                        broadcast({ type: "error", message: "Invalid class." });
                        return;
                    }

                    handlePlayerJoin(username, classNameInput as ParticipantClasses);
                }
                break;

            case Commands.Leave:
                handlePlayerLeave(username);
                break;

            case "attack":
            case "defend":
            case "heal":
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
                broadcast({ type: "error", message: `Unknown command: ${cmd}` });
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
