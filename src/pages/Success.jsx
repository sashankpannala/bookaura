import { Link } from "react-router";
import { CheckCircle } from "lucide-react";

function Success() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl p-10 shadow max-w-md text-center">
        <CheckCircle size={56} className="mx-auto text-green-600" />

        <h1 className="text-3xl font-semibold mt-5">
          Order placed successfully
        </h1>

        <p className="text-gray-500 mt-3">
          Thank you for shopping with BookAura. Your order has been received.
        </p>

        <Link
          to="/"
          className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-full font-semibold"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Success;