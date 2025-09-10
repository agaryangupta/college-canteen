import { useCart } from "../CartContext";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DEFAULT_MENUS = {
    main: [
      { id: 1, name: "Paneer Roll", price: 50 },
      { id: 2, name: "Cold Coffee", price: 40 },
      { id: 3, name: "Maggie", price: 35 },
      { id: 4, name: "Burger", price: 60 },
    ],
    nescafe: [
      { id: 5, name: "Cappuccino", price: 70 },
      { id: 6, name: "Cheese Sandwich", price: 55 },
      { id: 7, name: "Brownie", price: 80 },
    ],
    amul: [
      { id: 8, name: "Amul Ice Cream", price: 30 },
      { id: 9, name: "Milkshake", price: 50 },
      { id: 10, name: "Cheese Toast", price: 40 },
    ],
};

function MenuPage() {
    const { canteenId } = useParams();
    const { cart, addToCart, currentCanteen } = useCart();
    const [menu, setMenu] = useState([]);

    useEffect(() => {
        const storedMenus = JSON.parse(localStorage.getItem("menus")) || DEFAULT_MENUS;
        setMenu(storedMenus[canteenId] || []);
    }, [canteenId]);

    const handleAdd = (item) => {
        addToCart(item, canteenId);
    };

    return (
        <div style={{ padding: 30, fontFamily: "'Poppins', sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
            <h1 style={{ textTransform: "capitalize", color: "#2E8B57", textAlign: "center", marginBottom: 30 }}>
                {canteenId ? `${canteenId} Menu` : "Menu"}
            </h1>

            {/* Menu Grid */}
            {menu.length === 0 ? (
                <p style={{ textAlign: "center", color: "#555" }}>No menu available for this canteen.</p>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
                    {menu.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 1.03 }}
                            style={{
                                background: "#fff",
                                padding: 20,
                                borderRadius: 12,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                            }}
                        >
                            {/* Placeholder image */}
                            <div style={{ height: 120, marginBottom: 12, background: "#f0f0f0", borderRadius: 8, display: "flex", justifyContent: "center", alignItems: "center", fontSize: 50 }}>
                                🍴
                            </div>

                            <h2 style={{ fontSize: 18, marginBottom: 8 }}>{item.name}</h2>
                            <p style={{ fontWeight: 600, color: "#2E8B57", marginBottom: 12 }}>₹{item.price}</p>

                            <button
                                onClick={() => handleAdd(item)}
                                style={{
                                    padding: "10px 16px",
                                    border: "none",
                                    borderRadius: 8,
                                    background: "#FF6600",
                                    color: "#fff",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                            >
                                Add to Cart
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Cart Preview */}
            {cart.length > 0 && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        marginTop: 40,
                        maxWidth: 500,
                        marginLeft: "auto",
                        marginRight: "auto",
                        padding: 25,
                        borderRadius: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                        background: "#fff",
                    }}
                >
                    <h2 style={{ marginBottom: 8 }}>Your Selection</h2>
                    {currentCanteen && <p style={{ color: "#555" }}>Canteen: {currentCanteen}</p>}

                    <ul style={{ listStyle: "none", padding: 0 }}>
                        {cart.map((it, idx) => (
                            <li key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                                    <div style={{ color: "#777", fontSize: 13 }}>₹{it.price} × {it.quantity}</div>
                                </div>
                                <div style={{ fontWeight: 600 }}>₹{it.price * it.quantity}</div>
                            </li>
                        ))}
                    </ul>

                    <div style={{ textAlign: "center", marginTop: 20 }}>
                        <Link to="/cart">
                            <button
                                style={{
                                    padding: "12px 20px",
                                    border: "none",
                                    borderRadius: 8,
                                    background: "#2E8B57",
                                    color: "#fff",
                                    fontWeight: 500,
                                    cursor: "pointer",
                                }}
                            >
                                Go to Cart
                            </button>
                        </Link>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

export default MenuPage;
