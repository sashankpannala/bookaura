const express = require("express");
const pool = require("../db");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/api/cart", requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.author, b.category, b.price, b.image, b.stock,
              b.rating, b.review_count, b.is_top_pick,
              ci.quantity
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.user_id = $1
       ORDER BY ci.id ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Cart fetch error:", error.message);
    res.status(500).json({ error: "Failed to load cart" });
  }
});

router.put("/api/cart", requireUser, async (req, res) => {
  const client = await pool.connect();

  try {
    const { cartItems } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ error: "Invalid cart data" });
    }

    await client.query("BEGIN");
    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);

    for (const item of cartItems) {
      if (!item.id || !item.quantity || item.quantity < 1) continue;

      const bookResult = await client.query("SELECT id, stock FROM books WHERE id = $1", [
        item.id,
      ]);

      if (bookResult.rows.length === 0) continue;

      const book = bookResult.rows[0];
      const quantity = Math.min(item.quantity, book.stock);

      if (quantity < 1) continue;

      await client.query(
        `INSERT INTO cart_items (user_id, book_id, quantity)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id, book_id)
         DO UPDATE SET quantity = EXCLUDED.quantity`,
        [userId, item.id, quantity]
      );
    }

    await client.query("COMMIT");

    const saved = await pool.query(
      `SELECT b.id, b.title, b.author, b.category, b.price, b.image, b.stock,
              b.rating, b.review_count, b.is_top_pick,
              ci.quantity
       FROM cart_items ci
       JOIN books b ON ci.book_id = b.id
       WHERE ci.user_id = $1`,
      [userId]
    );

    res.json(saved.rows);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Cart save error:", error.message);
    res.status(500).json({ error: "Failed to save cart" });
  } finally {
    client.release();
  }
});

router.delete("/api/cart", requireUser, async (req, res) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1", [req.user.id]);
    res.json({ message: "Cart cleared" });
  } catch (error) {
    console.error("Cart clear error:", error.message);
    res.status(500).json({ error: "Failed to clear cart" });
  }
});

module.exports = router;
