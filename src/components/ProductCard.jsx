import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext.jsx";

export function availableStock(variant) {
	return Math.max(0, Number(variant?.stock || 0) - Number(variant?.reserved || 0));
}

export function imageFor(cake) {
	return cake?.images?.[0]?.url || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80";
}

export function money(value) {
	return `Rs ${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function ProductCard({ cake, index = 0 }) {
	const { add, items } = useCart();
	const variants = cake.variants || [];
	const firstVariant = [...variants].sort((a, b) => a.weightKg - b.weightKg)[0];
	const available = variants.reduce((sum, variant) => sum + availableStock(variant), 0);
	const readyVariant = variants.find((variant) => variant.instantEligible && availableStock(variant) > 0);
	const advanceVariant = variants.find((variant) => variant.advanceEligible);
	const badge = available === 0 ? "MADE TO ORDER" : available <= 2 ? "SMALL BATCH" : cake.category.toUpperCase();

	const inBagCount = (items || []).filter((item) => (item.cake?._id || item.cakeId || item.cake) === cake._id).reduce((sum, item) => sum + item.quantity, 0);

	return <article className="product-card" style={{ animationDelay: `${index * 35}ms` }}>
		<div className="product-image">
			<Link to={`/cakes/${cake._id}`} aria-label={`View ${cake.name}`}><img src={imageFor(cake)} alt={`${cake.name} cake`} loading="lazy"/></Link>
			<span className="product-tag">{badge}</span>
			{inBagCount > 0 && <span className="product-in-bag-tag">{inBagCount} in bag</span>}
			<button
				className={`quick-add ${inBagCount > 0 ? "has-in-bag" : ""}`}
				type="button"
				disabled={!readyVariant}
				aria-label={readyVariant ? `Add ${cake.name} to bag${inBagCount > 0 ? ` (${inBagCount} in bag)` : ""}` : `${cake.name} is not ready today`}
				onClick={() => readyVariant && add(cake, readyVariant).catch(() => {})}
			>
				{readyVariant ? (inBagCount > 0 ? `+${inBagCount}` : "+") : "·"}
			</button>
		</div>
		<div className="product-meta">
			<div className="product-meta-top">
				<h3>{cake.name}</h3>
				<span className="product-price">From {money(Math.min(...variants.map((variant) => variant.price)))}</span>
			</div>
			<p className="product-description">{cake.description}</p>
			<div className="product-foot">
				<span>{firstVariant?.name || "Size varies"} · {cake.category}</span>
				<span className="stock-status">
					<i className={`stock-dot ${available > 0 && available <= 2 ? "low" : ""}`}/>
					{available ? `${available} ready today` : advanceVariant ? "Made to order" : "Temporarily unavailable"}
				</span>
			</div>
			<div className="product-actions">
				<Link className="details-link" to={`/cakes/${cake._id}`}>View details</Link>
				{!available && advanceVariant ? <Link className="book-link" to={`/booking?cake=${cake._id}`}>Book in advance →</Link> : readyVariant ? <span className="details-link">Instant eligible</span> : null}
			</div>
		</div>
	</article>;
}