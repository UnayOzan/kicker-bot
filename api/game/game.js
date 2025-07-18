
import { broadcast } from "../server.js";

export const players = {};

export const gameState = {
    status: "Beklemede",  // Beklemede, Turda, Açık
    turn: 0,
    turnStartTimestamp: null,
    enemies: {},          // username -> enemy objesi
};

export const classes = {
    archer: { hp: 80, atk: 15, def: 5 },
    warrior: { hp: 120, atk: 10, def: 10 },
    healer: { hp: 70, atk: 5, def: 5, heal: 10 },
};

export const enemies = [
    { name: "Orc Savaşçı", hp: 150, atk: 20, def: 10, icon: "🪓" },
    { name: "Orc Okçu", hp: 100, atk: 25, def: 5, icon: "🏹" },
    { name: "Orc Şaman", hp: 80, atk: 30, def: 3, icon: "🔮" },
    { name: "Orc Dev", hp: 200, atk: 15, def: 20, icon: "👹" },
];

export function handleJoin(username, className) {
    if (gameState.status != "Açık") {
        console.log(`⚠️ ${username}, şu anda oyuna katılamazsın.`);
        return;
    }

    if (players[username]) {
        console.log(`⚠️ ${username} zaten bir karakter oluşturmuş.`);
        return;
    }
    const baseStats = classes[className];
    if (!baseStats) {
        console.log(`❌ Geçersiz sınıf seçimi: ${className}`);
        return;
    }
    players[username] = {
        class: className,
        stats: { ...baseStats },
        lastAction: "Beklemede",
    };
    console.log(`✅ ${username} oyuna katıldı! Sınıfı: ${className}`);

    broadcast({ players, gameState });
}

export function handleStats(username) {
    const player = players[username];
    if (!player) {
        console.log(`ℹ️ ${username} henüz bir karakter oluşturmadı. (!join kullanmalı)`);
        return;
    }
    console.log(`📊 ${username} (${player.class}) =>`, player.stats);
}

export function openRoom() {
    gameState.status = "Açık";

    broadcast({ players, gameState });
}

export function startNextTurn() {
    gameState.turn++;
    gameState.status = "Turda";
    gameState.turnStartTimestamp = Date.now();

    // Her tur başında oyuncuların lastAction'ını sıfırla
    for (const player of Object.values(players)) {
        player.lastAction = "Beklemede";

        const randomIndex = Math.floor(Math.random() * enemies.length);
        player.currentEnemy = enemies[randomIndex];
    }

    console.log(`🕒 Tur ${gameState.turn} başladı.`);

    broadcast({ players, gameState });

    setTimeout(() => {
        handleTurn();
    }, 30 * 1000);
}

export function endTurn() {
    gameState.status = "Bitti";
    gameState.turnStartTimestamp = null;
    gameState.turn = 0;
    console.log(`🕒 Oyun sona erdi.`);

    broadcast({ players, gameState });
}

// Komutları işleyen fonksiyon
export function handleAction(username, action) {
    if (gameState.status !== "Turda") {
        console.log(`❌ ${username} -> Tur başlamadan hamle yapılamaz.`);
        return { error: "Tur başlamadan hamle yapılamaz." };
    }

    const player = players[username];
    if (!player) {
        console.log(`❌ ${username} -> Karakter yok.`);
        return { error: "Karakter bulunamadı." };
    }

    if (!["attack", "defence", "heal"].includes(action)) {
        console.log(`❌ ${username} -> Geçersiz hamle: ${action}`);
        return { error: "Geçersiz hamle." };
    }

    player.lastAction = action;
    console.log(`✅ ${username} hamle yaptı: ${action}`);

    broadcast({ players, gameState });
    return { success: true };
}

export function handleTurn() {
    console.log(`🕒 Tur ${gameState.turn} işleniyor...`);

    const results = [];

    for (const [username, player] of Object.entries(players)) {
        if (!player.currentEnemy) continue;

        const outcome = simulateBattleTurn(player, player.currentEnemy);

        let logLine = `${username} saldırdı: Düşmana ${outcome.playerDamage} hasar, düşmandan ${outcome.enemyDamage} hasar aldılar.`;

        if (outcome.enemyDead) {
            logLine += ` ${player.currentEnemy.name} öldü!`;
            player.currentEnemy = null;
        }

        if (outcome.playerDead) {
            logLine += ` ${username} öldü ve oyundan çıkarıldı!`;
            delete players[username];
            continue; // Bu oyuncu gitti, devam etme
        }

        results.push(logLine);
    }

    // Tur sonunda sonucu konsola yaz ve client'a yayınla
    results.forEach((r) => console.log(r));

    // Oyuncu listesi ve durum güncelle
    broadcast({ players, gameState, systemMessage: results.join("\n") });

    //!end turn -- end game
    endTurn();
}

function simulateBattleTurn(player, enemy) {
    // Basit hasar hesaplama: atk - def (en az 1 hasar)
    const playerDamage = Math.max(player.stats.atk - enemy.def, 1);
    const enemyDamage = Math.max(enemy.atk - player.stats.def, 1);

    enemy.hp -= playerDamage;
    player.stats.hp -= enemyDamage;

    return {
        playerDamage,
        enemyDamage,
        playerDead: player.stats.hp <= 0,
        enemyDead: enemy.hp <= 0,
    };
}