import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthProvider from "./AuthContext";
import { useAuth } from "./authContext";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("AuthContext", () => {
  it("starts as guest after loading", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isGuest).toBe(true);
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.isAdmin).toBe(false);
  });

  it("restores user session from localStorage", async () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("role", "user");
    localStorage.setItem("user", JSON.stringify({ email: "a@test.com" }));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user.email).toBe("a@test.com");
    expect(result.current.isAdmin).toBe(false);
  });

  it("logs in a user via API", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "tok",
        user: { email: "user@test.com", firstName: "Test" },
      }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loginUser("user@test.com", "pass");
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(localStorage.getItem("role")).toBe("user");
    expect(localStorage.getItem("token")).toBe("tok");
  });

  it("logs in an admin via API", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "admin-tok",
        admin: { email: "admin@test.com", name: "Admin" },
      }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.loginAdmin("admin@test.com", "pass");
    });

    expect(result.current.isAdmin).toBe(true);
    expect(localStorage.getItem("role")).toBe("admin");
  });

  it("logs out and clears storage", async () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("role", "user");
    localStorage.setItem("user", JSON.stringify({ email: "a@test.com" }));

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.logout());

    expect(result.current.isGuest).toBe(true);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("throws on failed login", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid credentials" }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(
      result.current.loginUser("bad@test.com", "wrong")
    ).rejects.toThrow("Invalid credentials");
  });
});
