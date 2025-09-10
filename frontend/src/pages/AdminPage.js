import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DEFAULT_MENUS = {
    main: [
        { id: "main-1", name: "Paneer Roll", price: 50 },
        { id: "main-2", name: "Cold Coffee", price: 40 },
        { id: "main-3", name: "Maggie", price: 35 },
        { id: "main-4", name: "Burger", price: 60 },
    ],
    nescafe: [
        { id: "nes-1", name: "Cappuccino", price: 70 },
        { id: "nes-2", name: "Cheese Sandwich", price: 55 },
    ],
    amul: [
        { id: "amul-1", name: "Amul Ice Cream", price: 30 },
        { id: "amul-2", name: "Milkshake", price: 50 },
    ],
};

function readMenus() {
    try {
        const raw = JSON.parse(localStorage.getItem("menus"));
        if (!raw) {
            localStorage.setItem("menus", JSON.stringify(DEFAULT_MENUS));
            return DEFAULT_MENUS;
        }
        return raw;
    } catch (e) {
        localStorage.setItem("menus", JSON.stringify(DEFAULT_MENUS));
        return DEFAULT_MENUS;
    }
}

function readOrders() {
    try {
        return JSON.parse(localStorage.getItem("orders")) || [];
    } catch (e) {
        localStorage.setItem("orders", JSON.stringify([]));
        return [];
    }
}

