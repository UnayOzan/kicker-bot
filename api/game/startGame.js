import { eventBus } from "../misc/eventBus.js";
import { handleJoin, handleStats, handleAction } from "./game.js";

export function startRPG() {
    eventBus.subscribe("chat_message", (data) => {
        const { content } = data;
        const { username } = data.sender;

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