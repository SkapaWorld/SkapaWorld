import { apiPost, apiPut } from "./api.js";
import { getCurrentUserId } from "./user.js";

let unityInstance = null;

export function setUnityInstance(instance) {
    unityInstance = instance;
    console.log("✅ Unity instance set in coins.js");
}

export function setCoinBalance(amount) {
    if (unityInstance) {
        try {
            unityInstance.SendMessage('Main Camera (1)/Canvas2/Gcoins/Text', 'SetCoinBalance', amount);
            return true;
        } catch (e) {
            console.error("Failed to set coins:", e);
            return false;
        }
    } else {
        console.warn("Unity instance not available yet");
        return false;
    }
}

export function addCoins(amount) {
    if (unityInstance) {
        try {
            unityInstance.SendMessage(
                "MMain Camera (1)/Canvas2/Gcoins/Text", // ✅ same object
                "AddCoins",                            // ✅ must exist in C#
                amount
            );
            return true;
        } catch (e) {
            console.error("Failed to add coins:", e);
            return false;
        }
    } else {
        console.warn("Unity instance not available yet");
        return false;
    }
}

async function RequestRecordsFromAPI(coins) {
    try {
        const data = await apiPost("/records/global", {
            level: coins,
        });
        console.log(`✅fetched records`);
        unityInstance.SendMessage("RecmenuSch", "OnReceiveRecords", JSON.stringify(data));
    } catch (error) {
        console.error('❌ Failed to fetch records', error);
    }
}

Object.defineProperty(window, "RequestRecordsFromAPI", {
    value: function (coin) {
        RequestRecordsFromAPI(coin);
    },
    writable: false,
    configurable: false,
});

async function GetOwnedTricks() {
    const telegramId = getCurrentUserId();
    try {
        const data = await apiPost("/tricks/tricks", {
            telegram_id: telegramId,
        });
        unityInstance.SendMessage('Buy1B', 'OverrideTrickStates', JSON.stringify(data));
    } catch (error) {
        console.error('❌ Failed to purchase tricks:', error);
    }
}

Object.defineProperty(window, "OnTrick", {
    value: function () {
        GetOwnedTricks();
    },
    writable: false,
    configurable: false,
});

async function OnTrickPurchasedUnity(trickId) {
    const telegramId = getCurrentUserId();
    try {
        const response = await apiPost("/tricks/purchase/external", {
            profile: { telegram_id: telegramId },
            trick: { trick_id: trickId },
        });
        if (response && response.paymentUrl) {
        const payButton = document.getElementById("payButton");
            payButton.style.display = "block";
            payButton.onclick = () => {
                window.open(response.data.paymentUrl, "_blank"); // Opens in new tab without closing WebApp
            };
            // Optionally, scroll to button or highlight
            payButton.scrollIntoView({ behavior: "smooth" });
        } else {
            console.error("No redirect URL received");
        }
        GetOwnedTricks()
        return response;
    } catch (error) {
        console.error('❌ Failed to purchase tricks:', error);
    }
}

Object.defineProperty(window, "OnTrickPurchasedUnity", {
    value: function (trickId) {
        OnTrickPurchasedUnity(trickId);
    },
    writable: false,
    configurable: false,
});
async function OnTrickSelectedUnity(trickId) {
    const telegramId = getCurrentUserId();
    try {
        await apiPut("/tricks/update-status", {
            profile: { telegram_id: telegramId },
            trick: { trick_id: trickId, is_in_use: true },
        });
        GetOwnedTricks()
    } catch (error) {
        console.error('❌ Failed to select trick:', error);
    }
}

Object.defineProperty(window, "OnTrickSelectedUnity", {
    value: function (coin) {
        OnTrickSelectedUnity(coin);
    },
    writable: false,
    configurable: false,
});