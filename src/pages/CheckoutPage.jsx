import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { bookingService } from "../services/bookingService.js";
import { orderService } from "../services/orderService.js";
import { cartService } from "../services/cartService.js";
import { getApiError } from "../services/apiClient.js";
import { money } from "../components/ProductCard.jsx";

function minimumDate() {
	const date = new Date(); date.setDate(date.getDate() + 3);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function loadRazorpay() {
	if (window.Razorpay) return Promise.resolve();
	return new Promise((resolve, reject) => {
		const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = resolve; script.onerror = () => reject(new Error("Secure payment checkout could not be loaded")); document.head.append(script);
	});
}

export default function CheckoutPage() {
	const { items, subtotal, refresh } = useCart();
	const location = useLocation();
	const navigate = useNavigate();
	const booked = location.state?.booking;
	const [date, setDate] = useState(booked?.date || "");
	const [slot, setSlot] = useState(booked?.slot || "");
	const [slots, setSlots] = useState([]);
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	useEffect(() => {
		if (!date || booked?.slot) return;
		bookingService.availability(date).then((result) => { setSlots(result.filter((entry) => entry.available)); setSlot(""); }).catch((requestError) => setError(getApiError(requestError)));
	}, [date, booked?.slot]);
	if (!items.length) return <main className="page-wrap"><p className="eyebrow">CHECKOUT</p><h1 className="page-title">Your bag is empty.</h1><Link to="/cakes">Find a cake →</Link></main>;

	async function restoreItems(order) {
		for (const item of order.items) await cartService.add({ cakeId: item.cake, variantId: item.variant, quantity: item.quantity, flavour: item.flavour, customization: item.customization });
		await refresh();
	}

	async function payOrder(order) {
		try {
			const payment = await orderService.createPayment(order._id);
			await loadRazorpay();
			const checkout = new window.Razorpay({ key: payment.keyId, amount: Math.round(payment.amount * 100), currency: payment.currency, name: "BAKEBERRY", description: "BAKEBERRY cake order", order_id: payment.providerOrderId, handler: async (response) => {
				try {
					await orderService.verifyPayment(response);
					navigate(`/orders/${order._id}`, { replace: true, state: { paid: true } });
				} catch (verificationError) { setError(getApiError(verificationError)); }
			}, modal: { ondismiss: () => setError("Payment was not completed. Your reservation remains pending while it is active.") } });
			checkout.on("payment.failed", (response) => setError(response.error?.description || "Payment failed. You can retry while your reservation is active."));
			checkout.open();
		} catch (paymentError) {
			try {
				const latest = await orderService.getById(order._id);
				if (latest.orderStatus === "pending_payment") {
					await orderService.cancel(order._id, "Payment could not be started");
					await restoreItems(order);
				}
			} catch { /* Expiry worker releases reservations if cancellation is temporarily unavailable. */ }
			setError(`${getApiError(paymentError)} No payment was taken; the items were returned to your bag when possible.`);
		}
	}

	async function submit(event) {
		event.preventDefault(); setBusy(true); setError("");
		try {
			await bookingService.validate({ cakeId: items[0].cakeId || items[0].cake?._id, variantId: items[0].variantId || items[0].variant?._id, date, slot });
			const result = await orderService.checkout({ fulfillment: "pickup", date, slot }, globalThis.crypto?.randomUUID?.() || `bakeberry-${Date.now()}-${Math.random().toString(16).slice(2)}`);
			await refresh();
			await payOrder(result.order);
		} catch (requestError) { setError(getApiError(requestError)); }
		finally { setBusy(false); }
	}

	return <main className="page-wrap"><p className="eyebrow">ALMOST THE BEST PART</p><h1 className="page-title">Choose your pickup.</h1><div className="checkout-layout"><form className="checkout-form dialog-form" onSubmit={submit}><label>Pickup date<input type="date" min={minimumDate()} value={date} onChange={(event) => setDate(event.target.value)} required/></label><label>Available time<select value={slot} onChange={(event) => setSlot(event.target.value)} required disabled={!date || (!slots.length && !booked?.slot)}><option value="">{date ? "Choose a time" : "Choose a date first"}</option>{booked?.slot ? <option value={booked.slot}>{booked.slot}</option> : slots.map((entry) => <option key={entry.slot} value={entry.slot}>{entry.slot} · {entry.remaining} spots</option>)}</select></label><div className="notice-panel">Delivery is unavailable until the bakery configures its shop location, delivery fee, and address verification. This checkout currently supports pickup.</div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit" disabled={busy || !date || !slot}>{busy ? "Checking order…" : "Place pickup order"}<span>→</span></button></form><aside className="cart-page-summary"><h2>Order summary</h2>{items.map((item) => <div className="summary-item" key={item.id || item.key}><span>{item.name || item.cake?.name} × {item.quantity}</span><strong>{money(item.lineTotal ?? item.variant?.price * item.quantity)}</strong></div>)}<div className="summary-total"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Final charges are calculated by the backend.</p></aside></div></main>;
}