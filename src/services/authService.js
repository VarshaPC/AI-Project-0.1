import { apiClient } from "./apiClient.js";

export const authService = {
	async signup(payload) {
		const { data } = await apiClient.post("/auth/signup", payload);
		return data;
	},
	async login(payload) {
		const { data } = await apiClient.post("/auth/login", payload);
		return data;
	},
	async refresh() {
		const { data } = await apiClient.post("/auth/refresh");
		return data;
	},
	async logout() {
		await apiClient.post("/auth/logout");
	},
	async me() {
		const { data } = await apiClient.get("/auth/me");
		return data.user;
	},
	async updateProfile(payload) {
		const { data } = await apiClient.patch("/auth/me", payload);
		return data.user;
	},
	async addAddress(payload) {
		const { data } = await apiClient.post("/auth/me/addresses", payload);
		return data.addresses;
	},
	async changePassword(payload) {
		await apiClient.post("/auth/change-password", payload);
	}
};