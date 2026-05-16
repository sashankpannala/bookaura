import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import Home from "./Home";
import { renderWithProviders } from "../test/test-utils";
import { books as mockBooks } from "../test/mock-books";

describe("Home page", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockBooks,
    });
  });

  it("renders storefront with books from API", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Books that upgrade/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    });
  });
});
