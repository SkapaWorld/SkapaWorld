import { apiPost, apiPut } from "./api.js";
import { getCurrentUserId } from "./user.js";

async function JSGameOver(coins) {
    const telegramId = getCurrentUserId();
    try {
        const newTotal = parseInt(coins);
        await apiPut("/profile/update-coins", {
            profile: { telegram_id: telegramId },
            coins: { gold_coins: newTotal },
        });
        console.log(`✅ Updated coins for user ${telegramId}: ${currentCoins} → ${newTotal}`);
    } catch (error) {
        console.error('❌ Failed to update coins:', error);
    }
}

Object.defineProperty(window, "JSGameOver", {
    value: function (coin) {
        JSGameOver(coin);
    },
    writable: false,
    configurable: false,
});
