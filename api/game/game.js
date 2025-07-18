
import { broadcast } from "../server.js";

export const players = {};

export const gameState = {
    status: "Beklemede",  // Beklemede, Turda
    turn: 0,
    turnStartTimestamp: null,
};

export const classes = {
    archer: { hp: 80, atk: 15, def: 5 },
    warrior: { hp: 120, atk: 10, def: 10 },
    healer: { hp: 70, atk: 5, def: 5, heal: 10 },
};

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

export function openRoom(){
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
    }

    console.log(`🕒 Tur ${gameState.turn} başladı.`);

    broadcast({ players, gameState });
}

export function endTurn() {
    gameState.status = "Beklemede";
    gameState.turnStartTimestamp = null;
    console.log(`🕒 Tur ${gameState.turn} sona erdi.`);

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