export default function AdminPage() {
    const [menus, setMenus] = useState(() => readMenus());
    const [canteenId, setCanteenId] = useState(Object.keys(readMenus())[0] || "main");
    const [orders, setOrders] = useState(() => readOrders());
    const [newItem, setNewItem] = useState({ name: "", price: "" });
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === "menus") setMenus(readMenus());
            if (e.key === "orders") setOrders(readOrders());
        };
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const saveMenus = (newMenus) => {
        setMenus(newMenus);
        localStorage.setItem("menus", JSON.stringify(newMenus));
    };

    const saveOrders = (newOrders) => {
        setOrders(newOrders);
        localStorage.setItem("orders", JSON.stringify(newOrders));
    };

    const addItem = () => {
        if (!newItem.name || newItem.price === "") return alert("Enter name & price");
        const id = `${canteenId}-${Date.now()}`;
        const item = { id, name: newItem.name.trim(), price: Number(newItem.price) || 0 };
        const updated = { ...menus, [canteenId]: [...(menus[canteenId] || []), item] };
        saveMenus(updated);
        setNewItem({ name: "", price: "" });
    };

    const startEdit = (it) => setEditingItem({ ...it });

    const saveEdit = () => {
        if (!editingItem.name || editingItem.price === "") return alert("Enter name & price");
        const updatedList = (menus[canteenId] || []).map((it) =>
            it.id === editingItem.id ? { ...it, name: editingItem.name.trim(), price: Number(editingItem.price) || 0 } : it
        );
        saveMenus({ ...menus, [canteenId]: updatedList });
        setEditingItem(null);
    };

    const deleteItem = (id) => {
        if (!window.confirm("Delete this menu item?")) return;
        const updatedList = (menus[canteenId] || []).filter((it) => it.id !== id);
        saveMenus({ ...menus, [canteenId]: updatedList });
    };

    const updateOrderStatus = (token, newStatus) => {
        const updated = orders.map((o) => (o.token === token ? { ...o, status: newStatus } : o));
        saveOrders(updated);
    };

    const deleteOrder = (token) => {
        if (!window.confirm("Delete this order?")) return;
        saveOrders(orders.filter((o) => o.token !== token));
    };

    const addCanteen = () => {
        const id = prompt("Enter canteen id (short, e.g. 'north'):");
        const name = prompt("Enter canteen display name:");
        if (!id || !name) return;
        if (menus[id]) return alert("Canteen id exists.");
        saveMenus({ ...menus, [id]: [] });
        setCanteenId(id);
    };

    const removeCanteen = (id) => {
        if (!window.confirm(`Delete canteen '${id}'? This will remove all its menu items too.`)) return;
        const newMenus = { ...menus };
        delete newMenus[id];
        saveMenus(newMenus);
        setCanteenId(Object.keys(newMenus)[0] || "");
    };

    return (
        <div style={{ padding: 30, fontFamily: "'Poppins', sans-serif", background: "#f9f9f9", minHeight: "100vh" }}>
            <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ textAlign: "center", color: "#2E8B57", marginBottom: 30 }}
            >
                🍔 Admin / Staff Panel
            </motion.h1>

            {/* Menus Section */}
            <section style={{ marginBottom: 40 }}>
                <h2 style={{ color: "#2E8B57" }}>Manage Menus</h2>
                <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                    {/* Canteen List */}
                    <div style={{ minWidth: 180, flexShrink: 0 }}>
                        <strong>Canteens</strong>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                            {Object.keys(menus).map((id) => (
                                <div key={id} style={{ display: "flex", gap: 6 }}>
                                    <button
                                        onClick={() => setCanteenId(id)}
                                        style={{
                                            flex: 1,
                                            padding: 8,
                                            borderRadius: 8,
                                            cursor: "pointer",
                                            background: id === canteenId ? "#2E8B57" : "#eee",
                                            color: id === canteenId ? "#fff" : "#333",
                                            border: "none",
                                            textTransform: "capitalize",
                                            fontWeight: 500,
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        {id}
                                    </button>
                                    <button
                                        onClick={() => removeCanteen(id)}
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: 8,
                                            border: "none",
                                            background: "#ff4d4f",
                                            color: "#fff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                onClick={addCanteen}
                                style={{
                                    marginTop: 10,
                                    padding: 8,
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    background: "#FFB347",
                                    border: "none",
                                    fontWeight: 500,
                                    color: "#fff",
                                }}
                            >
                                + Add Canteen
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div style={{ flex: 1, minWidth: 300 }}>
                        <h3 style={{ marginTop: 0 }}>
                            Items for <span style={{ textTransform: "capitalize" }}>{canteenId}</span>
                        </h3>

                        {/* Add new item */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                            <input
                                placeholder="Item name"
                                value={newItem.name}
                                onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
                                style={{ padding: 8, flex: 1, minWidth: 120, borderRadius: 8, border: "1px solid #ddd" }}
                            />
                            <input
                                placeholder="Price"
                                type="number"
                                value={newItem.price}
                                onChange={(e) => setNewItem((p) => ({ ...p, price: e.target.value }))}
                                style={{ padding: 8, width: 100, borderRadius: 8, border: "1px solid #ddd" }}
                            />
                            <button
                                onClick={addItem}
                                style={{
                                    padding: 8,
                                    borderRadius: 8,
                                    cursor: "pointer",
                                    background: "#2E8B57",
                                    color: "#fff",
                                    border: "none",
                                    fontWeight: 500,
                                }}
                            >
                                Add Item
                            </button>
                        </div>

                        {/* Menu List */}
                        <div>
                            {(menus[canteenId] || []).map((it) => (
                                <motion.div
                                    key={it.id}
                                    whileHover={{ scale: 1.02 }}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: 10,
                                        marginBottom: 6,
                                        borderRadius: 10,
                                        background: "#fff",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontWeight: 600 }}>{it.name}</div>
                                        <div style={{ color: "#555" }}>₹{it.price}</div>
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button
                                            onClick={() => startEdit(it)}
                                            style={{ padding: 6, borderRadius: 6, cursor: "pointer", background: "#FFD700", border: "none", fontWeight: 500 }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteItem(it.id)}
                                            style={{ padding: 6, borderRadius: 6, cursor: "pointer", background: "#ff4d4f", border: "none", color: "#fff" }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Edit item */}
                        {editingItem && (
                            <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd", borderRadius: 10, background: "#fff" }}>
                                <h4>Edit Item</h4>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                    <input
                                        value={editingItem.name}
                                        onChange={(e) => setEditingItem((p) => ({ ...p, name: e.target.value }))}
                                        style={{ padding: 8, flex: 1, minWidth: 120, borderRadius: 8, border: "1px solid #ddd" }}
                                    />
                                    <input
                                        type="number"
                                        value={editingItem.price}
                                        onChange={(e) => setEditingItem((p) => ({ ...p, price: e.target.value }))}
                                        style={{ padding: 8, width: 100, borderRadius: 8, border: "1px solid #ddd" }}
                                    />
                                    <button onClick={saveEdit} style={{ padding: 8, borderRadius: 8, background: "#2E8B57", color: "#fff", border: "none", cursor: "pointer" }}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditingItem(null)} style={{ padding: 8, borderRadius: 8, background: "#aaa", color: "#fff", border: "none", cursor: "pointer" }}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Orders Section */}
            <section>
                <h2 style={{ color: "#2E8B57" }}>Orders</h2>
                <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
                    {orders.length === 0 && <div>No orders yet.</div>}
                    {orders.map((o) => (
                        <motion.div
                            key={o.token}
                            whileHover={{ scale: 1.01 }}
                            style={{ background: "#fff", padding: 15, borderRadius: 12, boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <div>
                                    <div style={{ fontWeight: 700 }}>Token: {o.token}</div>
                                    <div style={{ color: "#555" }}>{new Date(o.timestamp).toLocaleString()}</div>
                                    <div style={{ color: "#555" }}>Canteen: {o.canteen}</div>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                    <select value={o.status} onChange={(e) => updateOrderStatus(o.token, e.target.value)} style={{ padding: 6, borderRadius: 6, border: "1px solid #ddd" }}>
                                        <option>Pending</option>
                                        <option>Ready</option>
                                        <option>Completed</option>
                                    </select>
                                    <button onClick={() => deleteOrder(o.token)} style={{ padding: 8, background: "#ff4d4f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <ul style={{ listStyle: "none", padding: 0, marginTop: 8 }}>
                                {o.items.map((it, idx) => (
                                    <li key={idx} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", padding: "6px 0" }}>
                                        <span>{it.name} × {it.quantity}</span>
                                        <span>₹{(it.price || 0) * (it.quantity || 1)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div style={{ textAlign: "right", marginTop: 8, fontWeight: 700 }}>Total: ₹{o.total}</div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
