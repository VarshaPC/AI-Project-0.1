import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useCart } from "../contexts/CartContext.jsx";

export default function SiteHeader() {
	const { user } = useAuth();
	const { count } = useCart();
	const [menuOpen, setMenuOpen] = useState(false);
	return <>
		<div className="announcement"><span>GOOD THINGS TAKE THE CAKE</span><span>Free delivery within 1 km on orders over Rs 1,500</span></div>
		<header className="site-header">
			<Link className="brand" to="/" aria-label="CAKEORA home"><span className="brand-mark">c</span><span>cakeora<small>BAKED FOR YOUR MOMENTS</small></span></Link>
			<nav className={`main-nav${menuOpen ? " open" : ""}`} aria-label="Main navigation">
				<NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
				<NavLink to="/cakes" onClick={() => setMenuOpen(false)}>All cakes</NavLink>
				<NavLink to="/orders" onClick={() => setMenuOpen(false)}>My orders</NavLink>
				<a href="/#story" onClick={() => setMenuOpen(false)}>Our story</a>
				<a href="/#footer" onClick={() => setMenuOpen(false)}>Contact</a>
			</nav>
			<div className="header-actions">
				<Link className="icon-button search-toggle" to="/cakes" aria-label="Search cakes" title="Search cakes"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg></Link>
				<Link className="account-button" to={user ? "/profile" : "/login"}>{user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}</Link>
				<Link className="cart-button" to="/cart" aria-label={`Shopping bag, ${count} items`}>Bag <span>{count}</span></Link>
				<button className="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}><span/><span/></button>
			</div>
		</header>
	</>;
}