import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { CartProvider } from "../context/CartContext";
import AuthProvider from "../context/AuthContext";

export function renderWithProviders(ui, { route = "/" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>{ui}</CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

export const mockBook = {
  id: 1,
  title: "Atomic Habits",
  author: "James Clear",
  category: "Self Help",
  price: 16.99,
  image: "https://example.com/atomic.jpg",
  stock: 12,
  rating: 4.9,
  reviewCount: 240,
  isTopPick: true,
};
