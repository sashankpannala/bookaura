import { createContext, useContext, useEffect, useState } from "react";
import { fetchCart, saveCart, API_URL } from "../lib/api";
import { useAuth } from "./authContext";

const CartContext = createContext();
const CART_KEY = "bookaura_cart";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        if (user?.id) {
          const serverCart = await fetchCart();
          if (!cancelled) {
            setCartItems(serverCart);
            localStorage.setItem(CART_KEY, JSON.stringify(serverCart));
          }
        } else {
          const saved = localStorage.getItem(CART_KEY);
          if (saved && !cancelled) {
            setCartItems(JSON.parse(saved));
          }
        }
      } catch {
        const saved = localStorage.getItem(CART_KEY);
        if (saved && !cancelled) {
          setCartItems(JSON.parse(saved));
        }
      } finally {
        if (!cancelled) setCartReady(true);
      }
    }

    setCartReady(false);
    loadCart();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!cartReady) return;

    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));

    if (user?.id) {
      saveCart(cartItems).catch((err) => console.error("Cart sync failed:", err));
    }
  }, [cartItems, user?.id, cartReady]);

  const addToCart = (book) => {
    if (book.stock <= 0) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === book.id);

      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, book.stock);
        return prev.map((item) =>
          item.id === book.id ? { ...item, quantity: nextQty, stock: book.stock } : item
        );
      }

      return [...prev, { ...book, quantity: 1 }];
    });

    setIsCartOpen(true);
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const maxStock = item.stock ?? Infinity;
        return {
          ...item,
          quantity: Math.min(item.quantity + 1, maxStock),
        };
      })
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_KEY);

    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${API_URL}/api/cart`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        cartReady,
        addToCart,
        increaseQty,
        decreaseQty,
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
