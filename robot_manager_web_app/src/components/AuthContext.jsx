import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const logout = async () => {
    await fetch("http://localhost:8000/logout", {
      method: "POST",
      credentials: "include",
    });
    setUsuario(null);
  };

  useEffect(() => {
    fetch("http://localhost:8000/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Token inválido");
        return res.json();
      })
      .then((data) => setUsuario(data))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, cargando, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);
