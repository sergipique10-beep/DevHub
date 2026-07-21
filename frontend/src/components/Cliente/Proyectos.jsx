import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import proyectoService from "../../services/proyectoService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import { Card, Grid, Badge, EmptyState } from "../../styles/ui";
import { formatearFecha } from "../../utils/parse";

const tonoEstado = {
  Abierto: "primary",
  "En progreso": "warning",
  Completado: "success",
  Cancelado: "danger",
};

const Proyectos = () => {
  const { usuario } = useAuth();
  const esCliente = usuario.role === "Cliente";

  const { data: proyectos, isLoading } = useQuery({
    queryKey: esCliente ? ["proyectos", { cliente_id: usuario.id }] : ["proyectos", "todos"],
    queryFn: () =>
      esCliente ? proyectoService.getAll({ cliente_id: usuario.id }) : proyectoService.getAll(),
  });

  if (isLoading) return <Loading />;

  const lista = esCliente
    ? proyectos
    : (proyectos || []).filter(
        (p) => (p.freelancer_asignado_id?._id || p.freelancer_asignado_id) === usuario.id
      );

  if (!lista?.length) {
    return (
      <EmptyState>
        {esCliente ? "Todavía no has publicado proyectos." : "No tienes proyectos asignados todavía."}
      </EmptyState>
    );
  }

  return (
    <Grid>
      {lista.map((p) => (
        <Card key={p._id} as={Link} to={`/proyectos/${p._id}`} style={{ display: "block" }}>
          <h3 style={{ margin: "0 0 6px" }}>{p.titulo}</h3>
          <Badge $tone={tonoEstado[p.estado]}>{p.estado}</Badge>
          <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px" }}>
            Presupuesto: {p.presupuesto}€ · Entrega: {formatearFecha(p.deadline)}
          </p>
          {esCliente && (
            <p style={{ fontSize: "0.85rem", color: "#94a3b8" }}>
              {p.propuestas?.length || 0} propuesta(s) recibida(s)
            </p>
          )}
        </Card>
      ))}
    </Grid>
  );
};

export default Proyectos;
