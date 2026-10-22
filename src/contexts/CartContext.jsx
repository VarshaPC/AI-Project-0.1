import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { cartService } from "../services/cartService.js";

const CartContext = createContext(null);
const GUEST_CART_KEY = "cakeora-guest-cart";
let guestCartSyncPromise = null;

function readGuestCart() {
	try { return JSON.parse(localStorage.getItem(GUEST_CART_KEY) || "[]"); }
	catch { return []; }
}

function persistGuestCart(items) {
	localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function CartProvider({ children }) {
	const { user, loading: authLoading } = useAuth();
	const [items, setItems] = useState(readGuestCart);
	const [subtotal, setSubtotal] = useState(0);
	const [loading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		if (!user) {
			const guest = readGuestCart();
			setItems(guest);
			setSubtotal(guest.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0));
			return guest;
		}
		setLoading(true);
		try {
			const cart = await cartService.get();
			setItems(cart.items || []);
			setSubtotal(cart.subtotal || 0);
			return cart.items || [];
		} finally { setLoading(false); }
	}, [user]);

	useEffect(() => {
		if (authLoading) return;
		let active = true;
		async function sync() {
			if (user) {
					if (!guestCartSyncPromise) {
						guestCartSyncPromise = (async () => {
							const guest = readGuestCart();
							for (const item of guest) {
								await cartService.add({ cakeId: item.cake._id, variantId: item.variant._id, quantity: item.quantity, flavour: item.flavour, customization: item.customization });
							}
							if (guest.length && JSON.stringify(readGuestCart()) === JSON.stringify(guest)) localStorage.removeItem(GUEST_CART_KEY);
						})().finally(() => { guestCartSyncPromise = null; });
					}
					await guestCartSyncPromise;
					await refresh();
			} else await refresh();
		}
		sync().catch(() => { if (active) refresh().catch(() => {}); });
		return () => { active = false; };
	}, [user, authLoading, refresh]);

	const value = useMemo(() => ({
		items,
		subtotal,
		loading,
		count: items.reduce((sum, item) => sum + item.quantity, 0),
		refresh,
		async add(cake, variant, { quantity = 1, flavour = "", customization = "" } = {}) {
			if (user) {
				await cartService.add({ cakeId: cake._id || cake.cakeId, variantId: variant._id || variant.variantId, quantity, flavour, customization });
				return refresh();
			}
			const key = `${cake._id}:${variant._id}:${flavour}:${customization}`;
			const guest = readGuestCart();
			const existing = guest.find((item) => item.key === key);
			if (existing) existing.quantity += quantity;
			else guest.push({ key, cake, variant, quantity, flavour, customization });
			persistGuestCart(guest);
			setItems(guest);
			setSubtotal(guest.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0));
			return guest;
		},
		async setQuantity(item, quantity) {
			if (user) await cartService.setQuantity(item.id, quantity);
			else {
				const guest = readGuestCart().map((entry) => entry.key === item.key ? { ...entry, quantity } : entry).filter((entry) => entry.quantity > 0);
				persistGuestCart(guest);
			}
			return refresh();
		},
		async remove(item) {
			if (user) await cartService.remove(item.id);
			else persistGuestCart(readGuestCart().filter((entry) => entry.key !== item.key));
			return refresh();
		},
		async clear() {
			if (user) await cartService.clear();
			else localStorage.removeItem(GUEST_CART_KEY);
			return refresh();
		}
	}), [items, subtotal, loading, user, refresh]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used within CartProvider");
	return context;
}