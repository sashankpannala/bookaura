import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CartProvider, useCart } from "./CartContext";
import AuthProvider from "./AuthContext";
import { mockBook } from "../test/test-utils";

const wrapper = ({ children }) => (
  <AuthProvider>
    <CartProvider>{children}</CartProvider>
  </AuthProvider>
);

describe("CartContext", () => {
  it("starts empty with drawer closed", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.cartItems).toEqual([]);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
    expect(result.current.isCartOpen).toBe(false);
  });

  it("adds items and opens the drawer", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(mockBook));

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartItems[0].quantity).toBe(1);
    expect(result.current.cartCount).toBe(1);
    expect(result.current.subtotal).toBeCloseTo(16.99);
    expect(result.current.isCartOpen).toBe(true);
  });

  it("merges duplicate books and updates quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockBook);
      result.current.addToCart(mockBook);
      result.current.increaseQty(mockBook.id);
    });

    expect(result.current.cartItems[0].quantity).toBe(3);
    expect(result.current.cartCount).toBe(3);
    expect(result.current.subtotal).toBeCloseTo(50.97);
  });

  it("decreases quantity and removes at zero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(mockBook));
    act(() => result.current.decreaseQty(mockBook.id));

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
  });

  it("removes items and clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addToCart(mockBook));
    act(() => result.current.removeFromCart(mockBook.id));
    expect(result.current.cartItems).toHaveLength(0);

    act(() => result.current.addToCart(mockBook));
    act(() => result.current.clearCart());
    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.subtotal).toBe(0);
  });
});
