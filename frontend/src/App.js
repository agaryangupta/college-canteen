import { Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import CanteensPage from "./pages/CanteensPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import TokenPage from "./pages/TokenPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import Navbar from "./components/Navbar";
import OwnerDashboard from "./pages/OwnerDashboard";


// ✅ Auth hook
function useAuth() {
  return JSON.parse(localStorage.getItem("user")); // null if not logged in
}

// ✅ Protected Route wrapper
function ProtectedRoute({ children, role }) {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch → redirect
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public (Login) */}
        <Route path="/" element={<LoginPage />} />

        {/* Student routes */}
        <Route
          path="/canteens"
          element={
            <ProtectedRoute role="student">
              <CanteensPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu/:canteenId"
          element={
            <ProtectedRoute role="student">
              <MenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="student">
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/token"
          element={
            <ProtectedRoute role="student">
              <TokenPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute role="student">
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route path="/owner/:ownerId" element={<OwnerDashboard />} />

        {/* Admin-only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
