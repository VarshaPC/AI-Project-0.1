import test from "node:test";
import assert from "node:assert/strict";
import { apiClient } from "../src/services/apiClient.js";
import { authService } from "../src/services/authService.js";
import { cakeService } from "../src/services/cakeService.js";
import { cartService } from "../src/services/cartService.js";
import { bookingService } from "../src/services/bookingService.js";
import { orderService } from "../src/services/orderService.js";

function mockResponse(data, status = 200) {
	return { data, status, statusText: "OK", headers: {}, config: {}, request: {} };
}

test("auth service uses implemented login endpoint and payload", async () => {
	const original = apiClient.post;
	let call;
	apiClient.post = async (...args) => { call = args; return mockResponse({ accessToken: "access", user: { id: "u1" } }); };
	try {
		const result = await authService.login({ email: "cake@example.test", password: "secret" });
		assert.equal(call[0], "/auth/login");
		assert.deepEqual(call[1], { email: "cake@example.test", password: "secret" });
		assert.equal(result.user.id, "u1");
	} finally { apiClient.post = original; }
});

test("cake service sends catalogue filters to the existing endpoint", async () => {
	const original = apiClient.get;
	let call;
	apiClient.get = async (...args) => { call = args; return mockResponse({ items: [{ _id: "c1" }], total: 1 }); };
	try {
		const result = await cakeService.list({ search: "berry", category: "All", page: 2 });
		assert.equal(call[0], "/cakes");
		assert.deepEqual(call[1].params, { page: 2, limit: 50, search: "berry" });
		assert.equal(result.items[0]._id, "c1");
	} finally { apiClient.get = original; }
});

test("cart, booking, checkout, order and payment services call existing API routes", async () => {
	const originalGet = apiClient.get;
	const originalPost = apiClient.post;
	const originalPatch = apiClient.patch;
	const originalDelete = apiClient.delete;
	const calls = [];
	apiClient.get = async (...args) => { calls.push(["GET", ...args]); return mockResponse({ items: [], slots: [], order: { _id: "o1" } }); };
	apiClient.post = async (...args) => { calls.push(["POST", ...args]); return mockResponse({ order: { _id: "o1" }, payment: { id: "p1" }, valid: true }); };
	apiClient.patch = async (...args) => { calls.push(["PATCH", ...args]); return mockResponse({ items: [] }); };
	apiClient.delete = async (...args) => { calls.push(["DELETE", ...args]); return mockResponse(null, 204); };
	try {
		await cartService.get();
		await cartService.add({ cakeId: "c1", variantId: "v1", quantity: 1 });
		await cartService.setQuantity("i1", 2);
		await cartService.remove("i1");
		await bookingService.availability("2026-11-01");
		await bookingService.validate({ cakeId: "c1", variantId: "v1", date: "2026-11-01", slot: "10:00-12:00" });
		await orderService.checkout({ fulfillment: "pickup", date: "2026-11-01", slot: "10:00-12:00" }, "cakeora-test-001");
		await orderService.list();
		await orderService.getById("o1");
		await orderService.createPayment("o1");
		await orderService.verifyPayment({ razorpay_order_id: "r1", razorpay_payment_id: "p1", razorpay_signature: "sig" });
		assert.ok(calls.some((call) => call[0] === "GET" && call[1] === "/availability"));
		assert.ok(calls.some((call) => call[0] === "POST" && call[1] === "/bookings/validate"));
		const checkout = calls.find((call) => call[0] === "POST" && call[1] === "/checkout");
		assert.equal(checkout[3].headers["Idempotency-Key"], "cakeora-test-001");
		assert.ok(calls.some((call) => call[0] === "POST" && call[1] === "/payments/create"));
		assert.ok(calls.some((call) => call[0] === "POST" && call[1] === "/payments/verify"));
	} finally {
		apiClient.get = originalGet;
		apiClient.post = originalPost;
		apiClient.patch = originalPatch;
		apiClient.delete = originalDelete;
	}
});