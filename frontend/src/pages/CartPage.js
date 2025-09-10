import { useCart } from "../CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function CartPage() {
  const {
    cart,
    currentCanteen,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const openPaymentModal = () => {
    if (cart.length === 0) return alert("Cart is empty!");
    setShowModal(true);
  };

  const handlePayment = () => {
    setProcessing(true);

    setTimeout(() => {
      const now = new Date();
      const token = `${now.toISOString().slice(0,10).replace(/-/g,"")}-${Math.floor(100000 + Math.random() * 900000)}`;
      const order = { token, canteen: currentCanteen, items: cart, total, timestamp: now.toISOString(), status: "Pending" };
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];
      existingOrders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      clearCart();
      setProcessing(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        setShowModal(false);
        setPaymentSuccess(false);
        navigate("/token", { state: { token, canteen: currentCanteen, items: order.items } });
      }, 1500);
    }, 1500);
  };

  return (
    <div style={{ padding: 30, background: "#f9f9f9", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#2E8B57", marginBottom: 30 }}>Your Cart</h1>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No items in cart.</p>
      ) : (
        <div style={{ maxWidth: 700, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 20,
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  background: "white",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</div>
                  <div style={{ color: "#777", fontSize: 14 }}>₹{item.price} each</div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => decreaseQuantity(item.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>−</button>
                  <div style={{ minWidth: 30, textAlign: "center", fontWeight: 600 }}>{item.quantity}</div>
                  <button onClick={() => increaseQuantity(item.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>+</button>
                  <div style={{ fontWeight: 600 }}>₹{item.price * item.quantity}</div>
                  <button onClick={() => removeFromCart(item.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: "#ff4d4f", color: "#fff", cursor: "pointer" }}>Remove</button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div style={{ textAlign: "right", fontWeight: 700, fontSize: 18 }}>Total: ₹{total}</div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={openPaymentModal}
              disabled={processing}
              style={{
                padding: "12px 24px",
                borderRadius: 8,
                border: "none",
                background: processing ? "#999" : "#2E8B57",
                color: "#fff",
                fontSize: 16,
                fontWeight: 500,
                cursor: processing ? "not-allowed" : "pointer",
              }}
            >
              {processing ? "Processing Payment..." : "Pay & Place Order"}
            </button>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            style={{ width: 360, padding: 25, background: "#fff", borderRadius: 12, textAlign: "center", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }}
          >
            {processing ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 15 }}>
                <div style={{ width: 40, height: 40, border: "5px solid #ccc", borderTop: "5px solid #2E8B57", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                <p>Processing Payment...</p>
              </div>
            ) : paymentSuccess ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <h2 style={{ color: "#2E8B57" }}>Payment Successful ✅</h2>
                <p>Your order has been placed!</p>
              </div>
            ) : (
              <>
                <h2>Enter UPI ID</h2>
                <p>Total Amount: <strong>₹{total}</strong></p>
                <input type="text" placeholder="example@upi" style={{ width: "90%", padding: 10, borderRadius: 6, border: "1px solid #ccc", margin: "15px 0" }} />
                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  <button onClick={handlePayment} style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: "#2E8B57", color: "#fff", cursor: "pointer" }}>Pay Now</button>
                  <button onClick={() => setShowModal(false)} style={{ padding: "10px 20px", borderRadius: 6, border: "none", background: "#ccc", cursor: "pointer" }}>Cancel</button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default CartPage;
