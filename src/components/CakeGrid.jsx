import { useEffect, useState } from "react";
import { cakeService } from "../services/cakeService.js";
import { getApiError } from "../services/apiClient.js";
import ProductCard from "./ProductCard.jsx";

const categories = ["All", "Celebration", "Chocolate", "Fruit", "Eggless"];

export default function CakeGrid({ title = true }) {
	const [cakes, setCakes] = useState([]);
	const [category, setCategory] = useState("All");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		let active = true;
		const timer = setTimeout(() => {
			setLoading(true);
			cakeService.list({ category, search }).then((result) => {
				if (active) { setCakes(result.items || []); setError(""); }
			}).catch((requestError) => { if (active) setError(getApiError(requestError)); })
				.finally(() => { if (active) setLoading(false); });
		}, search ? 250 : 0);
		return () => { active = false; clearTimeout(timer); };
	}, [category, search]);

	return <section className="collection section-wrap" id="cakes" aria-labelledby="collection-title">
		<div className="section-heading"><div><p className="eyebrow">A VERY GOOD PLACE TO START</p><h2 id="collection-title">{title ? <>Find your <em>happy.</em></> : <>All the <em>good stuff.</em></>}</h2></div><span className="all-link">{cakes.length} cakes from our kitchen</span></div>
		<div className="collection-tools"><div className="category-tabs" role="group" aria-label="Filter cakes">{categories.map((value) => <button key={value} className={`category-tab${category === value ? " selected" : ""}`} type="button" aria-pressed={category === value} onClick={() => setCategory(value)}>{value === "All" ? "All cakes" : value === "Fruit" ? "Fruit & cream" : value}{value === "All" && <span>{String(cakes.length).padStart(2, "0")}</span>}</button>)}</div><label className="search-field"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg><input type="search" placeholder="Find a flavour" aria-label="Search cakes by name or flavour" value={search} onChange={(event) => setSearch(event.target.value)}/></label></div>
		{loading && <p className="collection-state" role="status">Loading cakes from CAKEORA…</p>}
		{error && <p className="collection-state error" role="alert">{error} <button type="button" onClick={() => setSearch((value) => `${value} `)}>Try again</button></p>}
		{!loading && !error && !cakes.length && <p className="empty-results">No cakes found. Try another flavour or category.</p>}
		<div className="product-grid" aria-live="polite">{cakes.map((cake, index) => <ProductCard key={cake._id} cake={cake} index={index}/>)}</div>
	</section>;
}