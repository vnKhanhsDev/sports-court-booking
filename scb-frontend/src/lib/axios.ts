import axios, { type InternalAxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { localStorageUtil } from "@/utils/localStorageUtil";
import { ENDPOINTS } from "@/constants/endpoint";
import { ROUTES } from "@/constants/route";

export interface ApiResponse<T = any> {
    success: boolean;
    code: number;
    error?: string;
    message: string;
    data?: T;
    errors?: Record<string, string>;
};

const BASE_URL = "http://localhost:8080/api/v1";

// Default Header
const headers = {
    "Content-Type": "application/json",
    Accept: "application/json"
};

// --- INSTANCES ---
export const publicClient = axios.create({
    baseURL: BASE_URL,
    headers,
    withCredentials: true,
    timeout: 10000
});

export const privateClient = axios.create({
    baseURL: BASE_URL,
    headers,
    withCredentials: true,
    timeout: 10000
});

// --- REFRESH TOKEN LOGIC ---
let isRefreshing = false;
let failedRequests: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
    failedRequests.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token as string);
    });
    failedRequests = [];
};

// ******************
//    INTERCEPTORS 
// ******************

// 1. Request Interceptor: Attach Token
privateClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorageUtil.get<string>("accessToken");
        if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
        
        // Remove Content-Type header for FormData to let axios set it automatically with boundary
        if (config.data instanceof FormData && config.headers) {
            delete config.headers['Content-Type'];
        }
        
        return config;
    },
    (error: any) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Errors & Refresh Token
privateClient.interceptors.response.use(
    (response: AxiosResponse) => { return response; },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        /**
         * Nếu không có response (ERR_NETWORK) hoặc status không phải 401 (UNAUTHORIZED)
         * Bỏ qua logic refresh, ném lỗi về useApi xử lý
         */
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (originalRequest._retry) {
            triggerLogout();
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                failedRequests.push({ resolve, reject });
            })
                .then((token) => {
                    if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${token}`;
                    return privateClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await publicClient.post<ApiResponse<{ accessToken: string }>>(ENDPOINTS.AUTH.REFRESH_TOKEN);
            const newAccessToken = data.data?.accessToken ?? null;
            localStorageUtil.set("accessToken", newAccessToken);
            privateClient.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);

            if (originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return privateClient(originalRequest);
        } catch (refreshError: any) {
            processQueue(refreshError, null);
            triggerLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

const triggerLogout = () => {
    localStorageUtil.clear();
    window.location.href = ROUTES.PUBLIC.HOME;
};