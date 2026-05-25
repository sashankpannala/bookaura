import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import Hero from "./Hero";
import { mockFetchBooks, renderWithProviders } from "../test/test-utils";
import { books as mockBooks } from "../test/mock-books";

describe("Hero", () => {
  beforeEach(() => {
    mockFetchBooks();
  });

  it("renders headline and CTAs", async () => {
    renderWithProviders(<Hero />);

    expect(screen.getByText(/Books that upgrade/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore books/i })).toHaveAttribute(
      "href",
      "#books"
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`Curated collection of ${mockBooks.length} premium books`, "i")
        )
      ).toBeInTheDocument();
    });
  });
});
