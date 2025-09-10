import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function OwnerDashboard() {
  const { ownerId } = useParams(); // get owner ID from URL
  const [ownerOrders, setOwnerOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const filteredOrders = allOrders.filter(order => order.ownerId === ownerId);
    setOwnerOrders(filteredOrders);

    const revenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    setTotalRevenue(revenue);
  }, [ownerId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Owner Dashboard</h1>
      <h2>Orders for Owner: {ownerId}</h2>
      <h3>Total Revenue: ₹{totalRevenue}</h3>

      {ownerOrders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {ownerOrders.map((order, idx) => (
            <li
              key={idx}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px",
              }}
            >
              <strong>Token:</strong> {order.token} <br />
              <strong>Total:</strong> ₹{order.total} <br />
              <strong>Status:</strong> {order.status} <br />
              <strong>Canteen:</strong> {order.canteen} <br />
              <strong>Items:</strong>
              <ul style={{ paddingLeft: "15px" }}>
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} — ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OwnerDashboard;
