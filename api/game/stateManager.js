import gameState from "./gameState.js";

const actionPermissions = {
    attack: ["InTurn", "BossFight"],
    defend: ["InTurn", "BossFight"],
    heal: ["InTurn", "BossFight"],
    join: ["Lobby"],
    start_game: ["Lobby"],
};

export function isActionAllowed(action) {
    const allowed = actionPermissions[action];
    return allowed ? allowed.includes(gameState.status) : false;
}