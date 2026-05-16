import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminLogin from "./AdminLogin";
import { renderWithProviders } from "../test/test-utils";

describe("AdminLogin page", () => {
  it("renders admin sign-in form", async () => {
    renderWithProviders(<AdminLogin />, { route: "/admin/login" });

    await waitFor(() => {
      expect(screen.getByText("Admin Login")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("admin@bookaura.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /user store/i })).toHaveAttribute(
      "href",
      "/"
    );
  });
});
