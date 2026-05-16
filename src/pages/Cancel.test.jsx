import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Cancel from "./Cancel";

describe("Cancel page", () => {
  it("renders cancellation message", () => {
    render(<Cancel />);
    expect(screen.getByText("Payment Cancelled")).toBeInTheDocument();
  });
});
