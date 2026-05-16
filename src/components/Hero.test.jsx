import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Hero from "./Hero";

describe("Hero", () => {
  it("renders headline and CTAs", () => {
    render(<Hero />);

    expect(screen.getByText(/Books that upgrade/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore books/i })).toHaveAttribute(
      "href",
      "#books"
    );
    expect(screen.getByText(/36 premium books/i)).toBeInTheDocument();
  });
});
