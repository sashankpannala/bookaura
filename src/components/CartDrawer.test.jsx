import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import CartDrawer from "./CartDrawer";
import { CartProvider, useCart } from "../context/CartContext";
import { mockBook } from "../test/test-utils";

function CartDrawerHarness() {
  const cart = useCart();

  return (
    <>
      <button type="button" onClick={() => cart.setIsCartOpen(true)}>
        Open cart
      </button>
      <button type="button" onClick={() => cart.addToCart(mockBook)}>
        Seed cart
      </button>
      <CartDrawer />
    </>
  );
}

describe("CartDrawer", () => {
  it("renders nothing when closed", () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CartDrawer />
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText("Your Cart")).not.toBeInTheDocument();
  });

  it("shows items, subtotal, and checkout link when open", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <CartDrawerHarness />
        </CartProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Seed cart" }));
    await user.click(screen.getByRole("button", { name: "Open cart" }));

    expect(screen.getByText("Your Cart")).toBeInTheDocument();
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("$16.99", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute(
      "href",
      "/checkout"
    );
  });

  it("closes when the X button is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CartProvider>
          <CartDrawerHarness />
        </CartProvider>
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: "Open cart" }));
    const header = screen.getByText("Your Cart").parentElement;
    await user.click(within(header).getByRole("button"));

    expect(screen.queryByText("Your Cart")).not.toBeInTheDocument();
  });
});
