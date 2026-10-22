import axios from "axios";

const baseURL = import.meta.env?.VITE_API_URL || "http://127.0.0.1:4000/api/v1";
let accessToken = null;
let refreshRequest = null;
let sessionRestorePromise = null;

export const apiClient = axios.create({
	baseURL,
	withCredentials: true,
	timeout: 10000,
	headers: { Accept: "application/json" }
});

apiClient.interceptors.request.use((config) => {
	if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
	return config;
});

apiClient.interceptors.response.use((response) => response, async (error) => {
	const original = error.config;
	if (error.response?.status !== 401 || original?._retry || original?.url?.includes("/auth/refresh")) throw error;
	original._retry = true;
	try {
		refreshRequest ??= axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true, timeout: 10000 });
		const { data } = await refreshRequest;
		accessToken = data.accessToken;
		return apiClient(original);
	} catch (refreshError) {
		accessToken = null;
		window.dispatchEvent(new CustomEvent("cakeora:session-expired"));
		throw refreshError;
	} finally {
		refreshRequest = null;
	}
});

export function setAccessToken(token) {
	accessToken = token || null;
}

export function clearAccessToken() {
	accessToken = null;
}

export function getApiError(error) {
	return error.response?.data?.error?.message || error.message || "CAKEORA could not complete that request.";
}

export function restoreSessionOnce(restore) {
	if (!sessionRestorePromise) {
		sessionRestorePromise = Promise.resolve().then(restore).finally(() => { sessionRestorePromise = null; });
	}
	return sessionRestorePromise;
}