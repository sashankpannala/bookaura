const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();
const JWT_SECRET =
  process.env.JWT_SECRET || "bookaura-dev-secret-change-in-production";

function signToken(id, email, role) {
  return jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: "7d" });
}

function formatUser(row) {
  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

function formatAdmin(row) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
  };
}

router.post("/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, $4, false)
       RETURNING id, email, first_name, last_name`,
      [normalizedEmail, hashedPassword, firstName?.trim() || "", lastName?.trim() || ""]
    );

    const user = formatUser(result.rows[0]);
    const token = signToken(user.id, user.email, "user");

    res.status(201).json({ token, user });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND is_admin = false",
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = formatUser(row);
    const token = signToken(user.id, user.email, "user");

    res.json({ token, user });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email.trim().toLowerCase(),
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const row = result.rows[0];
    const valid = await bcrypt.compare(password, row.password);

    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = formatAdmin(row);
    const token = signToken(admin.id, admin.email, "admin");

    res.json({ token, admin });
  } catch (error) {
    console.error("Admin login error:", error.message);
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/admin/register", async (req, res) => {
  const client = await pool.connect();

  try {
    const { email, password, name } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query("SELECT id FROM admins WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Admin email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (email, password, first_name, last_name, is_admin)
       VALUES ($1, $2, $3, '', true)
       RETURNING id`,
      [normalizedEmail, hashedPassword, name?.trim() || "Admin"]
    );

    const userId = userResult.rows[0].id;

    const adminResult = await client.query(
      `INSERT INTO admins (user_id, email, password, name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name`,
      [userId, normalizedEmail, hashedPassword, name?.trim() || "Admin"]
    );

    await client.query("COMMIT");

    const admin = formatAdmin(adminResult.rows[0]);
    const token = signToken(admin.id, admin.email, "admin");

    res.status(201).json({ token, admin });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin register error:", error.message);
    res.status(500).json({ error: "Registration failed" });
  } finally {
    client.release();
  }
});

module.exports = router;
