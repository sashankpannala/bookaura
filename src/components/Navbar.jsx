import { ShoppingBag, BookOpen } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow">
            <BookOpen size={20} />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              BookAura
            </h1>
            <p className="text-xs text-gray-500">
              Premium bookstore
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
          <a href="#books" className="hover:text-black transition">
            Books
          </a>
          <a href="#books" className="hover:text-black transition">
            Categories
          </a>
          <a href="#footer" className="hover:text-black transition">
            About
          </a>
        </nav>

        {/* Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-black text-white px-5 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition shadow"
        >
          <ShoppingBag size={18} />
          Cart

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs w-6 h-6 flex items-center justify-center rounded-full shadow font-semibold">
              {cartCount}
            </span>
          )}
        </button>

      </div>
    </header>
  );
}

export default Navbar;