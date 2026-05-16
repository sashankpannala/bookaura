import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router";
import axios from "axios";
import Admin from "./Admin";

vi.mock("axios");

describe("Admin page", () => {
  it("loads and displays orders", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 1,
          customer_email: "buyer@test.com",
          total: 42.5,
          payment_status: "pending",
          created_at: "2026-05-16T12:00:00Z",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("buyer@test.com")).toBeInTheDocument();
    });

    expect(screen.getByText(/total orders/i)).toBeInTheDocument();
  });

  it("shows error when orders fail to load", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Failed to load orders")).toBeInTheDocument();
    });
  });
});
