import { Link } from "react-router-dom";

export function Hero() {
	return <section className="hero" aria-labelledby="hero-title">
		<div className="hero-copy">
			<p className="eyebrow"><span/> CAKES FOR THE GOOD PARTS</p>
			<h1 id="hero-title">A little joy,<br/>layer by <em>layer.</em></h1>
			<p className="hero-note">Thoughtful, small-batch cakes for the moments that deserve something sweet.</p>
			<div className="hero-actions">
				<Link className="button button-dark" to="/cakes">Find your cake <span aria-hidden="true">↗</span></Link>
				<Link className="text-button" to="/booking">Plan a celebration <span aria-hidden="true">→</span></Link>
			</div>
			<div className="hero-proof">
				<div className="proof-stars" aria-label="Rated 4.9 out of 5">★★★★★</div>
				<span><strong>4.9/5</strong> from 280+ happy moments</span>
			</div>
		</div>
		<div className="hero-photo" role="img" aria-label="Hand-finished celebration cake on a table">
			<img
				className="hero-image"
				src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1500&q=85"
				alt="Hand-finished strawberry celebration cake on a table"
				loading="eager"
			/>
			<div className="hero-image-overlay" aria-hidden="true" />
			<div className="photo-note">
				<span className="note-sparkle">✳</span>
				<span>Made fresh<br/>every morning</span>
			</div>
			<div className="hero-stamp">
				A CAKE<br/>FOR YOU
			</div>
		</div>
		<div className="hero-index"><span>01</span><span className="index-line"/><span>THE CELEBRATION EDIT</span></div>
	</section>;
}

export function PromiseStrip() {
	return <section className="promise-strip" aria-label="Shop promises"><p><span>✳</span> Baked fresh, every day</p><p><span>⌁</span> Ingredients with a story</p><p><span>◷</span> Delivered with care</p><p><span>♡</span> Made for sharing</p></section>;
}

export function BookingBanner() {
	return <section className="booking-banner"><div className="booking-image" role="img" aria-label="A hand-decorated celebration cake"/><div className="booking-copy"><p className="eyebrow">THE BIG DAY IS YOURS</p><h2>Dream it.<br/><em>We’ll bake it.</em></h2><p>One-of-a-kind cakes, made just for your moment. Tell us what you’re celebrating and we’ll make the sweet part simple.</p><Link className="button button-light" to="/booking">Start planning <span aria-hidden="true">↗</span></Link><small>Advance orders need at least 3 days’ notice.</small></div><span className="banner-doodle" aria-hidden="true">✳</span></section>;
}

export function StorySection() {
	return <section className="story section-wrap" id="story"><div className="story-mark" aria-hidden="true">b.</div><div className="story-copy"><p className="eyebrow">A SMALL SHOP WITH A BIG SOFT SPOT</p><h2>Good cake makes<br/>room for <em>everyone.</em></h2></div><p className="story-note">We’re an independent neighbourhood bakery, mixing familiar favourites with a little extra care. Every BAKEBERRY cake is baked in our own kitchen, finished by hand, and sent out ready to make somebody’s day.</p><a className="story-link" href="#footer">A little more about us <span aria-hidden="true">↗</span></a></section>;
}

export function ReviewBand() {
	return <section className="quote-band"><span className="quote-mark">“</span><blockquote>It tasted like the best part of the day, before the day had even started.</blockquote><p>PRIYA S. <span>·</span> CUSTOMER SINCE 2023</p><div className="quote-dots"><span className="current"/><span/><span/></div></section>;
}