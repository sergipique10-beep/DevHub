import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

  const login = useCallback(async (credenciales) => {
    const data = await authService.login(credenciales);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const register = useCallback(async (datos) => {
    const data = await authService.register(datos);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUsuario(data.usuario);
    return data.usuario;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUsuario(null);
    authService.logout().catch(() => {});
  }, []);

  // Sin este useMemo el value seria un objeto nuevo en cada render del provider,
  // lo que re-renderiza a los ~34 componentes que consumen useAuth aunque ni el
  // usuario ni las acciones hayan cambiado. Las acciones van con useCallback
  // para que la identidad del value dependa solo del estado real.
  const value = useMemo(
    () => ({ usuario, cargando, login, register, logout }),
    [usuario, cargando, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
};
