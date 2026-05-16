import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/authContext";
import { API_URL } from "../lib/api";

function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();
  const { user, isGuest } = useAuth();
  const navigate = useNavigate();

  const [customerEmail, setCustomerEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingZip: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.email) {
      setCustomerEmail(user.email);
    }
  }, [user]);

  const tax = subtotal * 0.0725;
  const shipping = subtotal > 50 ? 0 : subtotal === 0 ? 0 : 4.99;
  const total = subtotal + tax + shipping;

  const updatePaymentDetails = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const updateDeliveryAddress = (field, value) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length < 3) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const validatePaymentDetails = () => {
    const cardNumber = paymentDetails.cardNumber.replace(/\D/g, "");
    const cvv = paymentDetails.cvv.replace(/\D/g, "");
    const expiryIsValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(
      paymentDetails.expiry
    );

    if (
      !paymentDetails.cardName.trim() ||
      !cardNumber ||
      !paymentDetails.expiry ||
      !cvv ||
      !paymentDetails.billingZip.trim()
    ) {
      return "Please enter all payment details.";
    }

    if (cardNumber.length < 13) {
      return "Please enter a valid card number.";
    }

    if (!expiryIsValid) {
      return "Please enter expiry as MM/YY.";
    }

    if (cvv.length < 3) {
      return "Please enter a valid CVV.";
    }

    return "";
  };

  const validateDeliveryAddress = () => {
    const requiredFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    const missingField = requiredFields.some(
      (field) => !deliveryAddress[field].trim()
    );

    if (missingField) {
      return "Please enter your full delivery address.";
    }

    return "";
  };

  const placeOrder = async () => {
    if (!customerEmail.trim() || cartItems.length === 0) {
      setError("Please enter your email and add items to your cart.");
      return;
    }

    const deliveryError = validateDeliveryAddress();
    if (deliveryError) {
      setError(deliveryError);
      return;
    }

    const paymentError = validatePaymentDetails();
    if (paymentError) {
      setError(paymentError);
      return;
    }

    setError("");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          customerEmail: customerEmail.trim(),
          cartItems: cartItems.map(({ id, quantity }) => ({ id, quantity })),
          subtotal,
          tax,
          shipping,
          deliveryAddress: {
            fullName: deliveryAddress.fullName.trim(),
            phone: deliveryAddress.phone.trim(),
            addressLine1: deliveryAddress.addressLine1.trim(),
            addressLine2: deliveryAddress.addressLine2.trim(),
            city: deliveryAddress.city.trim(),
            state: deliveryAddress.state.trim(),
            postalCode: deliveryAddress.postalCode.trim(),
            country: deliveryAddress.country.trim(),
          },
          payment: {
            method: "card",
            cardholderName: paymentDetails.cardName.trim(),
            cardLast4: paymentDetails.cardNumber.replace(/\D/g, "").slice(-4),
            billingZip: paymentDetails.billingZip.trim(),
          },
        }),
      });

      const raw = await response.text();
      let data = {};

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        setError("Unexpected server response. Is the backend running?");
        return;
      }

      if (!response.ok) {
        setError(data.error || "Order failed. Please try again.");
        return;
      }

      clearCart();
      navigate("/success");
    } catch (err) {
      console.error(err);
      setError("Could not reach the server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] px-6 py-10">
        <div className="max-w-lg mx-auto text-center">
          <h1 className="text-4xl font-semibold mb-4">Checkout</h1>
          <p className="text-gray-500 mb-6">Your cart is empty.</p>
          <Link
            to="/#books"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="text-sm text-gray-500 hover:text-black">
          ← Back to store
        </Link>

        <h1 className="text-4xl font-semibold mt-6 mb-8">Checkout</h1>

        {isGuest && (
          <p className="mb-6 text-sm text-gray-600">
            Checking out as a guest.{" "}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Sign in
            </Link>{" "}
            to save your details for next time.
          </p>
        )}

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-8">
          <div className="bg-white rounded-3xl p-6 shadow">
            <h2 className="text-xl font-semibold mb-5">Customer Details</h2>

            <label className="block mb-4">
              <span className="block text-sm font-medium text-gray-600 mb-2">
                Customer Email
              </span>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                placeholder="customer@email.com"
                required
              />
            </label>

            <div className="border-t border-gray-100 pt-5 mt-5">
              <h2 className="text-xl font-semibold mb-5">Delivery Address</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block sm:col-span-2">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Full Name
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.fullName}
                    onChange={(e) =>
                      updateDeliveryAddress("fullName", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="Jane Doe"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Phone Number
                  </span>
                  <input
                    type="tel"
                    value={deliveryAddress.phone}
                    onChange={(e) =>
                      updateDeliveryAddress("phone", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="555-123-4567"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Street Address
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine1}
                    onChange={(e) =>
                      updateDeliveryAddress("addressLine1", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="123 Main St"
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Apartment, suite, etc. (optional)
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.addressLine2}
                    onChange={(e) =>
                      updateDeliveryAddress("addressLine2", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="Apt 4B"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    City
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.city}
                    onChange={(e) =>
                      updateDeliveryAddress("city", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="New York"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    State
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.state}
                    onChange={(e) =>
                      updateDeliveryAddress("state", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="NY"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    ZIP / Postal Code
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.postalCode}
                    onChange={(e) =>
                      updateDeliveryAddress("postalCode", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="10001"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Country
                  </span>
                  <input
                    type="text"
                    value={deliveryAddress.country}
                    onChange={(e) =>
                      updateDeliveryAddress("country", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="United States"
                  />
                </label>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-5 mt-5">
              <h2 className="text-xl font-semibold mb-5">Payment Details</h2>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-gray-600 mb-2">
                  Name on Card
                </span>
                <input
                  type="text"
                  value={paymentDetails.cardName}
                  onChange={(e) =>
                    updatePaymentDetails("cardName", e.target.value)
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                  placeholder="Jane Doe"
                />
              </label>

              <label className="block mb-4">
                <span className="block text-sm font-medium text-gray-600 mb-2">
                  Card Number
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={paymentDetails.cardNumber}
                  onChange={(e) =>
                    updatePaymentDetails(
                      "cardNumber",
                      formatCardNumber(e.target.value)
                    )
                  }
                  className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                  placeholder="4242 4242 4242 4242"
                />
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    Expiry
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={paymentDetails.expiry}
                    onChange={(e) =>
                      updatePaymentDetails("expiry", formatExpiry(e.target.value))
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="MM/YY"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    CVV
                  </span>
                  <input
                    type="password"
                    inputMode="numeric"
                    value={paymentDetails.cvv}
                    onChange={(e) =>
                      updatePaymentDetails(
                        "cvv",
                        e.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="123"
                  />
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-gray-600 mb-2">
                    ZIP
                  </span>
                  <input
                    type="text"
                    value={paymentDetails.billingZip}
                    onChange={(e) =>
                      updatePaymentDetails("billingZip", e.target.value)
                    }
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-black transition"
                    placeholder="10001"
                  />
                </label>
              </div>

              <p className="text-xs text-gray-400 mt-4">
                Demo checkout only: full card details are validated here but are
                not stored in the database.
              </p>
            </div>

            {error && (
              <p className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={placeOrder}
              disabled={loading}
              className="mt-2 w-full bg-black text-white py-4 rounded-full font-semibold hover:scale-[1.01] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow h-fit">
            <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
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
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-5 space-y-3">
              <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
              <SummaryRow label="Tax (7.25%)" value={`$${tax.toFixed(2)}`} />
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

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between text-gray-600">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default Checkout;
