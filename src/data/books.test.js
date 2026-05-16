import { describe, expect, it } from "vitest";
import { books } from "./books";

describe("books data", () => {
  it("has 36 books with unique ids", () => {
    expect(books).toHaveLength(36);
    const ids = books.map((b) => b.id);
    expect(new Set(ids).size).toBe(36);
  });

  it("each book has required fields", () => {
    for (const book of books) {
      expect(book.title).toBeTruthy();
      expect(book.author).toBeTruthy();
      expect(book.category).toBeTruthy();
      expect(Number(book.price)).toBeGreaterThan(0);
      expect(book.image).toMatch(/^https?:\/\//);
    }
  });

  it("includes expected categories", () => {
    const categories = new Set(books.map((b) => b.category));
    expect(categories.has("Fiction")).toBe(true);
    expect(categories.has("Self Help")).toBe(true);
  });
});
