import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { token, role } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
