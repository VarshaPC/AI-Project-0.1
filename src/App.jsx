import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import SiteHeader from "./components/SiteHeader.jsx";
import SiteFooter from "./components/SiteFooter.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import CakesPage from "./pages/CakesPage.jsx";
import CakeDetailPage from "./pages/CakeDetailPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import OrdersPage from "./pages/OrdersPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import DeliveryPage from "./pages/DeliveryPage.jsx";

function AppLayout() {
	return <><SiteHeader/><Routes>
		<Route path="/" element={<HomePage/>}/>
		<Route path="/cakes" element={<CakesPage/>}/>
		<Route path="/cakes/:id" element={<CakeDetailPage/>}/>
		<Route path="/login" element={<AuthPage mode="login"/>}/>
		<Route path="/signup" element={<AuthPage mode="signup"/>}/>
		<Route path="/cart" element={<CartPage/>}/>
		<Route path="/delivery" element={<DeliveryPage/>}/>
		<Route element={<ProtectedRoute/>}>
			<Route path="/profile" element={<ProfilePage/>}/>
			<Route path="/booking" element={<BookingPage/>}/>
			<Route path="/checkout" element={<CheckoutPage/>}/>
			<Route path="/orders" element={<OrdersPage/>}/>
			<Route path="/orders/:id" element={<OrderDetailsPage/>}/>
		</Route>
		<Route element={<ProtectedRoute roles={["admin", "staff"]}/> }><Route path="/admin" element={<AdminPage/>}/></Route>
		<Route path="*" element={<main className="page-wrap"><p className="eyebrow">NOT FOUND</p><h1 className="page-title">This page wandered off.</h1></main>}/>
	</Routes><SiteFooter/></>;
}

export default function App() {
	return <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><AuthProvider><CartProvider><AppLayout/></CartProvider></AuthProvider></BrowserRouter>;
}