const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "bookaura-dev-secret-change-in-production";

function getToken(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7);
}

function optionalAuth(req, res, next) {
  const token = getToken(req);
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}

function requireUser(req, res, next) {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ error: "Login required" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "user") {
      return res.status(403).json({ error: "User account required" });
    }
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
}

module.exports = { optionalAuth, requireUser, JWT_SECRET };
