import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import BookCard from "./BookCard";
import { mockBook, renderWithProviders } from "../test/test-utils";
import { CartProvider, useCart } from "../context/CartContext";

describe("BookCard", () => {
  it("renders book details", () => {
    renderWithProviders(<BookCard book={mockBook} />);

    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
    expect(screen.getByText("$16.99")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("adds book to cart on click", async () => {
    const user = userEvent.setup();
    let cartApi;

    function Probe() {
      cartApi = useCart();
      return <BookCard book={mockBook} />;
    }

    render(
      <CartProvider>
        <Probe />
      </CartProvider>
    );

    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(cartApi.cartCount).toBe(1);
    expect(cartApi.isCartOpen).toBe(true);
  });
});
