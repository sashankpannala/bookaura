import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Register from "./Register";
import { renderWithProviders } from "../test/test-utils";

describe("Register page", () => {
  it("renders registration form fields", async () => {
    renderWithProviders(<Register />, { route: "/register" });

    expect(
      screen.getByRole("heading", { name: "Create Account" })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login"
    );
  });
});
