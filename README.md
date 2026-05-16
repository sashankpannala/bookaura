# BookAura

BookAura is a full-stack online bookstore built with React, Vite, Express, and PostgreSQL. The app includes a customer storefront, authentication, cart persistence, checkout with delivery address capture, order storage, favorites, ratings, top picks, chatbot recommendations, and an admin dashboard for order and inventory management.

## Tech Stack

- Frontend: React 19, Vite, React Router, Tailwind CSS, Framer Motion, Lucide icons
- Backend: Node.js, Express, PostgreSQL, `pg`, JWT auth, bcrypt password hashing
- Testing: Vitest, React Testing Library, happy-dom
- Persistence: PostgreSQL for users, admins, books, carts, orders, order items, favorites, and delivery addresses

## Main Features

- Dynamic book catalog loaded from the PostgreSQL database
- User and admin authentication with JWT sessions
- Guest and logged-in cart support
- Logged-in cart syncing to the database
- Checkout with customer email, delivery address, payment details, tax, shipping, and order totals
- Stock deduction after successful order placement
- Admin order dashboard with order details
- Book ratings and review counts
- Top Picks of the Week section
- Favorites/wishlist support with database persistence for logged-in users and local fallback for guests
- Chatbot that can answer bookstore questions and recommend books from the database
- Admin inventory management for adding, editing, removing, restoring, and restocking books

## Admin Inventory Management

The admin dashboard now has two main sections: `Orders` and `Inventory`.

The `Inventory` tab lets admins manage the catalog without touching the database manually:

- Add a new book with title, author, category, image URL, price, stock, rating, review count, and top-pick status
- Edit existing book details
- Update stock available for each book
- Mark books as Top Picks
- Remove a book from the customer storefront
- Restore removed books back to the storefront
- View active/removed status for each book
- See total available stock across the catalog

Removed books are soft-deleted using `is_active = false`. This keeps old orders safe because historical order items can still reference the original book records, while the customer storefront only displays active books.

## Backend API Overview

Customer-facing endpoints:

- `GET /api/books` - returns active books for the storefront
- `POST /api/orders` - creates an order, stores delivery address, and reduces book stock
- `POST /api/chatbot` - returns chatbot responses using catalog data
- `GET /api/cart` - loads a logged-in user's cart
- `PUT /api/cart` - saves a logged-in user's cart
- `DELETE /api/cart` - clears a logged-in user's cart
- `GET /api/favorites` - loads a logged-in user's favorites
- `POST /api/favorites/:bookId` - toggles a favorite book

Authentication endpoints:

- `POST /auth/register` - register a customer account
- `POST /auth/login` - log in as a customer
- `POST /admin/register` - register an admin account
- `POST /admin/login` - log in as an admin

Admin endpoints:

- `GET /api/admin/orders` - list all customer orders
- `GET /api/admin/orders/:orderId` - view one order with items
- `GET /api/admin/books` - list all active and removed books
- `POST /api/admin/books` - add a new book
- `PUT /api/admin/books/:bookId` - update book details and stock
- `DELETE /api/admin/books/:bookId` - remove a book from the storefront

Admin endpoints require an admin JWT token in the `Authorization` header:

```txt
Authorization: Bearer <token>
```

## Database Tables

- `users` - customer accounts
- `admins` - admin accounts
- `books` - catalog, stock, ratings, top-pick status, and active status
- `orders` - customer orders, totals, payment status, and delivery address
- `order_items` - books purchased in each order
- `cart_items` - persisted cart items for logged-in users
- `favorite_items` - persisted favorite books for logged-in users

## Demo Accounts

After running the seed script:

- Admin: `admin@bookaura.com` / `admin123`
- User: `user@test.com` / `user123`

## Setup

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create a backend `.env` file with your PostgreSQL connection settings. The backend expects a working PostgreSQL database and uses `backend/db.js` for the connection.

Seed the database:

```bash
cd backend
npm run seed
```

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5000`.

## Useful Scripts

Frontend:

- `npm run dev` - start the Vite dev server
- `npm run build` - build the frontend
- `npm run lint` - run ESLint
- `npm test` - run the Vitest test suite

Backend:

- `npm start` - start the Express API
- `npm run seed` - create/refresh demo data in PostgreSQL

## Testing Notes

The app has Vitest and React Testing Library coverage for major frontend areas, including contexts, components, pages, checkout, authentication, cart behavior, favorites, and admin views.

Current verification performed:

- Frontend production build passes
- Backend syntax checks pass
- Database seed script runs successfully
- Admin inventory API responds correctly with an admin token
- Admin inventory API rejects requests without an admin token

## Project Structure

```txt
backend/
  middleware/       JWT auth middleware
  routes/           Auth, cart, and favorites routes
  schema.sql        PostgreSQL schema
  seed.js           Demo data and schema migration helper
  server.js         Main Express API

src/
  components/       Storefront UI components
  context/          Auth, cart, and books/favorites state
  lib/              API helpers
  pages/            Storefront, checkout, auth, and admin pages
  test/             Test setup and shared mock data
```
