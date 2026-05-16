import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import axios from "axios";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import AuthProvider from "./context/AuthContext";

vi.mock("axios");

import { books as mockBooks } from "./test/mock-books";

beforeEach(() => {
  fetch.mockImplementation((url) => {
    if (String(url).includes("/api/books")) {
      return Promise.resolve({
        ok: true,
        json: async () => mockBooks,
      });
    }
    return Promise.resolve({ ok: true, json: async () => ({}) });
  });
});

function renderApp(route = "/") {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  );
}

describe("App", () => {
  it("renders home for guests", async () => {
    renderApp("/");

    await waitFor(() => {
      expect(screen.getByText(/Books that upgrade/i)).toBeInTheDocument();
    }, { timeout: 5000 });
    expect(screen.getByRole("link", { name: /login/i })).toBeInTheDocument();
  });

  it("renders login page", async () => {
    renderApp("/login");

    await waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });
  });

  it("shows checkout route for guests with items", async () => {
    renderApp("/checkout");

    await waitFor(() => {
      expect(screen.getByText("Checkout")).toBeInTheDocument();
    });
  });

  it("shows admin dashboard for admins", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    localStorage.setItem("token", "tok");
    localStorage.setItem("role", "admin");
    localStorage.setItem("user", JSON.stringify({ email: "admin@test.com" }));

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    });
  });
});
