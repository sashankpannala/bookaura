const express = require("express");
const pool = require("../db");
const { requireUser } = require("../middleware/auth");

const router = express.Router();

router.get("/api/favorites", requireUser, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.title, b.author, b.category, b.price, b.image, b.stock,
              b.rating, b.review_count, b.is_top_pick
       FROM favorite_items fi
       JOIN books b ON fi.book_id = b.id
       WHERE fi.user_id = $1
       ORDER BY fi.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Favorites fetch error:", error.message);
    res.status(500).json({ error: "Failed to load favorites" });
  }
});

router.post("/api/favorites/:bookId", requireUser, async (req, res) => {
  try {
    const { bookId } = req.params;
    const existing = await pool.query(
      "SELECT id FROM favorite_items WHERE user_id = $1 AND book_id = $2",
      [req.user.id, bookId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM favorite_items WHERE user_id = $1 AND book_id = $2",
        [req.user.id, bookId]
      );
      return res.json({ isFavorite: false });
    }

    await pool.query(
      `INSERT INTO favorite_items (user_id, book_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, book_id) DO NOTHING`,
      [req.user.id, bookId]
    );

    res.json({ isFavorite: true });
  } catch (error) {
    console.error("Favorite toggle error:", error.message);
    res.status(500).json({ error: "Failed to update favorite" });
  }
});

module.exports = router;
