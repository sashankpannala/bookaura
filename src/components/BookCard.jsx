import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

function BookCard({ book }) {
  const { addToCart } = useCart();

  return (
    <div className="group bg-white rounded-[28px] p-5 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
      <div className="bg-[#f5f5f7] rounded-3xl h-64 flex items-center justify-center p-5">
        <img
          src={book.image}
          alt={book.title}
          className="h-full max-w-full object-contain rounded-xl shadow-lg group-hover:scale-105 transition"
          loading="lazy"
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-gray-500 mb-2">
          {book.category}
        </p>

        <h3 className="font-semibold text-lg leading-tight line-clamp-2">
          {book.title}
        </h3>

        <p className="text-sm text-gray-500 mt-1">{book.author}</p>

        <div className="flex justify-between items-center mt-5">
          <span className="font-semibold text-lg">${book.price}</span>

          <button
            onClick={() => addToCart(book)}
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 transition"
          >
            <ShoppingBag size={16} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;