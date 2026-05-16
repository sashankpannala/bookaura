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
    rating: Number(row.rating ?? row.rating_average ?? 0),
    reviewCount: Number(row.reviewCount ?? row.review_count ?? 0),
    isTopPick: Boolean(row.isTopPick ?? row.is_top_pick),
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

export async function fetchFavorites() {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const response = await fetch(`${API_URL}/api/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return [];

  const data = await response.json();
  return data.map(normalizeBook);
}

export async function toggleFavorite(bookId) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const response = await fetch(`${API_URL}/api/favorites/${bookId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    let message = "Failed to update favorite";
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {
      // Keep default message for non-JSON failures.
    }
    throw new Error(message);
  }

  return response.json();
}
