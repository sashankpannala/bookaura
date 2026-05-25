import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router";
import Checkout from "./Checkout";
import Success from "./Success";
import { renderWithProviders, mockBook } from "../test/test-utils";
import { CartProvider } from "../context/CartContext";
import AuthProvider from "../context/AuthContext";

function CheckoutWithCart({ items = [mockBook], route = "/checkout" }) {
  localStorage.setItem(
    "bookaura_cart",
    JSON.stringify(items.map((item) => ({ ...item, quantity: 1 })))
  );

  return (
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Checkout page", () => {
  it("shows empty cart message", async () => {
    renderWithProviders(<Checkout />, { route: "/checkout" });

    await waitFor(() => {
      expect(screen.getByText("Checkout")).toBeInTheDocument();
    });

    expect(screen.getByText("Your cart is empty.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /browse books/i })).toHaveAttribute(
      "href",
      "/#books"
    );
  });

  it("calculates totals with tax and shipping", async () => {
    render(<CheckoutWithCart />);

    await waitFor(() => {
      expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    });

    expect(screen.getByText("$4.99")).toBeInTheDocument();
  });

  it("applies free shipping over $50", async () => {
    const expensive = { ...mockBook, id: 99, price: 60 };
    render(<CheckoutWithCart items={[expensive]} />);

    await waitFor(() => {
      expect(screen.getByText("Free")).toBeInTheDocument();
    });
  });

  it("places order and navigates to success", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      text: async () => JSON.stringify({ orderId: 1 }),
    });

    render(<CheckoutWithCart />);

    await waitFor(() => screen.getByText("Atomic Habits"));

    await user.type(
      screen.getByPlaceholderText("customer@email.com"),
      "buyer@test.com"
    );
    await user.type(screen.getByPlaceholderText("555-123-4567"), "5551234567");
    await user.type(screen.getByPlaceholderText("123 Main St"), "123 Main St");
    await user.type(screen.getByPlaceholderText("New York"), "New York");
    await user.type(screen.getByPlaceholderText("NY"), "NY");
    await user.type(screen.getAllByPlaceholderText("10001")[0], "10001");
    const nameFields = screen.getAllByPlaceholderText("Jane Doe");
    await user.type(nameFields[0], "Buyer Test");
    await user.type(nameFields[1], "Buyer Test");
    await user.type(
      screen.getByPlaceholderText("4242 4242 4242 4242"),
      "4242424242424242"
    );
    await user.type(screen.getByPlaceholderText("MM/YY"), "1230");
    await user.type(screen.getByPlaceholderText("123"), "123");
    await user.type(screen.getAllByPlaceholderText("10001")[1], "10001");
    await user.click(screen.getByRole("button", { name: /place order/i }));

    await waitFor(() => {
      expect(screen.getByText("Order placed successfully")).toBeInTheDocument();
    });
  });
});
