import { apiPost } from './game-logic/api.js';

const TG_USER_ID = 'tg_user_id';

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

async function initApp() {
    let userId = getTelegramUserId() || saveTelegramUserId();

    if (!userId) {
        userId = 338631567;
        console.warn('⚠️ No Telegram ID found. Using test ID:', userId);
    }

    console.log('👤 Using Telegram ID:', userId);

    try {
        console.log('🚀 Creating profile...');
        const profile = await apiPost('/profile/create', {
            telegram_id: String(userId)
        });
        if (profile?.exists) {
            console.log('ℹ️ Existing profile detected');
        } else {
            console.log('✅ Profile created:', profile);
        }

        console.log('🔄 Fetching user coins...');
        const coins = await apiPost('/profile/get-coins', {
            telegram_id: String(userId)
        }, true);

        console.log('✅ Coins:', coins);

        console.log('📅 Checking daily status...');
        const daily = await apiPost('/daily/daily/check', {
            telegram_id: String(userId)
        }, true);

        console.log('✅ Daily check:', daily);

        console.log('🎉 All API calls successful!');
        return { profile, coins, daily };

    } catch (err) {
        const message = getErrorMessage(err);
        console.error('❌ API flow failed:', message);
        alert(`Error: ${message}`);
        throw err;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    initApp().then(data => {
        console.log('✅ Final results:', data);
        // You can now use `data.profile`, `data.coins`, `data.daily`
    });
});
