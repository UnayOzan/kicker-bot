import { startServer } from "./api/server.js";
import { startListener } from "./api/listener.js";
import { checkRedemptions } from "./api/checkRedemptions.js";

startServer();
startListener();

setInterval(checkRedemptions, 10000);


console.log("Sistem başlatıldı.");
