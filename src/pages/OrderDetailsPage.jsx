import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { orderService } from "../services/orderService.js";
import { getApiError } from "../services/apiClient.js";
import { money } from "../components/ProductCard.jsx";

export default function OrderDetailsPage() {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	useEffect(() => { orderService.getById(id).then(setOrder).catch((requestError) => setError(getApiError(requestError))); }, [id]);
	async function cancelOrder() {
		try { const updated = await orderService.cancel(id, "Cancelled by customer"); setOrder(updated); setMessage("Unpaid order cancelled."); }
		catch (requestError) { setError(getApiError(requestError)); }
	}
	if (error && !order) return <main className="page-wrap"><p className="form-error">{error}</p><Link to="/orders">Back to orders</Link></main>;
	if (!order) return <main className="page-wrap"><p className="collection-state">Loading order…</p></main>;
	const confirmed = order.paymentStatus === "paid";
	return <main className="page-wrap"><p className="eyebrow">{confirmed ? "ORDER CONFIRMED" : "ORDER STATUS"}</p><h1 className="page-title">{confirmed ? "Your celebration is on the calendar." : "Your order is being held."}</h1><p className="page-intro">{order.orderNumber}</p><section className="order-detail-card"><div className="delivery-line"><span>Order state</span><strong>{order.orderStatus.replaceAll("_", " ")}</strong></div><div className="delivery-line"><span>Payment</span><strong>{order.paymentStatus}</strong></div><div className="delivery-line"><span>{order.fulfillment === "pickup" ? "Pickup" : "Delivery"}</span><strong>{order.bookingDate} · {order.bookingSlot}</strong></div>{order.items.map((item, index) => <div className="delivery-line" key={`${item.cake}:${index}`}><span>{item.name} · {item.variantName} × {item.quantity}</span><strong>{money(item.unitPrice * item.quantity)}</strong></div>)}<div className="delivery-line"><span>Total</span><strong>{money(order.total)}</strong></div></section>{order.statusHistory?.length > 0 && <section className="tracking-history"><h2>Order updates</h2>{order.statusHistory.map((entry, index) => <div className="tracking-row" key={`${entry.status}-${index}`}><span className="stock-dot"/><div><strong>{entry.status.replaceAll("_", " ")}</strong><small>{new Date(entry.at).toLocaleString()}</small>{entry.note && <p>{entry.note}</p>}</div></div>)}</section>}{message && <p className="form-success">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}{order.orderStatus === "pending_payment" && <button className="text-button" onClick={cancelOrder}>Cancel unpaid order →</button>}<p><Link to="/orders">Back to my orders</Link></p></main>;
}