import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Clock,
  Plus,
  Save,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router";
import axios from "axios";

const API_URL = "http://localhost:5000";
const emptyBookForm = {
  title: "",
  author: "",
  category: "",
  price: "",
  image: "",
  stock: "",
  rating: "4.5",
  reviewCount: "0",
  isTopPick: false,
  isActive: true,
};

export default function Admin() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventoryMessage, setInventoryMessage] = useState("");
  const [bookForm, setBookForm] = useState(emptyBookForm);
  const [editingBookId, setEditingBookId] = useState(null);

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: authHeaders(),
      });
      setOrders(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setInventoryLoading(true);
      const response = await axios.get(`${API_URL}/api/admin/books`, {
        headers: authHeaders(),
      });
      setBooks(response.data);
      setInventoryMessage("");
    } catch (err) {
      console.error("Error fetching inventory:", err);
      setInventoryMessage("Failed to load inventory");
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOrders();
    fetchBooks();
  }, [fetchOrders, fetchBooks]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders/${orderId}`, {
        headers: authHeaders(),
      });
      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    }
  };

  const updateBookForm = (field, value) => {
    setBookForm((prev) => ({ ...prev, [field]: value }));
  };

  const startEditingBook = (book) => {
    setEditingBookId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      price: String(book.price),
      image: book.image,
      stock: String(book.stock),
      rating: String(book.rating || 0),
      reviewCount: String(book.reviewCount || book.review_count || 0),
      isTopPick: Boolean(book.isTopPick || book.is_top_pick),
      isActive: Boolean(book.isActive ?? book.is_active ?? true),
    });
    setActiveTab("inventory");
  };

  const resetBookForm = () => {
    setEditingBookId(null);
    setBookForm(emptyBookForm);
  };

  const saveBook = async (event) => {
    event.preventDefault();
    setInventoryMessage("");

    const payload = {
      ...bookForm,
      price: Number(bookForm.price),
      stock: Number(bookForm.stock),
      rating: Number(bookForm.rating),
      reviewCount: Number(bookForm.reviewCount),
    };

    try {
      if (editingBookId) {
        await axios.put(`${API_URL}/api/admin/books/${editingBookId}`, payload, {
          headers: authHeaders(),
        });
        setInventoryMessage("Book updated successfully");
      } else {
        await axios.post(`${API_URL}/api/admin/books`, payload, {
          headers: authHeaders(),
        });
        setInventoryMessage("Book added successfully");
      }

      resetBookForm();
      fetchBooks();
    } catch (err) {
      console.error("Error saving book:", err);
      setInventoryMessage(err.response?.data?.error || "Failed to save book");
    }
  };

  const removeBook = async (bookId) => {
    if (!confirm("Remove this book from the store?")) return;

    try {
      await axios.delete(`${API_URL}/api/admin/books/${bookId}`, {
        headers: authHeaders(),
      });
      setInventoryMessage("Book removed from store");
      fetchBooks();
    } catch (err) {
      console.error("Error removing book:", err);
      setInventoryMessage("Failed to remove book");
    }
  };

  const restoreBook = async (book) => {
    try {
      await axios.put(
        `${API_URL}/api/admin/books/${book.id}`,
        { ...book, isActive: true, stock: book.stock > 0 ? book.stock : 1 },
        { headers: authHeaders() }
      );
      setInventoryMessage("Book restored to store");
      fetchBooks();
    } catch (err) {
      console.error("Error restoring book:", err);
      setInventoryMessage("Failed to restore book");
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
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage orders, inventory, stock, and storefront availability.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft size={20} />
              Back to Store
            </button>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`px-5 py-2 rounded-full font-semibold ${
                activeTab === "orders"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("inventory")}
              className={`px-5 py-2 rounded-full font-semibold ${
                activeTab === "inventory"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              Inventory
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {activeTab === "orders" ? (
          loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 mt-4">Loading orders...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <StatCard
                  label="Total Orders"
                  value={orders.length}
                  icon={<Package className="text-blue-600" size={32} />}
                />
                <StatCard
                  label="Total Revenue"
                  value={`$${orders
                    .reduce((sum, order) => sum + (parseFloat(order.total) || 0), 0)
                    .toFixed(2)}`}
                  icon={<DollarSign className="text-green-600" size={32} />}
                />
                <StatCard
                  label="Pending Orders"
                  value={orders.filter((o) => o.payment_status === "pending").length}
                  icon={<Clock className="text-yellow-600" size={32} />}
                />
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-gray-600">No orders yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer Email</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Action</TableHead>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {order.customer_email || "Guest"}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              ${parseFloat(order.total || 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.payment_status
                                )}`}
                              >
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
                )}
              </div>
            </div>
          )
        ) : (
          <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-8">
            <form onSubmit={saveBook} className="bg-white rounded-lg shadow p-6 h-fit">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingBookId ? "Edit Book" : "Add Book"}
                </h2>
                {editingBookId && (
                  <button
                    type="button"
                    onClick={resetBookForm}
                    className="text-sm font-semibold text-gray-500 hover:text-black"
                  >
                    Cancel edit
                  </button>
                )}
              </div>

              {inventoryMessage && (
                <p className="mb-4 rounded-lg bg-blue-50 text-blue-700 px-4 py-3 text-sm">
                  {inventoryMessage}
                </p>
              )}

              <div className="grid gap-4">
                <InventoryInput label="Title" value={bookForm.title} onChange={(value) => updateBookForm("title", value)} />
                <InventoryInput label="Author" value={bookForm.author} onChange={(value) => updateBookForm("author", value)} />
                <InventoryInput label="Category" value={bookForm.category} onChange={(value) => updateBookForm("category", value)} />
                <InventoryInput label="Image URL" value={bookForm.image} onChange={(value) => updateBookForm("image", value)} />

                <div className="grid grid-cols-2 gap-4">
                  <InventoryInput label="Price" type="number" value={bookForm.price} onChange={(value) => updateBookForm("price", value)} />
                  <InventoryInput label="Stock Available" type="number" value={bookForm.stock} onChange={(value) => updateBookForm("stock", value)} />
                  <InventoryInput label="Rating" type="number" value={bookForm.rating} onChange={(value) => updateBookForm("rating", value)} step="0.1" />
                  <InventoryInput label="Reviews" type="number" value={bookForm.reviewCount} onChange={(value) => updateBookForm("reviewCount", value)} />
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={bookForm.isTopPick}
                    onChange={(e) => updateBookForm("isTopPick", e.target.checked)}
                  />
                  Mark as Top Pick
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={bookForm.isActive}
                    onChange={(e) => updateBookForm("isActive", e.target.checked)}
                  />
                  Visible in store
                </label>

                <button
                  type="submit"
                  className="mt-2 bg-black text-white rounded-lg py-3 font-semibold flex items-center justify-center gap-2"
                >
                  {editingBookId ? <Save size={18} /> : <Plus size={18} />}
                  {editingBookId ? "Save Changes" : "Add Book"}
                </button>
              </div>
            </form>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Inventory</h2>
                  <p className="text-sm text-gray-500">
                    {books.filter((book) => book.isActive).length} active books ·{" "}
                    {books.reduce((sum, book) => sum + Number(book.stock || 0), 0)} total stock
                  </p>
                </div>
                <button
                  type="button"
                  onClick={fetchBooks}
                  className="text-sm font-semibold text-blue-600"
                >
                  Refresh
                </button>
              </div>

              {inventoryLoading ? (
                <div className="p-8 text-center text-gray-600">Loading inventory...</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <TableHead>Book</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {books.map((book) => (
                        <tr key={book.id} className={!book.isActive ? "bg-gray-50" : ""}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <img src={book.image} alt={book.title} className="h-16 w-12 object-cover rounded" />
                              <div>
                                <p className="font-semibold text-gray-900">{book.title}</p>
                                <p className="text-sm text-gray-500">{book.author}</p>
                                <p className="text-xs text-gray-400">{book.category}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-semibold">${Number(book.price).toFixed(2)}</td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${book.stock <= 3 ? "text-red-600" : "text-gray-900"}`}>
                              {book.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              book.isActive ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                            }`}>
                              {book.isActive ? "Active" : "Removed"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-3">
                              <button onClick={() => startEditingBook(book)} className="text-blue-600 font-semibold">Edit</button>
                              {book.isActive ? (
                                <button onClick={() => removeBook(book.id)} className="text-red-600 font-semibold flex items-center gap-1">
                                  <Trash2 size={15} />
                                  Remove
                                </button>
                              ) : (
                                <button onClick={() => restoreBook(book)} className="text-green-600 font-semibold flex items-center gap-1">
                                  <RotateCcw size={15} />
                                  Restore
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        {icon}
      </div>
    </div>
  );
}

function TableHead({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
      {children}
    </th>
  );
}

function InventoryInput({ label, value, onChange, type = "text", step }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-600 mb-2">{label}</span>
      <input
        type={type}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-black transition"
      />
    </label>
  );
}
