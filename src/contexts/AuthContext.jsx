import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService.js";
import { clearAccessToken, restoreSessionOnce, setAccessToken } from "../services/apiClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let active = true;
		restoreSessionOnce(async () => {
			const { accessToken } = await authService.refresh();
			setAccessToken(accessToken);
			return authService.me();
		})
			.then((profile) => { if (active) setUser(profile); })
			.catch(() => { clearAccessToken(); if (active) setUser(null); })
			.finally(() => { if (active) setLoading(false); });
		const expire = () => setUser(null);
		window.addEventListener("bakeberry:session-expired", expire);
		return () => {
			active = false;
			window.removeEventListener("bakeberry:session-expired", expire);
		};
	}, []);

	async function authenticate(action, payload) {
		const result = await action(payload);
		setAccessToken(result.accessToken);
		setUser(result.user);
		return result.user;
	}

	const value = useMemo(() => ({
		user,
		loading,
		isAuthenticated: Boolean(user),
		login: (payload) => authenticate(authService.login, payload),
		signup: (payload) => authenticate(authService.signup, payload),
		async logout() {
			try { await authService.logout(); } finally { clearAccessToken(); setUser(null); }
		},
		async updateProfile(payload) {
			const updated = await authService.updateProfile(payload);
			setUser(updated);
			return updated;
		},
		async addAddress(payload) {
			const addresses = await authService.addAddress(payload);
			setUser((current) => ({ ...current, addresses }));
			return addresses;
		}
	}), [user, loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}