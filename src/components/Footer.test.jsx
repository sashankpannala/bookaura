import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders copyright", () => {
    render(<Footer />);
    expect(
      screen.getByText("© 2026 BookAura. Built with React.")
    ).toBeInTheDocument();
  });
});
