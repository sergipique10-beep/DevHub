import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import proyectoService from "../../services/proyectoService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import { Card, Badge, EmptyState } from "../../styles/ui";
import { formatearFecha } from "../../utils/parse";

const tonoEstado = {
  Abierto: "primary",
  "En progreso": "warning",
  Completado: "success",
  Cancelado: "danger",
};

const Propuestas = () => {
  const { usuario } = useAuth();
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ["proyectos", "todos"],
    queryFn: () => proyectoService.getAll(),
  });

  if (isLoading) return <Loading />;

  const misPropuestas = (proyectos || [])
    .map((proyecto) => {
      const propuesta = proyecto.propuestas?.find(
        (p) => (p.freelancer_id?._id || p.freelancer_id) === usuario.id
      );
      return propuesta ? { proyecto, propuesta } : null;
    })
    .filter(Boolean);

  if (!misPropuestas.length) {
    return <EmptyState>Todavía no has enviado ninguna propuesta.</EmptyState>;
  }

  return (
    <div>
      {misPropuestas.map(({ proyecto, propuesta }) => (
        <Card key={proyecto._id} style={{ marginBottom: "14px" }}>
          <Link to={`/proyectos/${proyecto._id}`}>
            <h3 style={{ margin: "0 0 6px" }}>{proyecto.titulo}</h3>
          </Link>
          <Badge $tone={tonoEstado[proyecto.estado]}>{proyecto.estado}</Badge>
          <p style={{ marginTop: "8px" }}>
            Tu propuesta: <strong>{propuesta.precio}€</strong> — {propuesta.mensaje}
          </p>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
            Enviada el {formatearFecha(propuesta.createdAt)}
          </p>
        </Card>
      ))}
    </div>
  );
};

export default Propuestas;
