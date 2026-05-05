import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router";
import { useCart } from "../context/CartContext";

function CartDrawer() {
  const {
    cartItems,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="ml-auto h-full w-full max-w-md bg-[#f5f5f7] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="bg-white p-2 rounded-full shadow"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-4 shadow">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-16 object-cover rounded-xl"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">${item.price}</p>

                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="bg-white rounded-full p-1"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="text-sm font-semibold w-5 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQty(item.id)}
                            className="bg-white rounded-full p-1"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-200">
          <div className="flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            onClick={() => setIsCartOpen(false)}
            className="mt-4 block w-full text-center bg-black text-white py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartDrawer;