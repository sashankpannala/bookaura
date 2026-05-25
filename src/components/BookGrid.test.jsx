import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, beforeEach } from "vitest";
import BookGrid from "./BookGrid";
import { mockFetchBooks, renderWithProviders } from "../test/test-utils";
import { books as mockBooks } from "../test/mock-books";

describe("BookGrid", () => {
  beforeEach(() => {
    mockFetchBooks();
  });

  it("loads and shows books from the API", async () => {
    renderWithProviders(<BookGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Atomic Habits").length).toBeGreaterThan(0);
    });

    expect(
      screen.getByText(`Showing ${mockBooks.length} of ${mockBooks.length} books`)
    ).toBeInTheDocument();
    expect(screen.getByText("Top Picks of the Week")).toBeInTheDocument();
  });

  it("filters by search query", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookGrid />);

    await waitFor(() => {
      expect(screen.getAllByText("Atomic Habits").length).toBeGreaterThan(0);
    });

    await user.type(screen.getByPlaceholderText("Search books..."), "Atomic");

    expect(screen.getByText(/Showing 1 of/)).toBeInTheDocument();
  });
});
