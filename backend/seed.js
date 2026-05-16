const bcrypt = require("bcryptjs");
const pool = require("./db");

const books = [
  ["Atomic Habits", "James Clear", "Self Help", 16.99, "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg", 12],
  ["Deep Work", "Cal Newport", "Productivity", 14.99, "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg", 8],
  ["The Psychology of Money", "Morgan Housel", "Finance", 15.49, "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg", 5],
  ["Rich Dad Poor Dad", "Robert Kiyosaki", "Finance", 12.99, "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg", 10],
  ["Clean Code", "Robert C. Martin", "Technology", 34.99, "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg", 7],
  ["Design Patterns", "Erich Gamma", "Technology", 39.99, "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg", 4],
  ["The Pragmatic Programmer", "Andrew Hunt", "Technology", 32.49, "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg", 10],
  ["Python Crash Course", "Eric Matthes", "Technology", 29.99, "https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg", 6],
  ["Hands-On Machine Learning", "Aurélien Géron", "AI & Data", 49.99, "https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg", 9],
  ["Deep Learning", "Ian Goodfellow", "AI & Data", 54.99, "https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg", 3],
  ["Artificial Intelligence", "Stuart Russell", "AI & Data", 45.99, "https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg", 11],
  ["Storytelling with Data", "Cole N. Knaflic", "AI & Data", 22.99, "https://covers.openlibrary.org/b/isbn/9781119002253-L.jpg", 15],
  ["Zero to One", "Peter Thiel", "Business", 13.99, "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg", 6],
  ["The Lean Startup", "Eric Ries", "Business", 17.49, "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg", 13],
  ["Good to Great", "Jim Collins", "Business", 18.99, "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg", 5],
  ["Start with Why", "Simon Sinek", "Business", 16.49, "https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg", 9],
  ["Sapiens", "Yuval Noah Harari", "History", 19.99, "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg", 14],
  ["Homo Deus", "Yuval Noah Harari", "History", 18.99, "https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg", 4],
  ["The Silk Roads", "Peter Frankopan", "History", 21.99, "https://covers.openlibrary.org/b/isbn/9781101946329-L.jpg", 7],
  ["Guns, Germs, and Steel", "Jared Diamond", "History", 17.99, "https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg", 2],
  ["1984", "George Orwell", "Fiction", 9.99, "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg", 20],
  ["The Alchemist", "Paulo Coelho", "Fiction", 10.99, "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg", 10],
  ["To Kill a Mockingbird", "Harper Lee", "Fiction", 11.49, "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg", 12],
  ["The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 8.99, "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg", 5],
  ["Ikigai", "Héctor García", "Self Help", 13.49, "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg", 8],
  ["Think and Grow Rich", "Napoleon Hill", "Self Help", 10.49, "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg", 6],
  ["Can't Hurt Me", "David Goggins", "Self Help", 18.49, "https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg", 3],
  ["The 5 AM Club", "Robin Sharma", "Productivity", 14.49, "https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg", 4],
  ["Make Time", "Jake Knapp", "Productivity", 15.99, "https://covers.openlibrary.org/b/isbn/9780525572428-L.jpg", 9],
  ["Essentialism", "Greg McKeown", "Productivity", 14.99, "https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg", 7],
  ["Dune", "Frank Herbert", "Fiction", 12.99, "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg", 6],
  ["Steve Jobs", "Walter Isaacson", "Biography", 20.99, "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg", 10],
  ["Elon Musk", "Walter Isaacson", "Biography", 23.99, "https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg", 5],
  ["Becoming", "Michelle Obama", "Biography", 17.99, "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg", 9],
  ["Shoe Dog", "Phil Knight", "Biography", 16.99, "https://covers.openlibrary.org/b/isbn/9781501135910-L.jpg", 6],
  ["The Intelligent Investor", "Benjamin Graham", "Finance", 21.99, "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg", 8],
];

async function seedDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
        quantity INT NOT NULL CHECK (quantity > 0),
        UNIQUE(user_id, book_id)
      )
    `);
    await pool.query(
      "ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_address JSONB"
    );

    const adminHash = await bcrypt.hash("admin123", 10);
    const userHash = await bcrypt.hash("user123", 10);

    await pool.query(
      "TRUNCATE cart_items, order_items, orders, admins, users, books RESTART IDENTITY CASCADE"
    );

    const userResult = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      ["admin@bookaura.com", adminHash, "BookAura", "Admin", true]
    );

    const adminUserId = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO admins (user_id, email, password, name)
       VALUES ($1, $2, $3, $4)`,
      [adminUserId, "admin@bookaura.com", adminHash, "BookAura Admin"]
    );

    await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, $4, false)`,
      ["user@test.com", userHash, "Test", "User"]
    );

    for (const book of books) {
      await pool.query(
        `INSERT INTO books (title, author, category, price, image, stock)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        book
      );
    }

    console.log("Database seeded successfully");
    console.log("Admin: admin@bookaura.com / admin123");
    console.log("User:  user@test.com / user123");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
