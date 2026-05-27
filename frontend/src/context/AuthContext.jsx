import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { readJsonStorage, writeJsonStorage } from "../utils/storage";

const decodeTokenPayload = (token) => {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=");
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => readJsonStorage("user", null));

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    if (!user) {
      const payload = decodeTokenPayload(token);
      if (payload) {
        setUser(payload.user ?? payload);
      }
    }
  }, [token, user]);

  const login = (newToken, nextUser) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    if (typeof nextUser !== "undefined") {
      writeJsonStorage("user", nextUser);
      setUser(nextUser);
      return;
    }

    const payload = decodeTokenPayload(newToken);
    const fallbackUser = payload ? (payload.user ?? payload) : null;
    writeJsonStorage("user", fallbackUser);
    setUser(fallbackUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    writeJsonStorage("user", undefined);
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  };

  const value = useMemo(() => ({
    token,
    user,
    login,
    logout,
    isAuthenticated: Boolean(token),
  }), [token, user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);