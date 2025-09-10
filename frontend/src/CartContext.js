// src/CartContext.js
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]); // items: { id, name, price, quantity }
  const [currentCanteen, setCurrentCanteen] = useState(null);

  const addToCart = (item, canteen) => {
    // Block adding if different canteen already active
    if (currentCanteen && canteen !== currentCanteen) {
      alert("You can only order from one canteen at a time!");
      return;
    }

    // Add or increment using functional updater to avoid stale state
    setCart((prev) => {
      // If cart empty, set canteen and add item with quantity 1
      if (prev.length === 0) {
        setCurrentCanteen(canteen);
        return [{ ...item, quantity: 1 }];
      }

      // Same canteen: find existing item
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });

    // Ensure canteen set if it was null (defensive)
    if (!currentCanteen) setCurrentCanteen(canteen);
  };

  const increaseQuantity = (itemId) => {
    setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i)));
  };

  const decreaseQuantity = (itemId) => {
    setCart((prev) => {
      const updated = prev
        .map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);

      if (updated.length === 0) setCurrentCanteen(null);
      return updated;
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      if (updated.length === 0) setCurrentCanteen(null);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCurrentCanteen(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        currentCanteen,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
