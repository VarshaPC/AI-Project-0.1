import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderService } from "../services/orderService.js";
import { getApiError } from "../services/apiClient.js";
import { money } from "../components/ProductCard.jsx";

export default function OrdersPage() {
	const [orders, setOrders] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	useEffect(() => { orderService.list({ limit: 30 }).then((result) => setOrders(result.items || [])).catch((requestError) => setError(getApiError(requestError))).finally(() => setLoading(false)); }, []);
	return <main className="page-wrap"><p className="eyebrow">YOUR BAKEBERRY ACCOUNT</p><h1 className="page-title">My orders.</h1>{loading && <p className="collection-state">Loading your orders…</p>}{error && <p className="form-error" role="alert">{error}</p>}{!loading && !error && !orders.length && <div className="empty-cart"><p>No orders yet. Your next celebration starts with a cake.</p><Link className="button button-dark" to="/cakes">Find your cake <span>→</span></Link></div>}<div className="orders-list">{orders.map((order) => <article className="order-card" key={order._id}><div><p className="eyebrow">{order.orderNumber}</p><h2>{order.bookingDate} · {order.bookingSlot}</h2><p>{order.fulfillment === "pickup" ? "Pickup" : "Delivery"} · {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</p></div><div className="order-card-status"><strong>{money(order.total)}</strong><span>{order.orderStatus.replaceAll("_", " ")} · {order.paymentStatus}</span><Link to={`/orders/${order._id}`}>Track order →</Link></div></article>)}</div></main>;
}