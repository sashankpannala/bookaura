import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useBooks } from "../context/BooksContext";

function BookCard({ book }) {
  const { addToCart } = useCart();
  const { favoriteIds, toggleBookFavorite } = useBooks();
  const outOfStock = book.stock <= 0;
  const isFavorite = favoriteIds.includes(book.id);

  return (
    <div className="group bg-white rounded-[28px] p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
      <div className="bg-[#f5f5f7] rounded-3xl h-64 flex items-center justify-center p-5 relative">
        <img
          src={book.image}
          alt={book.title}
          className="h-full max-w-full object-contain rounded-xl shadow-lg group-hover:scale-105 transition"
          loading="lazy"
        />
        {outOfStock && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Out of stock
          </span>
        )}
        {book.isTopPick && (
          <span className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded-full">
            Top Pick
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleBookFavorite(book.id)}
          className={`absolute bottom-3 right-3 h-10 w-10 rounded-full flex items-center justify-center shadow transition ${
            isFavorite
              ? "bg-red-500 text-white"
              : "bg-white text-gray-500 hover:text-red-500"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between gap-3 mb-2">
          <p className="text-xs font-medium text-gray-500">{book.category}</p>
          <div className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
            <Star size={15} fill="currentColor" />
            <span>{Number(book.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">{book.author}</p>
        <p className="text-xs text-gray-400 mt-1">
          {book.reviewCount || 0} reviews · {book.stock} in stock
        </p>

        <div className="flex justify-between items-center mt-5">
          <span className="font-semibold text-lg">${Number(book.price).toFixed(2)}</span>

          <button
            type="button"
            onClick={() => addToCart(book)}
            disabled={outOfStock}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            {outOfStock ? "Sold out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;
