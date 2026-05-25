import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import Login from "./Login";
import { mockFetchBooks, renderWithProviders } from "../test/test-utils";

describe("Login page", () => {
  it("renders the sign-in form", async () => {
    renderWithProviders(<Login />, { route: "/login" });

    await waitFor(() => {
      expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign up/i })).toHaveAttribute(
      "href",
      "/register"
    );
  });

  beforeEach(() => {
    mockFetchBooks();
  });

  it("shows error on failed login", async () => {
    const user = userEvent.setup();

    fetch.mockImplementation((url) => {
      if (String(url).includes("/auth/login")) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: "Invalid credentials" }),
        });
      }

      return Promise.resolve({
        ok: true,
        json: async () => [],
      });
    });

    renderWithProviders(<Login />, { route: "/login" });

    await waitFor(() => screen.getByText("Welcome Back"));

    await user.type(screen.getByPlaceholderText("you@example.com"), "bad@test.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });
});
