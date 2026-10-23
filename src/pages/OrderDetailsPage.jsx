import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { orderService } from "../services/orderService.js";
import { getApiError } from "../services/apiClient.js";
import { money } from "../components/ProductCard.jsx";

export function formatOrderStatus(status) {
	switch (status) {
		case "pending_payment": return "Pending";
		case "placed": return "Placed";
		case "confirmed": return "Confirmed";
		case "preparing": return "Preparing";
		case "ready_for_pickup": return "Ready for Pickup";
		case "out_for_delivery": return "Out for Delivery";
		case "delivered": return "Delivered";
		case "cancelled": return "Cancelled";
		case "refund_pending": return "Refund Pending";
		case "refunded": return "Refunded";
		default: return status ? status.replaceAll("_", " ") : "Pending";
	}
}

export function formatPaymentStatus(status) {
	switch (status) {
		case "pending": return "Pending Payment";
		case "paid": return "Paid";
		case "failed": return "Failed";
		case "refunded": return "Refunded";
		default: return status ? status.replaceAll("_", " ") : "Pending Payment";
	}
}

export default function OrderDetailsPage() {
	const { id } = useParams();
	const location = useLocation();
	const [order, setOrder] = useState(null);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");
	const successNotice = location.state?.successMessage;

	useEffect(() => {
		orderService.getById(id).then(setOrder).catch((requestError) => setError(getApiError(requestError)));
	}, [id]);

	async function cancelOrder() {
		try {
			const updated = await orderService.cancel(id, "Cancelled by customer");
			setOrder(updated);
			setMessage("Unpaid order cancelled.");
		} catch (requestError) {
			setError(getApiError(requestError));
		}
	}

	if (error && !order) return <main className="page-wrap"><p className="form-error">{error}</p><Link to="/orders">Back to orders</Link></main>;
	if (!order) return <main className="page-wrap"><p className="collection-state">Loading order…</p></main>;

	const isPaid = order.paymentStatus === "paid";
	const isCancelled = order.orderStatus === "cancelled";
	const isPending = order.orderStatus === "pending_payment";

	return <main className="page-wrap">
		{successNotice && (
			<div className="order-success-banner" role="status" aria-live="polite">
				<div className="success-icon" aria-hidden="true">✓</div>
				<div className="success-body">
					<h2>{successNotice}</h2>
					<p>Order <strong>#{order.orderNumber}</strong> has been received! Your pickup is reserved for <strong>{order.bookingDate}</strong> at <strong>{order.bookingSlot}</strong>.</p>
				</div>
			</div>
		)}

		<p className="eyebrow">{isPaid ? "ORDER CONFIRMED" : isCancelled ? "ORDER CANCELLED" : "ORDER SCHEDULED"}</p>
		<h1 className="page-title">{isCancelled ? "This order was cancelled." : "Your celebration is on the calendar."}</h1>
		<p className="page-intro">Order Reference: <strong>{order.orderNumber}</strong></p>

		<section className="order-detail-card">
			<div className="delivery-line">
				<span>Order state</span>
				<strong className={`status-pill status-${order.orderStatus}`}>{formatOrderStatus(order.orderStatus)}</strong>
			</div>
			<div className="delivery-line">
				<span>Payment</span>
				<strong className={`status-pill status-${order.paymentStatus}`}>{formatPaymentStatus(order.paymentStatus)}</strong>
			</div>
			<div className="delivery-line">
				<span>{order.fulfillment === "pickup" ? "Pickup Schedule" : "Delivery"}</span>
				<strong>{order.bookingDate} · {order.bookingSlot}</strong>
			</div>
			{order.items.map((item, index) => (
				<div className="delivery-line" key={`${item.cake}:${index}`}>
					<span>{item.name} · {item.variantName} × {item.quantity}</span>
					<strong>{money(item.unitPrice * item.quantity)}</strong>
				</div>
			))}
			<div className="delivery-line order-total-line">
				<span>Total</span>
				<strong>{money(order.total)}</strong>
			</div>
		</section>

		{order.statusHistory?.length > 0 && (
			<section className="tracking-history">
				<h2>Order updates</h2>
				{order.statusHistory.map((entry, index) => (
					<div className="tracking-row" key={`${entry.status}-${index}`}>
						<span className={`stock-dot ${entry.status === "cancelled" ? "low" : ""}`}/>
						<div>
							<strong>{formatOrderStatus(entry.status)}</strong>
							<small>{new Date(entry.at).toLocaleString()}</small>
							{entry.note && <p>{entry.note}</p>}
						</div>
					</div>
				))}
			</section>
		)}

		{message && <p className="form-success">{message}</p>}
		{error && <p className="form-error" role="alert">{error}</p>}
		{isPending && <button className="text-button" type="button" onClick={cancelOrder}>Cancel unpaid order →</button>}
		<p><Link to="/orders">Back to my orders</Link></p>
	</main>;
}