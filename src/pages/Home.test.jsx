import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import Home from "./Home";
import { mockFetchBooks, renderWithProviders } from "../test/test-utils";

describe("Home page", () => {
  beforeEach(() => {
    mockFetchBooks();
  });

  it("renders storefront with books from API", async () => {
    renderWithProviders(<Home />);

    await waitFor(() => {
      expect(screen.getByText(/Books that upgrade/i)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getAllByText("Atomic Habits").length).toBeGreaterThan(0);
    });
  });
});
