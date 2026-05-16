import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";
import BookGrid from "./BookGrid";
import { BooksProvider } from "../context/BooksContext";
import { renderWithProviders } from "../test/test-utils";
import { books as mockBooks } from "../test/mock-books";

function renderBookGrid() {
  return renderWithProviders(
    <BooksProvider>
      <BookGrid />
    </BooksProvider>
  );
}

describe("BookGrid", () => {
  beforeEach(() => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockBooks,
    });
  });

  it("loads and shows books from the API", async () => {
    renderBookGrid();

    await waitFor(() => {
      expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    });

    expect(
      screen.getByText(`Showing ${mockBooks.length} of ${mockBooks.length} books`)
    ).toBeInTheDocument();
  });

  it("filters by search query", async () => {
    const user = userEvent.setup();
    renderBookGrid();

    await waitFor(() => screen.getByText("Atomic Habits"));

    await user.type(screen.getByPlaceholderText("Search books..."), "Atomic");

    expect(screen.getByText(/Showing 1 of/)).toBeInTheDocument();
  });
});
