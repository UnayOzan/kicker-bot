import { broadcast } from "../../api/Server.js";
import gameState from "../models/GameState.js";
import { ActionCommands } from "../types/Commands.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions } from "../models/Participant.js";
import { eventBus } from "../misc/EventBus.js";
function resolveActionCommand(input) {
    switch (input) {
        case ActionCommands.Attack:
            return ParticipantActions.Attack;
        case ActionCommands.Defend:
            return ParticipantActions.Defend;
        case ActionCommands.Heal:
            return ParticipantActions.Heal;
        default:
            return undefined;
    }
}
export function prepareActionListener() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;
        const [cmd] = content.trim().split(" ");
        const action = resolveActionCommand(cmd);
        if (!action)
            return;
        if (gameState.status !== GamePhase.InTurn)
            return;
        const playerPair = gameState.getCurrentRound()?.pairs[username];
        if (playerPair) {
            playerPair.player.lastAction = action;
            gameState.log.push(`${username} queued action: ${action}`);
            broadcast({ gameState });
        }
    });
}
