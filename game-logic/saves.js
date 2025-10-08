import { apiPost } from "./api.js";
import { getCurrentUserId } from "./user.js";

async function handleUnityGameOver(distance, level) {
    console.log("✅ Unity Game Over received", distance, level);
    
    try {
        const userId = getCurrentUserId(); // Get fresh userId each call
        
        await apiPost("/records/save", {
            "profile": {
                "telegram_id": userId
            },
            "record": {
                "level": level,
                "score": distance
            }
        });
        
        console.log("✅ Game record saved successfully");
    } catch (error) {
        console.error("❌ Failed to save game record:", error);
    }
}

// Expose safe bridge for Unity
Object.defineProperty(window, "OnUnityGameOver", {
    value: function (distance, level) {
        if (typeof distance === "number" && typeof level === "string") {
            handleUnityGameOver(distance, level);
        } else {
            console.warn("Invalid call blocked - expected (number, string), got:", typeof distance, typeof level);
        }
    },
    writable: false,
    configurable: false,
});


// Optional: Also expose a way to manually trigger for testing
if (process.env.NODE_ENV === 'development') {
    window.testGameOver = (distance = 100, level = "Level1") => {
        handleUnityGameOver(distance, level);
    };
}   