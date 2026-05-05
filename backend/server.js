const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const Stripe = require("stripe");
const pool = require("./db");

dotenv.config();

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("BookAura backend is running");
});

app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Books fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const bookIds = cartItems.map((item) => item.id);

    const dbBooksResult = await pool.query(
      "SELECT * FROM books WHERE id = ANY($1::int[])",
      [bookIds]
    );

    const dbBooks = dbBooksResult.rows;

    const lineItems = cartItems.map((cartItem) => {
      const dbBook = dbBooks.find((book) => book.id === cartItem.id);

      if (!dbBook) {
        throw new Error(`Book not found: ${cartItem.id}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: dbBook.title,
            description: `Author: ${dbBook.author}`,
            images: [dbBook.image],
          },
          unit_amount: Math.round(Number(dbBook.price) * 100),
        },
        quantity: cartItem.quantity,
      };
    });

    const total = cartItems.reduce((sum, cartItem) => {
      const dbBook = dbBooks.find((book) => book.id === cartItem.id);
      return sum + Number(dbBook.price) * cartItem.quantity;
    }, 0);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    await pool.query(
      `INSERT INTO orders (total, payment_status, stripe_session_id)
       VALUES ($1, $2, $3)`,
      [total, "pending", session.id]
    );

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`BookAura backend running on http://localhost:${PORT}`);
});