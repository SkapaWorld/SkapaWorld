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

