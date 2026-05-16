import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import { API_URL } from "../lib/api";

async function parseError(response, fallback) {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (role === "user") {
          setUser(parsedUser);
          setIsGuest(false);
        } else if (role === "admin") {
          setAdmin(parsedUser);
          setIsGuest(false);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setIsGuest(true);
      }
    } else {
      setIsGuest(true);
    }
    setLoading(false);
  }, []);

  const persistSession = (token, profile, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(profile));
    localStorage.setItem("role", role);
  };

  const loginUser = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Login failed"));
    }

    const data = await response.json();
    persistSession(data.token, data.user, "user");
    setUser(data.user);
    setAdmin(null);
    setIsGuest(false);
    return data;
  };

  const registerUser = async (email, password, firstName, lastName) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        firstName,
        lastName,
      }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Registration failed"));
    }

    const data = await response.json();
    persistSession(data.token, data.user, "user");
    setUser(data.user);
    setAdmin(null);
    setIsGuest(false);
    return data;
  };

  const loginAdmin = async (email, password) => {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Login failed"));
    }

    const data = await response.json();
    persistSession(data.token, data.admin, "admin");
    setAdmin(data.admin);
    setUser(null);
    setIsGuest(false);
    return data;
  };

  const registerAdmin = async (email, password, name) => {
    const response = await fetch(`${API_URL}/admin/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim(), password, name }),
    });

    if (!response.ok) {
      throw new Error(await parseError(response, "Registration failed"));
    }

    const data = await response.json();
    persistSession(data.token, data.admin, "admin");
    setAdmin(data.admin);
    setUser(null);
    setIsGuest(false);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setAdmin(null);
    setIsGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        isGuest,
        isLoggedIn: !!user || !!admin,
        isAdmin: !!admin,
        loginUser,
        registerUser,
        loginAdmin,
        registerAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
