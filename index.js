import { startServer } from "./api/server.js";
import { startListener } from "./api/listener.js";
import { checkRedemptions } from "./api/checkRedemptions.js";
import { startRPG } from "./api/game/startGame.js";

startServer();

startListener(() => {
    startRPG();
});

//setInterval(checkRedemptions, 10000);

console.log("Sistem başlatıldı.");
