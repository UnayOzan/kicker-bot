// game.js
export const players = {};

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
