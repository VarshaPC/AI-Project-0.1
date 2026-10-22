import { apiClient } from "./apiClient.js";

export const orderService = {
	async checkout(payload, idempotencyKey) {
		const { data } = await apiClient.post("/checkout", payload, { headers: { "Idempotency-Key": idempotencyKey } });
		return data;
	},
	async list(params = {}) {
		const { data } = await apiClient.get("/orders", { params });
		return data;
	},
	async getById(id) {
		const { data } = await apiClient.get(`/orders/${id}`);
		return data.order;
	},
	async cancel(id, reason) {
		const { data } = await apiClient.post(`/orders/${id}/cancel`, { reason });
		return data.order;
	},
	async createPayment(orderId) {
		const { data } = await apiClient.post("/payments/create", { orderId });
		return data.payment;
	},
	async verifyPayment(payload) {
		const { data } = await apiClient.post("/payments/verify", payload);
		return data;
	}
};