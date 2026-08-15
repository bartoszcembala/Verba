import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCurrentUser } from "../lib/queries/userQueries";
import Spinner from "./Spinner";

type ProtectedRouteProps = {
  adminOnly?: boolean;
};

function ProtectedRoute({ adminOnly = false }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, isLoadingUser } = useCurrentUser();

  if (isLoadingUser) return <Spinner />;

  if (!user) {
    const from = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
