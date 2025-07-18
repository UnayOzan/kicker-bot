import { broadcast } from "../server.js";
import { enemies } from "./enemyManager.js";
import gameState from "./gameState.js";
import simulateBattleTurn from "./battleSimulator.js";

export function startGame() {
    gameState.status = "InTurn";

    gameState.dungeon.floor = 1;
    gameState.dungeon.boss = null;

    gameState.round.turn = 1;
    gameState.round.startTimestamp = Date.now();
    gameState.round.actions = {};
    gameState.round.enemies = {};

    gameState.log = [];

    for (const [username, player] of Object.entries(gameState.lobby.players)) {
        const randomEnemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
        gameState.round.enemies[username] = randomEnemy;
        player.lastAction = "Idle";
    }

    gameState.log.push(`🗺️ Dungeon Floor ${gameState.dungeon.floor} started!`);
    broadcast({ gameState });

    console.log(`🔓 Turn will resolve in 10 seconds.`);
    setTimeout(() => resolveTurn(), 10 * 1000);
}

export function startTurn() {
    gameState.status = "InTurn";

    gameState.round.turn++;
    gameState.round.startTimestamp = Date.now();
    gameState.round.actions = {};

    for (const [username, player] of Object.entries(gameState.lobby.players)) {
        const randomEnemy = { ...enemies[Math.floor(Math.random() * enemies.length)] };
        gameState.round.enemies[username] = randomEnemy;
        player.lastAction = "Idle";
    }

    gameState.stats.totalRoundsPlayed++;
    gameState.log.push(`🔄 Turn ${gameState.round.turn} started.`);
    broadcast({ gameState });

    console.log(`🔓 Turn will resolve in 10 seconds.`);
    setTimeout(() => resolveTurn(), 10 * 1000);
}

export function resolveTurn() {
    gameState.status = "Processing";

    const results = [];

    for (const [username, player] of Object.entries(gameState.lobby.players)) {
        const enemy = gameState.round.enemies[username];
        if (!enemy) continue;

        const action = gameState.round.actions[username] || "attack";

        const outcome = simulateBattleTurn(player, enemy, action);

        // Aksiyon bazlı detaylı loglar
        outcome.logs.forEach(log => results.push(log));

        if (outcome.enemyDead) {
            gameState.round.enemies[username] = null;
        }

        if (outcome.playerDead) {
            delete gameState.lobby.players[username];
        }
    }

    results.forEach(line => console.log(line));
    gameState.log.push(...results);

    if (Object.keys(gameState.lobby.players).length === 0) {
        finishGame();
    } else {
        startTurn();
    }

    broadcast({ gameState });
}

export function finishGame() {
    gameState.status = "Finished";
    gameState.log.push("🏁 Game has ended. Thanks for playing!");

    console.log("🏁 Game over.");
    broadcast({ gameState });
}
