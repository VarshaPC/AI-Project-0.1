import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getApiError } from "../services/apiClient.js";

export default function ProfilePage() {
	const { user, updateProfile, addAddress, logout } = useAuth();
	const navigate = useNavigate();
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	async function saveProfile(event) {
		event.preventDefault(); setMessage(""); setError("");
		try { await updateProfile(Object.fromEntries(new FormData(event.currentTarget))); setMessage("Profile updated."); }
		catch (requestError) { setError(getApiError(requestError)); }
	}
	async function saveAddress(event) {
		event.preventDefault(); setMessage(""); setError("");
		try { await addAddress(Object.fromEntries(new FormData(event.currentTarget))); event.currentTarget.reset(); setMessage("Address saved."); }
		catch (requestError) { setError(getApiError(requestError)); }
	}
	async function signOut() { await logout(); navigate("/"); }
	return <main className="page-wrap"><p className="eyebrow">YOUR CAKEORA ACCOUNT</p><h1 className="page-title">Your details.</h1><div className="account-grid"><section className="account-section"><h2>Profile</h2><form className="dialog-form" onSubmit={saveProfile}><label>Full name<input name="name" defaultValue={user.name} minLength="2" maxLength="100" required/></label><label>Email address<input value={user.email} disabled readOnly/></label><label>Mobile number<input name="phone" defaultValue={user.phone} type="tel" pattern="[+]?[0-9]{8,15}" required/></label><button className="button button-dark">Save profile</button></form></section>
	<section className="account-section"><h2>Saved addresses</h2>{user.addresses?.length ? user.addresses.map((address) => <div className="address-row" key={address._id}><strong>{address.label || address.fullName}</strong><span>{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city} {address.postalCode}</span></div>) : <p className="availability-note">No saved addresses yet.</p>}<h3>Add an address</h3><form className="dialog-form" onSubmit={saveAddress}><label>Full name<input name="fullName" required/></label><label>Mobile number<input name="phone" type="tel" pattern="[+]?[0-9]{8,15}" required/></label><label>Address<input name="line1" required/></label><label>Apartment or area<input name="line2"/></label><label>City<input name="city" required/></label><label>Postal code<input name="postalCode" required/></label><button className="button button-dark">Save address</button></form></section></div>{message && <p className="form-success" role="status">{message}</p>}{error && <p className="form-error" role="alert">{error}</p>}<button className="text-button profile-logout" onClick={signOut}>Sign out →</button></main>;
}