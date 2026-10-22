import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cakeService } from "../services/cakeService.js";
import { getApiError } from "../services/apiClient.js";
import { useCart } from "../contexts/CartContext.jsx";
import { availableStock, imageFor, money } from "../components/ProductCard.jsx";

export default function CakeDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { add } = useCart();
	const [cake, setCake] = useState(null);
	const [variantId, setVariantId] = useState("");
	const [flavour, setFlavour] = useState("");
	const [quantity, setQuantity] = useState(1);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		let active = true;
		cakeService.getById(id).then((result) => {
			if (!active) return;
			setCake(result);
			const first = result.variants?.find((variant) => availableStock(variant) > 0) || result.variants?.[0];
			setVariantId(first?._id || "");
			setFlavour(first?.flavours?.[0] || "");
		}).catch((requestError) => setError(getApiError(requestError))).finally(() => setLoading(false));
		return () => { active = false; };
	}, [id]);
	const variant = cake?.variants?.find((entry) => entry._id === variantId);
	const flavours = variant?.flavours || [];
	async function addSelected() {
		try { await add(cake, variant, { quantity, flavour }); navigate("/cart"); }
		catch (requestError) { setError(getApiError(requestError)); }
	}
	if (loading) return <main className="page-wrap"><p className="collection-state">Loading cake details…</p></main>;
	if (!cake) return <main className="page-wrap"><p className="collection-state error">{error || "Cake not found."}</p><Link to="/cakes">Back to cakes</Link></main>;
	return <main className="page-wrap"><p className="eyebrow">{cake.category}</p><section className="cake-detail-page"><img src={imageFor(cake)} alt={`${cake.name} cake`}/><div><h1 className="page-title">{cake.name}</h1><p className="detail-description">{cake.description}</p><p className="detail-price">{money(variant?.price)} {variant && <span>· {variant.name}</span>}</p>
		<label className="field-label">Size<select value={variantId} onChange={(event) => { const next = cake.variants.find((item) => item._id === event.target.value); setVariantId(event.target.value); setFlavour(next?.flavours?.[0] || ""); }}><option value="" disabled>Select a size</option>{cake.variants.map((item) => <option key={item._id} value={item._id}>{item.name} · {money(item.price)} · {availableStock(item)} ready</option>)}</select></label>
		{flavours.length > 0 && <label className="field-label">Flavour<select value={flavour} onChange={(event) => setFlavour(event.target.value)}>{flavours.map((name) => <option key={name}>{name}</option>)}</select></label>}
		<label className="field-label">Quantity<input type="number" min="1" max={Math.max(1, availableStock(variant))} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))}/></label>
		<p className="availability-note">{variant && availableStock(variant) > 0 ? `${availableStock(variant)} ready today${variant.instantEligible ? " · instant eligible" : ""}` : variant?.advanceEligible ? "Made to order · advance booking required" : "Temporarily unavailable"}</p>
		{error && <p className="form-error" role="alert">{error}</p>}
		<button className="button button-dark" type="button" disabled={!variant || availableStock(variant) < quantity} onClick={addSelected}>Add to bag <span>→</span></button> <Link className="book-link" to={`/booking?cake=${cake._id}`}>Book in advance</Link>
	</div></section></main>;
}