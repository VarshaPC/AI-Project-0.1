import { apiClient } from "./apiClient.js";

export const cartService = {
	async get() {
		const { data } = await apiClient.get("/cart");
		return data;
	},
	async add({ cakeId, variantId, quantity = 1, flavour, customization }) {
		const { data } = await apiClient.post("/cart/items", { cakeId, variantId, quantity, flavour, customization });
		return data;
	},
	async setQuantity(itemId, quantity) {
		const { data } = await apiClient.patch(`/cart/items/${itemId}`, { quantity });
		return data;
	},
	async remove(itemId) {
		const { data } = await apiClient.delete(`/cart/items/${itemId}`);
		return data;
	},
	async clear() {
		await apiClient.delete("/cart");
	}
};