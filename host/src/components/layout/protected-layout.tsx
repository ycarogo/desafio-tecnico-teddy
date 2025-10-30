import { useAuth } from "../../context/AuthProvider/useAuth";
import { Navigate, Outlet } from "react-router";

export const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};
