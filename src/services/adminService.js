import { apiClient } from "./apiClient.js";

export const adminService = {
	async dashboard() {
		const { data } = await apiClient.get("/admin/dashboard");
		return data;
	},
	async inventory() {
		const { data } = await apiClient.get("/admin/inventory");
		return data.items || [];
	},
	async orders(params = {}) {
		const { data } = await apiClient.get("/admin/orders", { params });
		return data;
	}
};