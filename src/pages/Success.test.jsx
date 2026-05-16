import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import Success from "./Success";

describe("Success page", () => {
  it("renders confirmation message", () => {
    render(
      <MemoryRouter>
        <Success />
      </MemoryRouter>
    );

    expect(screen.getByText("Order placed successfully")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue shopping/i })
    ).toHaveAttribute("href", "/");
  });
});
