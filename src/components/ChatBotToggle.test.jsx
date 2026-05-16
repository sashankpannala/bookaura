import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ChatBotToggle from "./ChatBotToggle";

describe("ChatBotToggle", () => {
  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ChatBotToggle onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: /ask about books/i }));

    expect(onClick).toHaveBeenCalledOnce();
  });
});
