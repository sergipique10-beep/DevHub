import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ roles, children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <Loading />;
  if (!usuario) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(usuario.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
