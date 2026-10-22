import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { cakeService } from "../services/cakeService.js";
import { bookingService } from "../services/bookingService.js";
import { getApiError } from "../services/apiClient.js";
import { useCart } from "../contexts/CartContext.jsx";
import { money } from "../components/ProductCard.jsx";

function localDateOffset(days) {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function BookingPage() {
	const [searchParams] = useSearchParams();
	const cakeIdFromUrl = searchParams.get("cake") || "";
	const location = useLocation();
	const navigate = useNavigate();
	const { add } = useCart();
	const [cakes, setCakes] = useState([]);
	const [selected, setSelected] = useState("");
	const [date, setDate] = useState("");
	const [slot, setSlot] = useState("");
	const [slots, setSlots] = useState([]);
	const [note, setNote] = useState("");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	const choices = useMemo(() => cakes.flatMap((cake) => cake.variants.filter((variant) => variant.advanceEligible).map((variant) => ({ cake, variant }))), [cakes]);
	useEffect(() => {
		cakeService.list({ limit: 50 }).then(({ items }) => {
			setCakes(items);
			const matching = items.find((cake) => cake._id === cakeIdFromUrl);
			const first = matching?.variants.find((variant) => variant.advanceEligible) || items.flatMap((cake) => cake.variants.filter((variant) => variant.advanceEligible).map((variant) => ({ cake, variant })))[0]?.variant;
			if (first) setSelected(`${matching?._id || items.find((cake) => cake.variants.includes(first))?._id}|${first._id}`);
		}).catch((requestError) => setError(getApiError(requestError)));
	}, [cakeIdFromUrl]);
	useEffect(() => {
		if (!date) { setSlots([]); return; }
		bookingService.availability(date).then((available) => { setSlots(available.filter((entry) => entry.available)); setSlot(""); }).catch((requestError) => { setError(getApiError(requestError)); setSlots([]); });
	}, [date]);
	const [cakeId, variantId] = selected.split("|");
	async function submit(event) {
		event.preventDefault(); setBusy(true); setError("");
		try {
			await bookingService.validate({ cakeId, variantId, date, slot });
			const { cake, variant } = choices.find((entry) => entry.cake._id === cakeId && entry.variant._id === variantId);
			await add(cake, variant, { quantity: 1, customization: note });
			navigate("/checkout", { state: { booking: { date, slot }, from: location.pathname } });
		} catch (requestError) { setError(getApiError(requestError)); }
		finally { setBusy(false); }
	}
	return <main className="page-wrap form-page"><p className="eyebrow">MADE FOR YOUR MOMENT</p><h1 className="page-title">Let’s plan something lovely.</h1><p className="page-intro">Choose a cake, then pick an available date at least three calendar days ahead.</p><form className="booking-form dialog-form" onSubmit={submit}>
		<label>Cake and size<select value={selected} onChange={(event) => setSelected(event.target.value)} required><option value="" disabled>Select a cake</option>{choices.map(({ cake, variant }) => <option key={`${cake._id}:${variant._id}`} value={`${cake._id}|${variant._id}`}>{cake.name} · {variant.name} · {money(variant.price)}</option>)}</select></label>
		<label>Pickup date<input type="date" min={localDateOffset(3)} value={date} onChange={(event) => setDate(event.target.value)} required/></label>
		<label>Pickup time<select value={slot} onChange={(event) => setSlot(event.target.value)} required disabled={!slots.length}><option value="">{date ? slots.length ? "Choose an available time" : "No available slots" : "Choose a date first"}</option>{slots.map((entry) => <option key={entry.slot} value={entry.slot}>{entry.slot} · {entry.remaining} spots</option>)}</select></label>
		<label>Note for the baker<textarea value={note} maxLength="300" onChange={(event) => setNote(event.target.value)} placeholder="Occasion, colours, message on the cake…"/></label>
		{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark" type="submit" disabled={busy || !selected || !slot}>{busy ? "Checking availability…" : "Continue to checkout"}<span>→</span></button>
	</form></main>;
}