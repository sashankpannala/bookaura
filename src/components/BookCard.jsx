import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

function BookCard({ book }) {
  const { addToCart } = useCart();
  const outOfStock = book.stock <= 0;

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
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-gray-500 mb-2">{book.category}</p>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">{book.author}</p>
        <p className="text-xs text-gray-400 mt-1">{book.stock} in stock</p>

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
