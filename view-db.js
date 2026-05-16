const pool = require("./backend/db");

async function viewDatabase() {
  try {
    console.log("\n=== USERS TABLE ===");
    const users = await pool.query(
      "SELECT id, email, first_name, last_name, is_admin, created_at FROM users"
    );
    console.table(users.rows);

    console.log("\n=== ADMINS TABLE ===");
    const admins = await pool.query(
      "SELECT id, email, name, created_at FROM admins"
    );
    console.table(admins.rows);

    console.log("\n=== BOOKS TABLE ===");
    const books = await pool.query(
      "SELECT id, title, author, price, stock FROM books LIMIT 10"
    );
    console.table(books.rows);

    console.log("\n=== ORDERS TABLE ===");
    const orders = await pool.query(
      "SELECT id, customer_email, total, payment_status, created_at FROM orders"
    );
    console.table(orders.rows);

    pool.end();
  } catch (error) {
    console.error("Database error:", error);
    process.exit(1);
  }
}

viewDatabase();
