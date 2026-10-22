import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getApiError } from "../services/apiClient.js";

export default function AuthPage({ mode }) {
	const signup = mode === "signup";
	const { user, login, signup: register } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	if (user) return <Navigate to="/profile" replace/>;
	async function submit(event) {
		event.preventDefault();
		setError("");
		setBusy(true);
		const payload = Object.fromEntries(new FormData(event.currentTarget));
		try {
			if (signup) await register(payload);
			else await login({ email: payload.email, password: payload.password });
			navigate(location.state?.from?.pathname || "/profile", { replace: true });
		} catch (requestError) { setError(getApiError(requestError)); }
		finally { setBusy(false); }
	}
	return <main className="auth-page"><div className="auth-card"><p className="eyebrow">YOUR CAKEORA ACCOUNT</p><h1 className="page-title">{signup ? "Let’s make it official." : "A sweeter checkout."}</h1><p>{signup ? "Create an account to keep your orders and celebrations together." : "Sign in to sync your bag and plan a celebration."}</p><form className="dialog-form" onSubmit={submit}>
		{signup && <label>Full name<input name="name" autoComplete="name" minLength="2" maxLength="100" required/></label>}
		<label>Email address<input name="email" type="email" autoComplete="email" required/></label>
		{signup && <label>Mobile number<input name="phone" type="tel" autoComplete="tel" pattern="[+]?[0-9]{8,15}" required/></label>}
		<label>Password<input name="password" type="password" autoComplete={signup ? "new-password" : "current-password"} minLength={signup ? 10 : 1} required/></label>
		{signup && <label>Confirm password<input name="confirmPassword" type="password" autoComplete="new-password" minLength="10" required/></label>}
		{error && <p className="form-error" role="alert">{error}</p>}
		<button className="button button-dark" disabled={busy} type="submit">{busy ? "Please wait…" : signup ? "Create account" : "Sign in"}<span>→</span></button>
	</form><p className="auth-switch">{signup ? "Already have an account?" : "New to CAKEORA?"} <Link to={signup ? "/login" : "/signup"}>{signup ? "Sign in" : "Make an account"}</Link></p></div></main>;
}