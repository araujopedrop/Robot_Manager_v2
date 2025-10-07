import React, { createContext, useContext, useEffect, useRef, useState } from "react";
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const abortRef = useRef(null);

  const refresh = async () => {
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("http://localhost:8000/me", {
        credentials: "include",
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("No autenticado");
      const data = await res.json();
      setUsuario(data);
    } catch {
      setUsuario(null);
      // si falló, limpiar el flag por si quedó desincronizado
      localStorage.removeItem("hasSession");
    } finally {
      setCargando(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    const hasSession = localStorage.getItem("hasSession") === "1";
    if (!hasSession) {
      // ✅ No llamamos /me: asumimos que no hay sesión
      setCargando(false);
      return;
    }
    // ✅ Solo si “creemos” que hay sesión, validamos con /me
    refresh();

    return () => abortRef.current?.abort();
  }, []);

  const logout = async () => {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUsuario(null);
      localStorage.removeItem("hasSession");
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
