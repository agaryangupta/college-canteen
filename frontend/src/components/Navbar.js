import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #FF6F61, #FFB347)",
        padding: "12px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <h2 style={{ color: "#fff", fontSize: "1.5rem", cursor: "pointer" }}>
        🍴 ABES Canteen
      </h2>

      <div style={{ display: "flex", alignItems: "center" }}>
        {user.role === "student" && (
          <>
            <Link
              to="/canteens"
              style={linkStyle}
            >
              Canteens
            </Link>
            <Link
              to="/cart"
              style={linkStyle}
            >
              Cart
            </Link>
            <Link
              to="/orders"
              style={linkStyle}
            >
              My Orders
            </Link>
          </>
        )}

        {user.role === "admin" && (
          <Link
            to="/admin"
            style={linkStyle}
          >
            Admin Panel
          </Link>
        )}

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            border: "none",
            borderRadius: "8px",
            background: "#fff",
            color: "#FF6F61",
            fontWeight: "bold",
            marginLeft: "15px",
            cursor: "pointer",
            transition: "all 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#FF6F61";
            e.target.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#fff";
            e.target.style.color = "#FF6F61";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

// Common link style for navbar links
const linkStyle = {
  color: "#fff",
  marginRight: "20px",
  textDecoration: "none",
  fontWeight: "500",
  transition: "color 0.2s",
  cursor: "pointer",
};

export default Navbar;
