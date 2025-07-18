import { eventBus } from "../misc/eventBus";

const players = {};

const classes = {
    archer: { hp: 80, atk: 15, def: 5 },
    warrior: { hp: 120, atk: 10, def: 10 },
    healer: { hp: 70, atk: 5, def: 5, heal: 10 },
};

function handleJoin(username, className) {
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

function handleStats(username) {
    const player = players[username];
    if (!player) {
        console.log(`ℹ️ ${username} henüz bir karakter oluşturmadı. (!join kullan)`);
        return;
    }

    console.log(`📊 ${username} (${player.class}) =>`, player.stats);
}

export function startRPG() {
    eventBus.subscribe("*", (eventName, data) => {
        //if (eventName !== "chat_message") return; // Sadece chat mesajları

        const { username, content } = data;

        if (content.startsWith("!join ")) {
            const className = content.split(" ")[1];
            handleJoin(username, className);
        }

        if (content === "!stats") {
            handleStats(username);
        }
    });
}
