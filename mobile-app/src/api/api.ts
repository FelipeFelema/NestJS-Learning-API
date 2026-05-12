import axios from "axios";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "../storage/authStorage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
})

// Add a request interceptor to include the access token in the Authorization header
api.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

// Auto refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await getRefreshToken();

                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    { refreshToken }
                );

                const { access_token, refresh_token } = response.data;

                await saveTokens(access_token, refresh_token);

                api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${access_token}`,
                };
                
                return api(originalRequest);
            } catch (err) {
                await clearTokens();
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
