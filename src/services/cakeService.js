import { apiClient } from "./apiClient.js";

export const cakeService = {
	async list({ search = "", category = "All", page = 1, limit = 50 } = {}) {
		const params = { page, limit };
		if (search.trim()) params.search = search.trim();
		if (category !== "All" && category !== "Eggless") params.category = category;
		const { data } = await apiClient.get("/cakes", { params });
		let items = data.items || [];
		if (category === "Eggless") items = items.filter((cake) => cake.variants?.some((variant) => variant.egglessAvailable));
		return { ...data, items };
	},
	async getById(id) {
		const { data } = await apiClient.get(`/cakes/${id}`);
		return data.cake;
	}
};