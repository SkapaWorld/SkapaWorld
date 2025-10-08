const TG_USER_ID = 'tg_user_id';

// Save Telegram user ID if available from Telegram WebApp
function saveTelegramUserId() {
    const tg = window.Telegram?.WebApp;
    if (!tg) return null;

    tg.ready();
    tg.expand();

    const userId = tg.initDataUnsafe?.user?.id;
    if (userId) {
        localStorage.setItem(TG_USER_ID, userId);
    }
    return userId;
}

function getTelegramUserId() {
    return localStorage.getItem(TG_USER_ID) || null;
}

export function getCurrentUserId() {
    let userId = getTelegramUserId() || saveTelegramUserId();

    if (!userId) {
        userId = '338631567'; // fallback test ID
        console.warn('⚠️ No Telegram ID found. Using test ID:', userId);
    }

    return userId;
}