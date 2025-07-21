import { broadcast } from "../../api/Server.js";
import gameState from "../models/GameState.js";
import { EmoteCommands } from "../types/Commands.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions, ParticipantClasses } from "../models/Participant.js";
import { handlePlayerJoin } from "../controllers/LobbyController.js";
import { eventBus } from "../misc/EventBus.js";
function resolveEmoteCommand(input) {
    switch (input) {
        case EmoteCommands.AttackEmote:
            return { type: 'action', value: ParticipantActions.Attack };
        case EmoteCommands.DefendEmote:
            return { type: 'action', value: ParticipantActions.Defend };
        case EmoteCommands.HealEmote:
            return { type: 'action', value: ParticipantActions.Heal };
        case EmoteCommands.ArcherEmote:
            return { type: 'join', value: ParticipantClasses.Archer };
        case EmoteCommands.DefenderEmote:
            return { type: 'join', value: ParticipantClasses.Defender };
        case EmoteCommands.HealerEmote:
            return { type: 'join', value: ParticipantClasses.Healer };
        default:
            return undefined;
    }
}
export function prepareEmoteCommandListener() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;
        const [cmd] = content.trim().split(" ");
        const emoteCmd = resolveEmoteCommand(cmd);
        if (!emoteCmd)
            return;
        if (emoteCmd.type === 'action') {
            if (gameState.status !== GamePhase.InTurn)
                return;
            const playerPair = gameState.getCurrentRound()?.pairs[username];
            if (playerPair) {
                playerPair.player.lastAction = emoteCmd.value;
                gameState.log.push(`${username} queued action: ${emoteCmd.value}`);
                broadcast({ gameState });
            }
        }
        else if (emoteCmd.type === 'join') {
            if (gameState.status !== GamePhase.Lobby)
                return;
            handlePlayerJoin(username, emoteCmd.value);
        }
    });
}
