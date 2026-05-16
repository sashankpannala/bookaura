import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import Navbar from "./Navbar";
import { CartProvider } from "../context/CartContext";
import AuthProvider from "../context/AuthContext";

function renderNavbar() {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("Navbar", () => {
  it("shows brand and guest auth links", async () => {
    renderNavbar();

    await waitFor(() => {
      expect(screen.getByText("BookAura")).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: /login/i })).toHaveAttribute(
      "href",
      "/login"
    );
    expect(screen.getByRole("link", { name: /register/i })).toHaveAttribute(
      "href",
      "/register"
    );
    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument();
  });

  it("shows admin link when admin is stored", async () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("role", "admin");
    localStorage.setItem("user", JSON.stringify({ email: "admin@test.com" }));

    renderNavbar();

    await waitFor(() => {
      expect(screen.getByRole("link", { name: /admin/i })).toHaveAttribute(
        "href",
        "/admin"
      );
    });

    expect(screen.queryByRole("link", { name: /login/i })).not.toBeInTheDocument();
  });
});
