import { useState } from "react";
import { Search } from "lucide-react";
import { useBooks } from "../context/BooksContext";
import BookCard from "./BookCard";

function BookGrid() {
  const { books, favoriteBooks, loading, error, reloadBooks } = useBooks();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(books.map((book) => book.category))];
  const flaggedTopPicks = books.filter((book) => book.isTopPick);
  const topPicksSource = flaggedTopPicks.length > 0 ? flaggedTopPicks : books;
  const topPicks = topPicksSource
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase()) ||
      book.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <section id="books" className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-gray-500 text-center">Loading books...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section id="books" className="max-w-7xl mx-auto px-6 py-14 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          type="button"
          onClick={reloadBooks}
          className="bg-black text-white px-6 py-3 rounded-full font-semibold"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section id="books" className="max-w-7xl mx-auto px-6 py-14">
      {topPicks.length > 0 && (
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
            <div>
              <p className="text-sm font-semibold text-yellow-600 mb-2">
                Reader favorites
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Top Picks of the Week
              </h2>
              <p className="text-gray-500 mt-2">
                Highest-rated books readers are loving right now.
              </p>
            </div>
            <a
              href="#all-books"
              className="text-sm font-semibold text-black hover:underline"
            >
              Browse all books
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {topPicks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      {favoriteBooks.length > 0 && (
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
            <div>
              <p className="text-sm font-semibold text-red-500 mb-2">
                Saved for later
              </p>
              <h2 className="text-4xl font-semibold tracking-tight">
                Your Favorites
              </h2>
              <p className="text-gray-500 mt-2">
                Books you marked with the heart icon.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            {favoriteBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      )}

      <div id="all-books" />
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-semibold tracking-tight">Browse Books</h2>
          <p className="text-gray-500 mt-2">
            Search by title, author, or category.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-80 bg-white border border-gray-200 rounded-full pl-11 pr-4 py-3 outline-none focus:border-black transition"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="bg-white border border-gray-200 rounded-full px-5 py-3 outline-none focus:border-black transition"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Showing {filteredBooks.length} of {books.length} books
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm">
          <p className="text-gray-500">No books found. Try another search.</p>
        </div>
      )}
    </section>
  );
}

export default BookGrid;
