import { createContext, useContext, useEffect, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

const TOKEN_KEY = "devhub_token";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setCargando(false);
      return;
    }
    authService
      .verify()
      .then((data) => setUsuario(data.usuario))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUsuario(null);
      })
      .finally(() => setCargando(false));
  }, []);

  const login = async (credenciales) => {
    const data = await authService.login(credenciales);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUsuario(data.usuario);
    return data.usuario;
  };

  const register = async (datos) => {
    const data = await authService.register(datos);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUsuario(data.usuario);
    return data.usuario;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
    authService.logout().catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
