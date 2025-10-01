// storage key
const TG_USER_ID = 'tg_user_id';

// ✅ Store only the Telegram user ID
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

// ✅ Get stored user id
function getTelegramUserId() {
    return localStorage.getItem(TG_USER_ID) || null;
}

// ✅ Core API handler
async function apiRequest({ url, method = 'GET', params = {}, data = {} }) {
    try {
        const response = await axios({
            url,
            method,
            params,
            data
        });
        return response.data;
    } catch (err) {
        console.error('API Request Error:', err);
        throw err;
    }
}

// ✅ GET helper
function apiGet(url, params = {}) {
    return apiRequest({ url, method: 'GET', params });
}

// ✅ POST helper
function apiPost(url, data = {}) {
    return apiRequest({ url, method: 'POST', data });
}

// ✅ Example usage
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Save or retrieve tg user ID
    let userId = saveTelegramUserId();
    if (!userId){ 
        userId = getTelegramUserId();
        
    }

    console.log('Telegram User ID:', userId);

    // ✅ Example GET
    try {
        const gameData = await apiGet('/api/game', { userId });
        console.log('GET result:', gameData);
    } catch (e) {
        console.error('GET failed', e);
    }

    // ✅ Example POST
    try {
        const userData = await apiPost('http://45.9.75.242:8080/profile/create', { "telegram_id":String(userId),});
        console.log('POST result:', userData);
    } catch (e) {
        console.error('POST failed', e);
    }
});
