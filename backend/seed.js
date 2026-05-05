const pool = require("./db");

const books = [
  ["Atomic Habits", "James Clear", "Self Help", 16.99, "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg"],
  ["Deep Work", "Cal Newport", "Productivity", 14.99, "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg"],
  ["The Psychology of Money", "Morgan Housel", "Finance", 15.49, "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg"],
  ["Rich Dad Poor Dad", "Robert Kiyosaki", "Finance", 12.99, "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg"],
  ["Clean Code", "Robert C. Martin", "Technology", 34.99, "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"],
  ["Design Patterns", "Erich Gamma", "Technology", 39.99, "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg"],
  ["The Pragmatic Programmer", "Andrew Hunt", "Technology", 32.49, "https://covers.openlibrary.org/b/isbn/9780201616224-L.jpg"],
  ["Python Crash Course", "Eric Matthes", "Technology", 29.99, "https://covers.openlibrary.org/b/isbn/9781593279288-L.jpg"],
  ["Hands-On Machine Learning", "Aurélien Géron", "AI & Data", 49.99, "https://covers.openlibrary.org/b/isbn/9781492032649-L.jpg"],
  ["Deep Learning", "Ian Goodfellow", "AI & Data", 54.99, "https://covers.openlibrary.org/b/isbn/9780262035613-L.jpg"],
  ["Artificial Intelligence", "Stuart Russell", "AI & Data", 45.99, "https://covers.openlibrary.org/b/isbn/9780134610993-L.jpg"],
  ["Storytelling with Data", "Cole N. Knaflic", "AI & Data", 22.99, "https://covers.openlibrary.org/b/isbn/9781119002253-L.jpg"],
  ["Zero to One", "Peter Thiel", "Business", 13.99, "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg"],
  ["The Lean Startup", "Eric Ries", "Business", 17.49, "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg"],
  ["Good to Great", "Jim Collins", "Business", 18.99, "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg"],
  ["Start with Why", "Simon Sinek", "Business", 16.49, "https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg"],
  ["Sapiens", "Yuval Noah Harari", "History", 19.99, "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg"],
  ["Homo Deus", "Yuval Noah Harari", "History", 18.99, "https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg"],
  ["The Silk Roads", "Peter Frankopan", "History", 21.99, "https://covers.openlibrary.org/b/isbn/9781101946329-L.jpg"],
  ["Guns, Germs, and Steel", "Jared Diamond", "History", 17.99, "https://covers.openlibrary.org/b/isbn/9780393317558-L.jpg"],
  ["1984", "George Orwell", "Fiction", 9.99, "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg"],
  ["The Alchemist", "Paulo Coelho", "Fiction", 10.99, "https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg"],
  ["To Kill a Mockingbird", "Harper Lee", "Fiction", 11.49, "https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg"],
  ["The Great Gatsby", "F. Scott Fitzgerald", "Fiction", 8.99, "https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg"],
  ["Ikigai", "Héctor García", "Self Help", 13.49, "https://covers.openlibrary.org/b/isbn/9780143130727-L.jpg"],
  ["Think and Grow Rich", "Napoleon Hill", "Self Help", 10.49, "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg"],
  ["Can't Hurt Me", "David Goggins", "Self Help", 18.49, "https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg"],
  ["The 5 AM Club", "Robin Sharma", "Productivity", 14.49, "https://covers.openlibrary.org/b/isbn/9781443456623-L.jpg"],
  ["Make Time", "Jake Knapp", "Productivity", 15.99, "https://covers.openlibrary.org/b/isbn/9780525572428-L.jpg"],
  ["Essentialism", "Greg McKeown", "Productivity", 14.99, "https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg"],
  ["Dune", "Frank Herbert", "Fiction", 12.99, "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg"],
  ["Steve Jobs", "Walter Isaacson", "Biography", 20.99, "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg"],
  ["Elon Musk", "Walter Isaacson", "Biography", 23.99, "https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg"],
  ["Becoming", "Michelle Obama", "Biography", 17.99, "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg"],
  ["Shoe Dog", "Phil Knight", "Biography", 16.99, "https://covers.openlibrary.org/b/isbn/9781501135910-L.jpg"],
  ["The Intelligent Investor", "Benjamin Graham", "Finance", 21.99, "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg"],
];

async function seedBooks() {
  try {
    await pool.query("DELETE FROM books");

    for (const book of books) {
      await pool.query(
        `INSERT INTO books (title, author, category, price, image)
         VALUES ($1, $2, $3, $4, $5)`,
        book
      );
    }

    console.log("Books seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seedBooks();