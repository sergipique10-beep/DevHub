import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import proyectoService from "../../services/proyectoService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import ProyectoCard from "../common/ProyectoCard";
import { Grid, EmptyState } from "../../styles/ui";

const Proyectos = () => {
  const { usuario } = useAuth();
  const esCliente = usuario.role === "Cliente";

  const { data: proyectos, isLoading } = useQuery({
    queryKey: esCliente ? ["proyectos", { cliente_id: usuario.id }] : ["proyectos", "todos"],
    queryFn: () =>
      esCliente ? proyectoService.getAll({ cliente_id: usuario.id }) : proyectoService.getAll(),
  });

  // El cliente ya recibe su lista filtrada del servidor; el freelancer recibe
  // todos los proyectos y hay que quedarse con los que tiene asignados.
  const lista = useMemo(() => {
    if (esCliente) return proyectos || [];
    return (proyectos || []).filter(
      (p) => (p.freelancer_asignado_id?._id || p.freelancer_asignado_id) === usuario.id
    );
  }, [proyectos, esCliente, usuario.id]);

  if (isLoading) return <Loading />;

  if (!lista.length) {
    return (
      <EmptyState>
        {esCliente
          ? "Todavía no has publicado proyectos."
          : "No tienes proyectos asignados todavía."}
      </EmptyState>
    );
  }

  return (
    <Grid>
      {lista.map((p) => (
        <ProyectoCard key={p._id} proyecto={p} mostrarPropuestas={esCliente} />
      ))}
    </Grid>
  );
};

export default Proyectos;
