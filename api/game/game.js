export const players = {};

export const gameState = {
  status: "Beklemede",  // Örnek durumlar: Beklemede, Başladı, Turda, Bitti
  turn: 0,
  turnStartTimestamp: null,
};

export const classes = {
    archer: { hp: 80, atk: 15, def: 5 },
    warrior: { hp: 120, atk: 10, def: 10 },
    healer: { hp: 70, atk: 5, def: 5, heal: 10 },
};

export function handleJoin(username, className) {
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
    };
    console.log(`✅ ${username} oyuna katıldı! Sınıfı: ${className}`);
}

export function handleStats(username) {
    const player = players[username];
    if (!player) {
        console.log(`ℹ️ ${username} henüz bir karakter oluşturmadı. (!join kullanmalı)`);
        return;
    }
    console.log(`📊 ${username} (${player.class}) =>`, player.stats);
}

export function startNextTurn() {
    gameState.turn++;
    gameState.status = "Turda";
    gameState.turnStartTimestamp = Date.now();
    console.log(`🕒 Tur ${gameState.turn} başladı.`);
}

export function endTurn() {
    gameState.status = "Beklemede";
    gameState.turnStartTimestamp = null;
    console.log(`🕒 Tur ${gameState.turn} sona erdi.`);
}