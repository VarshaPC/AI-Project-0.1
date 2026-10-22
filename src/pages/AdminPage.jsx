import { useEffect, useState } from "react";
import { adminService } from "../services/adminService.js";
import { getApiError } from "../services/apiClient.js";
import { money } from "../components/ProductCard.jsx";

export default function AdminPage() {
	const [dashboard, setDashboard] = useState(null);
	const [inventory, setInventory] = useState([]);
	const [error, setError] = useState("");
	useEffect(() => {
		Promise.all([adminService.dashboard(), adminService.inventory()]).then(([summary, stock]) => { setDashboard(summary); setInventory(stock); }).catch((requestError) => setError(getApiError(requestError)));
	}, []);
	return <main className="page-wrap"><p className="eyebrow">CAKEORA · OWNER VIEW</p><h1 className="page-title">Today in the kitchen.</h1>{error && <p className="form-error" role="alert">{error}</p>}{!dashboard && !error && <p className="collection-state">Loading shop overview…</p>}{dashboard && <><div className="admin-metrics"><div><span>Orders today</span><strong>{dashboard.ordersToday}</strong></div><div><span>Active orders</span><strong>{dashboard.activeOrders}</strong></div><div><span>Pending payment</span><strong>{dashboard.pendingPayment}</strong></div><div><span>Paid today</span><strong>{money(dashboard.revenueToday)}</strong></div></div><section className="admin-inventory"><h2>Inventory</h2>{inventory.map((item) => <div className="delivery-line" key={`${item.cakeId}:${item.variantId}`}><span>{item.cakeName} · {item.variantName}</span><strong>{item.available} available · {item.status.replaceAll("_", " ")}</strong></div>)}</section></>}</main>;
}