import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import BookCard from "./BookCard";
import { mockBook, mockFetchBooks, renderWithProviders } from "../test/test-utils";
import { useCart } from "../context/CartContext";

describe("BookCard", () => {
  it("renders book details", () => {
    mockFetchBooks();
    renderWithProviders(<BookCard book={mockBook} />);

    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
    expect(screen.getByText("$16.99")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText(/240 reviews/)).toBeInTheDocument();
    expect(screen.getByText("Top Pick")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("adds book to cart on click", async () => {
    const user = userEvent.setup();
    let cartApi;

    function Probe() {
      cartApi = useCart();
      return <BookCard book={mockBook} />;
    }

    mockFetchBooks();
    renderWithProviders(<Probe />);

    await user.click(screen.getByRole("button", { name: "Add" }));

    expect(cartApi.cartCount).toBe(1);
    expect(cartApi.isCartOpen).toBe(true);
  });
});
