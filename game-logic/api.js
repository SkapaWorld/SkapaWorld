const BASE_URL = 'https://api.skapa.world';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function withRetry(apiCall, maxRetries = MAX_RETRIES, retryDelay = RETRY_DELAY) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            lastError = error;
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
            }
        }
    }
    throw lastError;
}

async function apiRequest({ url, method = 'GET', params = {}, data = {}, retry = false }) {
    const call = async () => {
        const response = await axios({
            url: `${BASE_URL}${url}`,
            method,
            params,
            data,
            timeout: 10000,
            validateStatus: () => true 
        });

        if (url === '/profile/create' && response.status === 400) {
            console.log('ℹ️ Profile already exists, continuing...');
            return { exists: true };
        }

        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        throw { response };
    };

    return retry ? await withRetry(call) : await call();
}

function apiGet(url, params = {}, retry = false) {
    return apiRequest({ url, method: 'GET', params, retry });
}

function apiPost(url, data = {}, retry = false) {
    return apiRequest({ url, method: 'POST', data, retry });
}

function apiPut(url, data = {}, retry = false) {
    return apiRequest({ url, method: 'PUT', data, retry });
}

export { apiGet, apiPost, apiPut };
