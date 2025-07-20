import gameState from "../models/GameState.js";
import simulateBattleTurn from "../utils/BattleSimulator.js";
import { broadcast } from "../../api/Server.js";
import { enemies } from "../data/Enemies.js";
import { GamePhase } from "../types/GamePhase.js";
import { ParticipantActions } from "../models/Participant.js";
export function startGame() {
    gameState.recreate();
    startTurn();
}
export function startTurn() {
    gameState.status = GamePhase.InTurn;
    const newRound = {
        turn: gameState.rounds.length + 1,
        waitTime: 10,
        isBossFight: false,
        pairs: {},
        log: []
    };
    for (const [username, player] of Object.entries(gameState.lobby.players)) {
        const randomEnemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
        const actions = Object.values(ParticipantActions);
        const randomIndex = Math.floor(Math.random() * actions.length);
        randomEnemy.lastAction = actions[randomIndex];
        const pair = {
            id: newRound.turn,
            player,
            enemy: randomEnemy
        };
        newRound.pairs[username] = pair;
        player.lastAction = ParticipantActions.Idle;
    }
    gameState.rounds.push(newRound);
    gameState.log.push(`🔄 Turn ${newRound.turn} started.`);
    broadcast({ gameState });
    console.log(`🔓 Turn will resolve in ${newRound.waitTime} seconds.`);
    setTimeout(() => resolveTurn(), newRound.waitTime * 1000);
}
export function resolveTurn() {
    gameState.status = GamePhase.Processing;
    const currentRound = gameState.getCurrentRound();
    if (!currentRound)
        return;
    const results = [];
    for (const [username, pair] of Object.entries(currentRound.pairs)) {
        const player = pair.player;
        const enemy = pair.enemy;
        if (!enemy)
            continue;
        const outcome = simulateBattleTurn(player, enemy);
        outcome.logs.forEach(log => results.push(log));
        if (outcome.enemyDead) {
            pair.enemy = null;
        }
        if (outcome.playerDead) {
            delete gameState.lobby.players[username];
        }
    }
    results.forEach(line => console.log(line));
    gameState.log.push(...results);
    if (Object.keys(gameState.lobby.players).length === 0) {
        finishGame();
    }
    else {
        startTurn();
    }
    broadcast({ gameState });
}
export function finishGame() {
    gameState.status = GamePhase.Finished;
    gameState.log.push("🏁 Game has ended. Thanks for playing!");
    console.log("🏁 Game over.");
    broadcast({ gameState });
}
