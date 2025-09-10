import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { motion } from "framer-motion";

function TokenPage() {
  const { cart, clearCart, currentCanteen } = useCart();
  const location = useLocation();

  const [tokenNumber, setTokenNumber] = useState("");
  const [orderItems, setOrderItems] = useState([]);
  const [canteenName, setCanteenName] = useState("");

  useEffect(() => {
    let order;

    if (cart.length > 0) {
      const now = new Date();
      const date = now.toISOString().slice(0, 10).replace(/-/g, "");
      const rand = Math.floor(100000 + Math.random() * 900000);
      const newToken = `${date}-${rand}`;
      setTokenNumber(newToken);

      const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      order = {
        token: newToken,
        canteen: currentCanteen,
        items: cart,
        total,
        timestamp: now.toISOString(),
        status: "Pending",
      };

      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      setOrderItems(cart);
      setCanteenName(currentCanteen);
      clearCart();
    } else {
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      if (existingOrders.length > 0) {
        order = existingOrders[0];
        setTokenNumber(order.token);
        setOrderItems(order.items);
        setCanteenName(order.canteen);
      }
    }
  }, [cart, clearCart, currentCanteen, location]);

  if (!orderItems.length && !tokenNumber) {
    return <p>No order found. Please go back to menu.</p>;
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  return (
    <div style={{ padding: 30, fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", color: "#2E8B57", marginBottom: 20 }}
      >
        🎉 Payment Successful!
      </motion.h1>

      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ textAlign: "center" }}
      >
        Your Token Number:{" "}
        <span style={{ color: "#FF6600", fontWeight: "bold", fontSize: "1.5rem" }}>
          {tokenNumber}
        </span>
      </motion.h2>

      {canteenName && (
        <p style={{ textAlign: "center", fontStyle: "italic", color: "#777", marginBottom: 30 }}>
          Canteen: {canteenName}
        </p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: 20,
          borderRadius: 12,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "white",
        }}
      >
        <h3 style={{ marginBottom: 15 }}>Order Summary:</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {orderItems.map((it, idx) => (
            <li
              key={idx}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #eee",
              }}
            >
              <span>{it.name} × {it.quantity}</span>
              <span>₹{it.price * it.quantity}</span>
            </li>
          ))}
        </ul>
        <h2 style={{ textAlign: "right", marginTop: 15 }}>Total: ₹{totalAmount}</h2>
      </motion.div>

      <p style={{ textAlign: "center", marginTop: 30, color: "#555" }}>
        Please show this token number at the canteen counter to collect your food.
      </p>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <Link to="/canteens">
          <button
            style={{
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              background: "#2E8B57",
              color: "white",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Back to Canteens
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TokenPage;
