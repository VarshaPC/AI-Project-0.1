import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function ProtectedRoute({ roles }) {
	const { user, loading } = useAuth();
	const location = useLocation();
	if (loading) return <main className="page-wrap"><p className="collection-state">Checking your CAKEORA session…</p></main>;
	if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
	if (roles && !roles.includes(user.role)) return <Navigate to="/profile" replace />;
	return <Outlet/>;
}