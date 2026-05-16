import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminRegister from "./AdminRegister";
import { renderWithProviders } from "../test/test-utils";

describe("AdminRegister page", () => {
  it("renders admin registration form", async () => {
    renderWithProviders(<AdminRegister />, { route: "/admin/register" });

    await waitFor(() => {
      expect(screen.getByText("Admin Registration")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("admin@bookaura.com")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/admin/login"
    );
  });
});
