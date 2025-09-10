// src/components/ProtectedRoute.js
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    // not logged in → back to login
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    // role mismatch (student trying admin page or vice versa)
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
