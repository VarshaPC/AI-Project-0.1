const cakes = [
	{ id: "strawberry-cloud", name: "Strawberry Cloud", category: "Fruit", tags: ["Celebration", "Fruit"], price: 1450, size: "1 kg", stock: 6, image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80", description: "Vanilla sponge · fresh strawberry · soft cream", badge: "A LITTLE FAVOURITE", instant: true },
	{ id: "dark-chocolate", name: "Dark Side of Cocoa", category: "Chocolate", tags: ["Chocolate", "Celebration"], price: 1650, size: "1 kg", stock: 4, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80", description: "Dark chocolate · ganache · cocoa nib", badge: "BESTSELLER", instant: true },
	{ id: "lemon-olive", name: "Lemon & Olive Oil", category: "Fruit", tags: ["Fruit", "Eggless"], price: 980, size: "0.5 kg", stock: 3, image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=800&q=80", description: "Bright lemon · olive oil · vanilla glaze", badge: "EGGLESS", instant: true },
	{ id: "forest-floor", name: "Forest Floor", category: "Chocolate", tags: ["Chocolate", "Celebration"], price: 1350, size: "1 kg", stock: 0, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80", description: "Chocolate sponge · cherries · cloud cream", badge: "MADE TO ORDER", instant: false },
	{ id: "pistachio-rose", name: "Pistachio Rose", category: "Celebration", tags: ["Celebration", "Eggless"], price: 1780, size: "1 kg", stock: 2, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=800&q=80", description: "Pistachio sponge · rose cream · berries", badge: "SMALL BATCH", instant: true },
	{ id: "vanilla-berry", name: "Vanilla Berry Garden", category: "Fruit", tags: ["Fruit", "Eggless"], price: 1520, size: "1 kg", stock: 5, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80", description: "Madagascar vanilla · seasonal berries", badge: "EGGLESS", instant: true },
	{ id: "salted-caramel", name: "Salted Caramel Daydream", category: "Chocolate", tags: ["Chocolate", "Celebration"], price: 1690, size: "1 kg", stock: 1, image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80", description: "Brown butter · caramel · flaky sea salt", badge: "LAST ONE", instant: true },
	{ id: "little-clouds", name: "Little Birthday Clouds", category: "Celebration", tags: ["Celebration", "Eggless"], price: 2100, size: "1.5 kg", stock: 0, image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80", description: "Vanilla bean · hand-piped · your colours", badge: "MADE TO ORDER", instant: false }
];

const grid = document.querySelector("#product-grid");
const cart = new Map();
const overlay = document.querySelector("#overlay");
const cartPanel = document.querySelector("#cart-panel");
const dialog = document.querySelector("#dialog");
const dialogContent = document.querySelector("#dialog-content");
const toast = document.querySelector("#toast");
let activeCategory = "All";
let toastTimer;

function formatPrice(amount) {
	return `Rs ${amount.toLocaleString("en-IN")}`;
}

function renderProducts() {
	const search = document.querySelector("#cake-search").value.trim().toLowerCase();
	const visibleCakes = cakes.filter((cake) => {
		const categoryMatches = activeCategory === "All" || cake.tags.includes(activeCategory);
		const searchMatches = `${cake.name} ${cake.description} ${cake.category}`.toLowerCase().includes(search);
		return categoryMatches && searchMatches;
	});
	grid.innerHTML = visibleCakes.map((cake, index) => `
		<article class="product-card" style="animation-delay:${index * 45}ms">
			<div class="product-image"><img src="${cake.image}" alt="${cake.name} cake" loading="lazy"><span class="product-tag">${cake.badge}</span><button class="quick-add" type="button" data-add="${cake.id}" aria-label="Add ${cake.name} to bag" ${cake.stock === 0 ? "disabled" : ""}>${cake.stock === 0 ? "·" : "+"}</button></div>
			<div class="product-meta"><div class="product-meta-top"><h3>${cake.name}</h3><span class="product-price">${formatPrice(cake.price)}</span></div><p class="product-description">${cake.description}</p><div class="product-foot"><span>${cake.size} · ${cake.category}</span><span class="stock-status"><i class="stock-dot ${cake.stock > 0 && cake.stock <= 2 ? "low" : ""}"></i>${cake.stock ? `${cake.stock} ready today` : "Made to order"}</span></div><div class="product-actions"><button class="details-link" type="button" data-detail="${cake.id}">View details</button>${cake.stock === 0 ? `<button class="book-link" type="button" data-book="${cake.id}">Book in advance →</button>` : cake.instant ? `<span class="details-link">Instant eligible</span>` : ""}</div></div>
		</article>`).join("");
	document.querySelector("#empty-results").hidden = visibleCakes.length > 0;
}

function showToast(message) {
	toast.textContent = message;
	toast.classList.add("visible");
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => toast.classList.remove("visible"), 2400);
}

function updateCart() {
	const count = [...cart.values()].reduce((total, quantity) => total + quantity, 0);
	const total = [...cart.entries()].reduce((sum, [id, quantity]) => sum + cakes.find((cake) => cake.id === id).price * quantity, 0);
	document.querySelector("#cart-count").textContent = count;
	document.querySelector("#panel-count").textContent = `(${count})`;
	document.querySelector("#cart-subtotal").textContent = formatPrice(total);
	document.querySelector("#cart-empty").hidden = count > 0;
	document.querySelector("#cart-summary").hidden = count === 0;
	document.querySelector("#cart-items").innerHTML = [...cart.entries()].map(([id, quantity]) => {
		const cake = cakes.find((item) => item.id === id);
		return `<article class="cart-line"><img src="${cake.image}" alt=""><div><h3>${cake.name}</h3><p>${cake.size} · ${cake.category}</p><div class="quantity-control"><button type="button" data-quantity="${id}" data-change="-1" aria-label="Remove one ${cake.name}">−</button><span>${quantity}</span><button type="button" data-quantity="${id}" data-change="1" aria-label="Add one ${cake.name}">+</button></div></div><span class="line-price">${formatPrice(cake.price * quantity)}</span></article>`;
	}).join("");
}

function openPanel(panel) {
	closeSurfaces();
	overlay.hidden = false;
	panel.hidden = false;
	document.body.classList.add("has-modal");
}

function closeSurfaces() {
	overlay.hidden = true;
	cartPanel.hidden = true;
	dialog.hidden = true;
	document.body.classList.remove("has-modal");
}

function openDialog(content) {
	closeSurfaces();
	dialogContent.innerHTML = content;
	overlay.hidden = false;
	dialog.hidden = false;
	document.body.classList.add("has-modal");
}

function openAccount() {
	openDialog(`<p class="eyebrow">YOUR CAKEORA ACCOUNT</p><h2 id="dialog-title">A sweeter checkout.</h2><p>Sign in or create an account to keep your orders and celebrations together.</p><div class="demo-note">Account creation and secure sign-in need a server connection. This preview does not store passwords or personal details.</div><form class="dialog-form" id="account-form"><label>Email address<input type="email" placeholder="you@example.com" required></label><label>Password<input type="password" placeholder="At least 8 characters" minlength="8" required></label><button class="button button-dark" type="submit">Continue <span>→</span></button></form><p class="dialog-switch">New to CAKEORA? <button type="button" data-signup>Make an account</button></p>`);
}

function openBooking(cakeId = "") {
	const cake = cakes.find((item) => item.id === cakeId);
	const earliest = new Date();
	earliest.setDate(earliest.getDate() + 3);
	const minimumDate = `${earliest.getFullYear()}-${String(earliest.getMonth() + 1).padStart(2, "0")}-${String(earliest.getDate()).padStart(2, "0")}`;
	openDialog(`<p class="eyebrow">MADE FOR YOUR MOMENT</p><h2 id="dialog-title">Let’s plan something lovely.</h2><p>Choose a date at least three days from today. We’ll confirm the time and design with you.</p><form class="dialog-form" id="booking-form"><label>Your celebration cake<select name="cake" required>${cakes.map((item) => `<option value="${item.id}" ${cake?.id === item.id ? "selected" : ""}>${item.name} · ${formatPrice(item.price)}</option>`).join("")}</select></label><label>Celebration date<input name="date" type="date" min="${minimumDate}" required></label><label>Pickup or delivery<select name="fulfillment"><option>Pickup at our bakery</option><option>Delivery (address checked at checkout)</option></select></label><label>A note for the baker<textarea name="note" placeholder="Occasion, colours, message on the cake..."></textarea></label><div class="demo-note">Advance bookings require at least 3 calendar days’ notice. Date availability and shop capacity are confirmed by the bakery.</div><button class="button button-dark" type="submit">Request this date <span>→</span></button></form>`);
}

function openDetail(cakeId) {
	const cake = cakes.find((item) => item.id === cakeId);
	openDialog(`<div class="product-detail"><img src="${cake.image}" alt="${cake.name} cake"><div><p class="eyebrow">${cake.badge}</p><h2 id="dialog-title">${cake.name}</h2><p class="detail-price">${formatPrice(cake.price)} <span>· ${cake.size}</span></p><p class="dialog-copy">${cake.description}. Baked in our own kitchen and finished by hand. ${cake.stock ? `${cake.stock} ready today.` : "Made fresh to order."}</p><p class="dialog-copy">${cake.instant ? "Eligible for instant delivery within 3 km, subject to address and delivery availability." : "Available for advance booking with at least 3 days’ notice."}</p><button class="button button-dark" type="button" data-add="${cake.id}" ${cake.stock === 0 ? "disabled" : ""}>${cake.stock ? "Add to bag" : "Book for later"}<span>→</span></button></div></div>`);
}

function openCheckout() {
	const subtotal = [...cart.entries()].reduce((sum, [id, quantity]) => sum + cakes.find((cake) => cake.id === id).price * quantity, 0);
	openDialog(`<p class="eyebrow">ALMOST THE BEST PART</p><h2 id="dialog-title">Delivery details.</h2><p>Your bag is ${formatPrice(subtotal)} before delivery. Delivery is available within 3 km of our bakery.</p><div class="demo-note">Address distance, live stock reservation, payment and order confirmation require the secure CAKEORA backend. This preview cannot place or charge an order.</div><form class="dialog-form" id="checkout-form"><label>Full name<input name="name" autocomplete="name" required></label><label>Mobile number<input name="mobile" type="tel" autocomplete="tel" pattern="[0-9+()\\- ]{8,16}" required></label><label>Delivery address<textarea name="address" autocomplete="street-address" required></textarea></label><label>Order type<select name="type"><option>Instant delivery (in-stock cakes only)</option><option>Pickup</option></select></label><button class="button button-dark" type="submit">Check delivery & continue <span>→</span></button></form>`);
}

function openDelivery() {
	openDialog(`<p class="eyebrow">FROM OUR KITCHEN TO YOURS</p><h2 id="dialog-title">Delivery, with care.</h2><p>Instant delivery is available within 3 km of our one CAKEORA bakery for eligible, in-stock cakes during shop hours.</p><div class="delivery-line"><span>Instant delivery radius</span><strong>3 km from our bakery</strong></div><div class="delivery-line"><span>Free delivery</span><strong>Within 1 km over Rs 1,500</strong></div><div class="delivery-line"><span>Outside the delivery area</span><strong>Pickup or advance booking</strong></div><div class="demo-note">We check your address and delivery capacity before confirming an order. Exact fees and arrival times are shown at checkout.</div>`);
}

function openAdmin() {
	openDialog(`<p class="eyebrow">CAKEORA · OWNER VIEW</p><h2 id="dialog-title">Today in the kitchen.</h2><p>Demo stock overview. These numbers are sample catalogue data, not live inventory.</p><div class="admin-stock">${cakes.map((cake) => `<div class="delivery-line"><span>${cake.name}</span><strong>${cake.stock ? `${cake.stock} ready` : "Made to order"}</strong></div>`).join("")}</div><div class="demo-note">A protected admin dashboard, inventory changes, orders, booking capacity, reports and audit history need server-side accounts and a database.</div>`);
}

grid.addEventListener("click", (event) => {
	const addButton = event.target.closest("[data-add]");
	const detailButton = event.target.closest("[data-detail]");
	const bookButton = event.target.closest("[data-book]");
	if (addButton) {
		const cake = cakes.find((item) => item.id === addButton.dataset.add);
		if (!cake.stock) return;
		cart.set(cake.id, (cart.get(cake.id) || 0) + 1);
		updateCart();
		showToast(`${cake.name} added to your bag`);
	} else if (detailButton) openDetail(detailButton.dataset.detail);
	else if (bookButton) openBooking(bookButton.dataset.book);
});

document.querySelector("#cart-items").addEventListener("click", (event) => {
	const button = event.target.closest("[data-quantity]");
	if (!button) return;
	const id = button.dataset.quantity;
	const nextQuantity = (cart.get(id) || 0) + Number(button.dataset.change);
	if (nextQuantity < 1) cart.delete(id);
	else cart.set(id, nextQuantity);
	updateCart();
});

document.addEventListener("click", (event) => {
	const trigger = event.target.closest("[data-open]");
	if (trigger) {
		const action = trigger.dataset.open;
		if (action === "cart") { updateCart(); openPanel(cartPanel); }
		if (action === "account") openAccount();
		if (action === "booking") openBooking();
		if (action === "checkout") openCheckout();
		if (action === "delivery") openDelivery();
		if (action === "admin") openAdmin();
	}
	if (event.target.closest("[data-close]") || event.target === overlay) closeSurfaces();
	if (event.target.closest("[data-signup]")) showToast("Account creation will be available with secure account setup.");
	const categoryButton = event.target.closest("[data-category]");
	if (categoryButton) {
		activeCategory = categoryButton.dataset.category;
		document.querySelectorAll(".category-tab").forEach((tab) => tab.classList.toggle("selected", tab === categoryButton));
		renderProducts();
	}
});

dialog.addEventListener("click", (event) => {
	const addButton = event.target.closest("[data-add]");
	if (!addButton) return;
	const cake = cakes.find((item) => item.id === addButton.dataset.add);
	if (!cake.stock) return;
	cart.set(cake.id, (cart.get(cake.id) || 0) + 1);
	updateCart();
	closeSurfaces();
	showToast(`${cake.name} added to your bag`);
});

document.addEventListener("submit", (event) => {
	if (event.target.id === "account-form") {
		event.preventDefault();
		showToast("Sign-in is a preview only; no account data was sent.");
		closeSurfaces();
	}
	if (event.target.id === "booking-form") {
		event.preventDefault();
		const selectedDate = new Date(`${new FormData(event.target).get("date")}T00:00:00`);
		const earliest = new Date();
		earliest.setHours(0, 0, 0, 0);
		earliest.setDate(earliest.getDate() + 3);
		if (selectedDate < earliest) {
			event.target.elements.date.setCustomValidity("Please choose a date at least three days from today.");
			event.target.elements.date.reportValidity();
			return;
		}
		showToast("Date request noted. The bakery must confirm availability.");
		closeSurfaces();
	}
	if (event.target.id === "checkout-form") {
		event.preventDefault();
		showToast("Checkout is a preview; no order or payment was created.");
	}
	if (event.target.id === "newsletter-form") {
		event.preventDefault();
		document.querySelector("#newsletter-feedback").textContent = "Thanks for stopping by. Newsletter signup needs a connected service.";
		event.target.reset();
	}
});

document.querySelector("#cake-search").addEventListener("input", renderProducts);
document.querySelector(".search-toggle").addEventListener("click", () => {
	document.querySelector("#cakes").scrollIntoView({ behavior: "smooth" });
	document.querySelector("#cake-search").focus({ preventScroll: true });
});
document.querySelector(".menu-toggle").addEventListener("click", (event) => {
	const nav = document.querySelector(".main-nav");
	const expanded = event.currentTarget.getAttribute("aria-expanded") === "true";
	event.currentTarget.setAttribute("aria-expanded", String(!expanded));
	nav.classList.toggle("open", !expanded);
});
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") closeSurfaces();
});

renderProducts();
updateCart();
