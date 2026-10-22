import CakeGrid from "../components/CakeGrid.jsx";
import { BookingBanner, Hero, PromiseStrip, ReviewBand, StorySection } from "../components/HomeSections.jsx";

export default function HomePage() {
	return <main id="home"><Hero/><PromiseStrip/><CakeGrid/><BookingBanner/><StorySection/><ReviewBand/></main>;
}