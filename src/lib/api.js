export const API_URL = "http://localhost:5000";

export function normalizeBook(row) {
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    category: row.category,
    price: Number(row.price),
    image: row.image,
    stock: Number(row.stock ?? 0),
  };
}

export async function fetchBooks() {
  const response = await fetch(`${API_URL}/api/books`);

  if (!response.ok) {
    throw new Error("Failed to load books from the database");
  }

  const data = await response.json();
  return data.map(normalizeBook);
}

export async function fetchCart() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const response = await fetch(`${API_URL}/api/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  return data.map((item) => ({
    ...normalizeBook(item),
    quantity: item.quantity,
  }));
}

export async function saveCart(cartItems) {
  const token = localStorage.getItem("token");
  if (!token) return;

  await fetch(`${API_URL}/api/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      cartItems: cartItems.map(({ id, quantity }) => ({ id, quantity })),
    }),
  });
}
