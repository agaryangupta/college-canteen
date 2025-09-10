import { useEffect, useState } from "react";

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#FFA500";
      case "Ready":
        return "#007BFF";
      case "Completed":
        return "#28A745";
      default:
        return "#777";
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "'Poppins', sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>My Orders</h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center" }}>No past orders found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 20,
          }}
        >
          {orders.map((order) => (
            <div
              key={order.token}
              style={{
                borderRadius: 12,
                padding: 20,
                background: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <h2 style={{ marginBottom: 10 }}>Token #{order.token}</h2>
              <p style={{ margin: "5px 0" }}>
                <strong>Canteen:</strong> {order.canteen}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Date:</strong> {new Date(order.timestamp).toLocaleString()}
              </p>
              <p style={{ margin: "5px 0" }}>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color: "#fff",
                    background: getStatusColor(order.status || "Pending"),
                    padding: "3px 8px",
                    borderRadius: 12,
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {order.status || "Pending"}
                </span>
              </p>

              <ul style={{ listStyle: "none", padding: 0, marginTop: 10 }}>
                {order.items.map((item, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "5px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <h3 style={{ textAlign: "right", marginTop: 10 }}>Total: ₹{order.total}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
