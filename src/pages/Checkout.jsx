import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const tax = subtotal * 0.0725;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) return;

    clearCart();
    navigate("/success");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 hover:text-black">
          ← Back to store
        </Link>

        <h1 className="text-4xl font-semibold mt-6 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <form className="bg-white rounded-3xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-5">Billing Details</h2>

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="First Name" />
              <Input label="Last Name" />
            </div>

            <Input label="Email Address" type="email" />
            <Input label="Phone Number" />
            <Input label="Billing Address" />

            <div className="grid md:grid-cols-3 gap-4">
              <Input label="City" />
              <Input label="State" />
              <Input label="ZIP Code" />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-5">
              Payment Details
            </h2>

            <Input label="Card Number" placeholder="4242 4242 4242 4242" />

            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Expiry Date" placeholder="MM/YY" />
              <Input label="CVV" placeholder="123" />
            </div>

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="mt-6 w-full bg-black text-white py-4 rounded-full font-semibold hover:scale-[1.01] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Place Order
            </button>
          </form>

          <div className="bg-white rounded-3xl p-6 shadow h-fit">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-16 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="border-t mt-6 pt-5 space-y-3">
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow label="Tax" value={`$${tax.toFixed(2)}`} />
              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              />

              <div className="flex justify-between text-xl font-semibold pt-3 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-sm font-medium text-gray-600 mb-2">
        {label}
      </span>
      <input
        {...props}
        className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
      />
    </label>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default Checkout;