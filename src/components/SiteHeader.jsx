import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

export default function SiteHeader() {
	const { user } = useAuth();
	const { count, toast, bagBumping } = useCart();
	const [menuOpen, setMenuOpen] = useState(false);
	return <>
		<div className="announcement"><span>GOOD THINGS TAKE THE CAKE</span><span>Free delivery within 1 km on orders over Rs 1,500</span></div>
		<header className="site-header">
			<Link className="brand" to="/" aria-label="BAKEBERRY home"><span className="brand-mark">b</span><span>bakeberry<small>BAKED FOR YOUR MOMENTS</small></span></Link>
			<nav className={`main-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
				<NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
				<NavLink to="/cakes" onClick={() => setMenuOpen(false)}>All cakes</NavLink>
				<NavLink to="/orders" onClick={() => setMenuOpen(false)}>My orders</NavLink>
				<a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
				<a href="/#footer" onClick={() => setMenuOpen(false)}>Contact</a>
			</nav>
			<div className="header-actions">
				<Link className="icon-button search-toggle" to="/cakes" aria-label="Search cakes" title="Search cakes">
					<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>
				</Link>
				<Link className="account-button" to={user ? "/profile" : "/login"} aria-label={user ? `Profile for ${user.name}` : "Sign in to your account"}>
					<svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
						<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
						<circle cx="12" cy="7" r="4"/>
					</svg>
					<span>{user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}</span>
				</Link>
				<Link className={`cart-button ${bagBumping ? "cart-button-bumping" : ""}`} to="/cart" aria-label={`Shopping bag, ${count} items`}>
					<div className="cart-icon-wrap">
						<svg className="header-icon" viewBox="0 0 24 24" aria-hidden="true">
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
							<line x1="3" y1="6" x2="21" y2="6"/>
							<path d="M16 10a4 4 0 0 1-8 0"/>
						</svg>
						<span className={`cart-icon-badge ${bagBumping ? "bump" : ""}`}>{count}</span>
					</div>
					<span className="cart-label">Bag</span>
				</Link>
				<button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span/><span/></button>
			</div>
		</header>
		{toast && <div className={`toast visible`} role="status" aria-live="polite"><span>✓</span> {toast}</div>}
	</>;
}