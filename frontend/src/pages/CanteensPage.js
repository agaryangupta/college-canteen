import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function CanteensPage() {
  const [canteens, setCanteens] = useState([]);

  useEffect(() => {
    const savedMenus = JSON.parse(localStorage.getItem("menus")) || {};
    const mapped = Object.keys(savedMenus).map((id) => ({
      id,
      name: id.charAt(0).toUpperCase() + id.slice(1),
      description: `Welcome to ${id} canteen`,
    }));

    setCanteens(mapped);
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #FFE1A8, #FF6F61)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          textAlign: "center",
          color: "#fff",
          fontSize: "2.5rem",
          marginBottom: "30px",
          textShadow: "2px 2px 5px rgba(0,0,0,0.2)",
        }}
      >
        🍽️ Available Canteens
      </motion.h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
        }}
      >
        {canteens.length === 0 ? (
          <p style={{ color: "#fff", textAlign: "center", gridColumn: "1/-1" }}>
            No canteens available.
          </p>
        ) : (
          canteens.map((canteen) => (
            <motion.div
              key={canteen.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                borderRadius: "15px",
                padding: "20px",
                background: "#fff",
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <h2 style={{ color: "#2E8B57", marginBottom: "10px" }}>
                {canteen.name}
              </h2>
              <p style={{ color: "#555", marginBottom: "15px" }}>
                {canteen.description}
              </p>
              <Link to={`/menu/${canteen.id}`}>
                <button
                  style={{
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "10px",
                    background: "linear-gradient(90deg, #FF6F61, #FFB347)",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = 0.9;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = 1;
                  }}
                >
                  View Menu
                </button>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default CanteensPage;
