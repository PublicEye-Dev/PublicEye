import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Array<"ADMIN" | "OPERATOR">;
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { token, role } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to="/login" state={{ from: location.pathname }} replace />
    );
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

