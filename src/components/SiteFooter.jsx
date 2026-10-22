import { Link } from "react-router-dom";

export default function SiteFooter() {
	return <footer id="footer" className="site-footer"><div className="footer-main">
		<div className="footer-brand"><Link className="brand" to="/"><span className="brand-mark">b</span><span>bakeberry<small>BAKED FOR YOUR MOMENTS</small></span></Link><p>Good cake. Good people.<br/>That’s the whole recipe.</p></div>
		<div className="footer-column"><h3>THE LITTLE DETAILS</h3><Link to="/cakes">Shop all cakes</Link><Link to="/booking">Custom cakes</Link><a href="/#story">Our story</a><Link to="/delivery">Delivery & pickup</Link></div>
		<div className="footer-column"><h3>HERE TO HELP</h3><a href="mailto:hello@bakeberry.example">hello@bakeberry.example</a><a href="tel:+910000000000">+91 00000 00000</a><p>Every day, 9:00 am – 8:00 pm</p><Link to="/admin">Owner dashboard</Link></div>
		<Newsletter />
	</div><div className="footer-bottom"><span>© 2026 BAKEBERRY BAKERY</span><span>Delivery within 3 km of our kitchen · Pickup always welcome</span><span>Made with a little extra care <b>✳</b></span></div></footer>;
}

function Newsletter() {
	return <form className="newsletter" onSubmit={(event) => { event.preventDefault(); event.currentTarget.reset(); }}><label htmlFor="newsletter-email">A little sweetness in your inbox.</label><p>New bakes, seasonal things, and the occasional good excuse.</p><div><input id="newsletter-email" type="email" placeholder="Your email address" required/><button aria-label="Subscribe" type="submit">↗</button></div></form>;
}