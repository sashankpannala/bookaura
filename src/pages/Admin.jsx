import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Package, DollarSign, Clock } from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:5000";

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/orders`);
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
  }, [fetchOrders]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/${orderId}`);
      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Orders
          </button>

          {/* Order Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order #{selectedOrder.id}
                </h1>
                <p className="text-gray-600 mt-2">
                  {selectedOrder.customer_email || "Guest Customer"}
                </p>
              </div>
              <span
                className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                  selectedOrder.payment_status
                )}`}
              >
                {selectedOrder.payment_status?.toUpperCase() || "UNKNOWN"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${parseFloat(selectedOrder.total || 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatDate(selectedOrder.created_at)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Session ID</p>
                <p className="text-sm font-mono text-gray-900 break-all">
                  {selectedOrder.stripe_session_id
                    ? selectedOrder.stripe_session_id.substring(0, 20) + "..."
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Items in this Order
              </h2>
            </div>
            <div className="divide-y">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-24 h-32 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">by {item.author}</p>
                      <div className="flex gap-6 mt-4">
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Unit Price</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Subtotal</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-600">
                  No items in this order
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={20} />
              Back to Store
            </button>
          </div>
          <p className="text-gray-600 mt-2">Manage all customer orders</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {orders.length}
                    </p>
                  </div>
                  <Package className="text-blue-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      $
                      {orders
                        .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
                        .toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="text-green-600" size={32} />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Pending Orders</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">
                      {orders.filter((o) => o.payment_status === "pending").length}
                    </p>
                  </div>
                  <Clock className="text-yellow-600" size={32} />
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Customer Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">#{order.id}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {order.customer_email || "Guest"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          ${parseFloat(order.total || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.payment_status)}`}>
                            {order.payment_status?.toUpperCase() || "UNKNOWN"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => fetchOrderDetails(order.id)}
                            className="text-blue-600 hover:text-blue-700 font-semibold transition"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
