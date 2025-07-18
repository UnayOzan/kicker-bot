import { eventBus } from "../misc/eventBus.js";
import { handleJoin, handleStats, handleAction, gameState, startNextTurn, endTurn, openRoom } from "./game.js";

export function startRPG() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;

        if (content === "!startRPG") {
            const msg = openRoom();
            console.log(msg);
            return;
        }

        if (content === "!turnRPG") {
            const msg = startNextTurn();
            console.log(msg);
            return;
        }

        if (content === "!endRPG") {
            const msg = endTurn();
            console.log(msg);
            return;
        }

        if (content.startsWith("!join ")) {
            const className = content.split(" ")[1];
            handleJoin(username, className);
        }

        if (content === "!stats") {
            handleStats(username);
        }

        if (["!attack", "!defence", "!heal"].includes(content.toLowerCase())) {
            const cmd = content.replace("!", "").toLowerCase();
            const result = handleAction(username, cmd);

            if (result.error) {
                console.log(`❌ ${username}: ${result.error}`);
            } else {
                console.log(`🎯 ${username} hamlesini yaptı: ${cmd}`);
            }
        }
    });
}