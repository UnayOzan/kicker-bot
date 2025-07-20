import gameState from "../models/GameState.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions } from "../models/Participant.js";

const actionPermissions: Record<ParticipantActions, GamePhase[]> = {
    attack: [GamePhase.InTurn, GamePhase.BossFight],
    defend: [GamePhase.InTurn, GamePhase.BossFight],
    heal: [GamePhase.InTurn, GamePhase.BossFight],
    [ParticipantActions.Idle]: []
};

export function isActionAllowed(action: ParticipantActions): boolean {
    const allowed = actionPermissions[action];
    return allowed ? allowed.includes(gameState.status) : false;
}