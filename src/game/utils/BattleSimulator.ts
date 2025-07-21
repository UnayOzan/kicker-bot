import { Participant, ParticipantActions } from "../models/Participant.js";

type Result = "player-win" | "player-lose" | "draw";

const beats: Record<ParticipantActions, ParticipantActions> = {
  [ParticipantActions.Attack]: ParticipantActions.Heal,
  [ParticipantActions.Defend]: ParticipantActions.Attack,
  [ParticipantActions.Heal]: ParticipantActions.Defend,
  [ParticipantActions.Idle]: ParticipantActions.Idle,
};

function getResult(playerAction: ParticipantActions, enemyAction: ParticipantActions): Result {
    if (playerAction === enemyAction) return "draw";
    if (beats[playerAction] === enemyAction) return "player-win";
    return "player-lose";
}

interface BattleResult {
    playerDamage: number;
    enemyDamage: number;
    playerDead: boolean;
    enemyDead: boolean;
    logs: string[];
}

function simulateBattleTurn(player: Participant, enemy: Participant): BattleResult {
    const minDamage = 5;
    const logs: string[] = [];

    const playerAction = player.lastAction || ParticipantActions.Idle;
    const enemyAction = enemy.lastAction || ParticipantActions.Idle;

    let playerDamage = 0;
    let enemyDamage = 0;

    let summaryLog = `${player.name} chose **${playerAction}**, ${enemy.name} chose **${enemyAction}**. `;

    if (playerAction === ParticipantActions.Idle) {
        playerDamage = minDamage;
        player.stats.hp -= playerDamage;
        summaryLog += `${player.name} did nothing and took ${playerDamage} damage.`;
    } else {
        const result = getResult(playerAction, enemyAction);

        if (result === "player-win") {
            enemyDamage = minDamage;
            enemy.stats.hp -= enemyDamage;
            summaryLog += `${player.name} dealt ${enemyDamage} damage.`;
        } else if (result === "player-lose") {
            playerDamage = minDamage;
            player.stats.hp -= playerDamage;
            summaryLog += `${enemy.name} dealt ${playerDamage} damage to ${player.name}.`;
        } else {
            playerDamage = enemyDamage = minDamage;
            player.stats.hp -= playerDamage;
            enemy.stats.hp -= enemyDamage;
            summaryLog += `Both dealt ${minDamage} damage.`;
        }
    }

    if (player.stats.hp < 0) player.stats.hp = 0;
    if (enemy.stats.hp < 0) enemy.stats.hp = 0;

    if (player.stats.hp === 0) summaryLog += ` ${player.name} has fallen!`;
    if (enemy.stats.hp === 0) summaryLog += ` ${enemy.name} is defeated!`;

    logs.push(summaryLog);

    return {
        playerDamage,
        enemyDamage,
        playerDead: player.stats.hp === 0,
        enemyDead: enemy.stats.hp === 0,
        logs,
    };
}

export default simulateBattleTurn;
