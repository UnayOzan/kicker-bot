import axios from "axios";

const SLUG = "elderwiggle";
const TOKEN = process.env.KICK_BOT_TOKEN;

export const checkRedemptions = async () => {
    const url = `https://kick.com/api/v2/channel/${SLUG}/redemptions`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        const redemptions = response.data.data;

        redemptions.forEach((r) => {
            console.log(`🎯 Redeem: ${r.reward_title} | Status: ${r.status}`);
        });

    } catch (err) {
        console.error("❌ Redeem kontrolü hatası:", err.message);
    }
};
