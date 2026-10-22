import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";
import { cakeService } from "../services/cakeService.js";
import { getApiError } from "../services/apiClient.js";
import { imageFor, money } from "../components/ProductCard.jsx";

export default function CartPage() {
	const { items, subtotal, loading, setQuantity, remove } = useCart();
	const [cakes, setCakes] = useState([]);
	const [error, setError] = useState("");
	useEffect(() => { cakeService.list({ limit: 50 }).then(({ items: products }) => setCakes(products)).catch(() => {}); }, []);
	const cakeFor = (item) => item.cake && typeof item.cake === "object" ? item.cake : cakes.find((cake) => cake._id === (item.cakeId || item.cake));
	return <main className="page-wrap"><p className="eyebrow">THE GOOD STUFF</p><h1 className="page-title">Your bag.</h1>
		{loading && <p className="collection-state">Loading your bag…</p>}
		{error && <p className="form-error" role="alert">{error}</p>}
		{!loading && !items.length ? <div className="empty-cart"><p>Your bag’s taking a little breather.</p><Link className="button button-dark" to="/cakes">Find something lovely <span>→</span></Link></div> : <div className="cart-page-grid"><section className="cart-page-items">{items.map((item) => { const cake = cakeFor(item); const name = item.name || cake?.name || "CAKEORA cake"; const variant = item.variantName || item.variant?.name || "Selected size"; const amount = item.unitPrice ?? item.variant?.price ?? 0; const lineTotal = item.lineTotal ?? amount * item.quantity; return <article className="cart-page-line" key={item.id || item.key}><img src={imageFor(cake || {})} alt=""/><div className="cart-page-info"><h2>{name}</h2><p>{variant}{item.flavour ? ` · ${item.flavour}` : ""}</p><div className="quantity-control"><button type="button" aria-label="Remove one" onClick={() => setQuantity(item, item.quantity - 1).catch((e) => setError(getApiError(e)))}>−</button><span>{item.quantity}</span><button type="button" aria-label="Add one" onClick={() => setQuantity(item, item.quantity + 1).catch((e) => setError(getApiError(e)))}>+</button><button className="remove-button" type="button" onClick={() => remove(item).catch((e) => setError(getApiError(e)))}>Remove</button></div></div><strong>{money(lineTotal)}</strong></article>; })}</section><aside className="cart-page-summary"><h2>Order summary</h2><div><span>Subtotal</span><strong>{money(subtotal)}</strong></div><p>Pickup available. Delivery is shown only when CAKEORA’s service area is configured.</p><Link className="button button-dark" to="/checkout">Continue to checkout <span>→</span></Link></aside></div>}
	</main>;
}