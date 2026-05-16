import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ChatBot from "./ChatBot";

describe("ChatBot", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ChatBot isOpen={false} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("shows welcome message when open", () => {
    render(<ChatBot isOpen onClose={vi.fn()} />);

    expect(screen.getByText("BookAura Assistant")).toBeInTheDocument();
    expect(screen.getByText(/Hello!/)).toBeInTheDocument();
  });

  it("sends a message and displays bot reply", async () => {
    const user = userEvent.setup();

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ response: "We ship within 3-5 days." }),
    });

    render(<ChatBot isOpen onClose={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText(/ask me about books/i),
      "shipping"
    );
    await user.click(screen.getByRole("button", { name: "→" }));

    await waitFor(() => {
      expect(screen.getByText("We ship within 3-5 days.")).toBeInTheDocument();
    });
  });

  it("calls onClose from header button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ChatBot isOpen onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "✕" }));

    expect(onClose).toHaveBeenCalledOnce();
  });
});
