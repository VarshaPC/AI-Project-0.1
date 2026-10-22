import { apiClient } from "./apiClient.js";

export const bookingService = {
	async availability(from, to = from) {
		const { data } = await apiClient.get("/availability", { params: { from, to } });
		return data.slots || [];
	},
	async validate(payload) {
		const { data } = await apiClient.post("/bookings/validate", payload);
		return data;
	}
};