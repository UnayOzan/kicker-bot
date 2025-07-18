import { startServer } from "./api/server.js";
import { startListener } from "./api/listener.js";
import { prepareRPG } from "./api/game/prepareGame.js";

startServer();

startListener(() => {
    prepareRPG();
});

//setInterval(checkRedemptions, 10000);

console.log("Sistem başlatıldı.");
