import { createContext, useContext, useEffect, useState } from "react";
import { fetchBooks, fetchFavorites, toggleFavorite } from "../lib/api";
import { useAuth } from "./authContext";

const BooksContext = createContext();
const FAVORITES_KEY = "bookaura_favorites";

export function BooksProvider({ children }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBooks();
      setBooks(data);
    } catch (err) {
      setError(err.message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      const saved = localStorage.getItem(FAVORITES_KEY);

      if (user?.id) {
        try {
          const favorites = await fetchFavorites();
          const ids = favorites.map((book) => book.id);
          if (!cancelled) {
            setFavoriteIds(ids);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
          }
        } catch (err) {
          console.error("Favorites sync failed:", err);
          if (!cancelled) {
            setFavoriteIds(saved ? JSON.parse(saved) : []);
          }
        }
        return;
      }

      if (!cancelled) {
        setFavoriteIds(saved ? JSON.parse(saved) : []);
      }
    }

    loadFavorites().catch(() => {
      if (!cancelled) setFavoriteIds([]);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const favoriteBooks = books.filter((book) => favoriteIds.includes(book.id));

  const toggleBookFavorite = async (bookId) => {
    const isFavorite = favoriteIds.includes(bookId);
    const nextFavoriteIds = isFavorite
      ? favoriteIds.filter((id) => id !== bookId)
      : [...favoriteIds, bookId];

    setFavoriteIds(nextFavoriteIds);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavoriteIds));

    if (user?.id) {
      try {
        const result = await toggleFavorite(bookId);
        if (result) {
          const syncedIds = result.isFavorite
            ? [...new Set([...favoriteIds, bookId])]
            : favoriteIds.filter((id) => id !== bookId);
          setFavoriteIds(syncedIds);
          localStorage.setItem(FAVORITES_KEY, JSON.stringify(syncedIds));
        }
      } catch (err) {
        // Keep the local favorite change even if account sync fails.
        // This avoids a broken heart button when a token expires or the API is restarting.
        console.error("Favorite saved locally, but account sync failed:", err);
      }
    }
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        favoriteBooks,
        favoriteIds,
        loading,
        error,
        reloadBooks: loadBooks,
        toggleBookFavorite,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error("useBooks must be used within BooksProvider");
  }
  return context;
}
