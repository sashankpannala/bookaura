const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const pool = require("./db");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const { optionalAuth } = require("./middleware/auth");
const { findResponse } = require("./chatbot");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(cartRoutes);

app.get("/", (req, res) => {
  res.send("BookAura backend is running");
});

app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, author, category, price, image, stock
       FROM books ORDER BY id ASC`
    );
    res.json(
      result.rows.map((book) => ({
        ...book,
        price: Number(book.price),
        stock: Number(book.stock),
      }))
    );
  } catch (error) {
    console.error("Books fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post("/api/chatbot", (req, res) => {
  const { query } = req.body;

  if (!query?.trim()) {
    return res.status(400).json({ error: "Query is required" });
  }

  res.json({ response: findResponse(query) });
});

app.post("/api/orders", optionalAuth, async (req, res) => {
  const client = await pool.connect();
  let transactionStarted = false;

  try {
    const {
      customerEmail,
      cartItems,
      subtotal,
      tax,
      shipping,
      deliveryAddress,
      payment,
    } = req.body;

    if (!customerEmail?.trim() || !cartItems?.length) {
      return res.status(400).json({ error: "Missing order details" });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine1",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    if (
      !deliveryAddress ||
      requiredAddressFields.some((field) => !deliveryAddress[field]?.trim())
    ) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    const userId = req.user?.role === "user" ? req.user.id : null;

    await client.query("BEGIN");
    transactionStarted = true;

    let itemsSubtotal = 0;

    for (const item of cartItems) {
      const bookResult = await client.query(
        "SELECT * FROM books WHERE id = $1",
        [item.id]
      );

      if (bookResult.rows.length === 0) {
        throw new Error(`Book not found (id: ${item.id}). Run npm run seed in backend.`);
      }

      const book = bookResult.rows[0];

      if (book.stock < item.quantity) {
        throw new Error(`"${book.title}" is out of stock`);
      }

      itemsSubtotal += Number(book.price) * item.quantity;
    }

    const orderSubtotal = Number(subtotal) || itemsSubtotal;
    const orderTax = Number(tax) || 0;
    const orderShipping = Number(shipping) || 0;
    const orderTotal = orderSubtotal + orderTax + orderShipping;
    const paymentStatus = payment?.method === "card" ? "paid" : "pending";

    const orderResult = await client.query(
      `INSERT INTO orders (user_id, customer_email, delivery_address, total, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        userId,
        customerEmail.trim().toLowerCase(),
        deliveryAddress,
        orderTotal,
        paymentStatus,
      ]
    );

    const order = orderResult.rows[0];

    for (const item of cartItems) {
      const bookResult = await client.query(
        "SELECT * FROM books WHERE id = $1",
        [item.id]
      );

      const book = bookResult.rows[0];

      await client.query(
        `INSERT INTO order_items (order_id, book_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, book.id, item.quantity, book.price]
      );

      await client.query(
        "UPDATE books SET stock = stock - $1 WHERE id = $2",
        [item.quantity, book.id]
      );
    }

    if (userId) {
      await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    }

    await client.query("COMMIT");
    transactionStarted = false;

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    if (transactionStarted) {
      await client.query("ROLLBACK");
    }
    console.error("Order error:", error.message);
    res.status(400).json({ error: error.message });
  } finally {
    client.release();
  }
});

app.get("/api/admin/orders", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        o.customer_email,
        o.delivery_address,
        o.total,
        o.payment_status,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'book_id', b.id,
              'title', b.title,
              'quantity', oi.quantity,
              'price', oi.price
            )
          ) FILTER (WHERE b.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN books b ON oi.book_id = b.id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Orders fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.get("/api/admin/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderResult = await pool.query(
      `SELECT id, customer_email, delivery_address, total, payment_status, created_at, stripe_session_id
       FROM orders WHERE id = $1`,
      [orderId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const itemsResult = await pool.query(
      `SELECT oi.quantity, oi.price, b.id, b.title, b.author, b.image
       FROM order_items oi
       JOIN books b ON oi.book_id = b.id
       WHERE oi.order_id = $1`,
      [orderId]
    );

    res.json({
      ...orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error("Order detail error:", error.message);
    res.status(500).json({ error: "Failed to load order details" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BookAura backend running on http://localhost:${PORT}`);
});
