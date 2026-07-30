import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import proyectoService from "../../services/proyectoService";
import { useAuth } from "../../context/AuthContext";
import Loading from "../common/Loading";
import { Card, Badge, EmptyState, Stack, CardTitle, MutedText } from "../../styles/ui";
import { TONO_ESTADO } from "../../constants/proyecto";
import { formatearFecha } from "../../utils/parse";

const Detalle = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Propuestas = () => {
  const { usuario } = useAuth();
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ["proyectos", "todos"],
    queryFn: () => proyectoService.getAll(),
  });

  // Recorre todos los proyectos buscando la propuesta propia dentro de cada uno:
  // se memoriza para no repetir el doble bucle en cada render.
  const misPropuestas = useMemo(
    () =>
      (proyectos || [])
        .map((proyecto) => {
          const propuesta = proyecto.propuestas?.find(
            (p) => (p.freelancer_id?._id || p.freelancer_id) === usuario.id
          );
          return propuesta ? { proyecto, propuesta } : null;
        })
        .filter(Boolean),
    [proyectos, usuario.id]
  );

  if (isLoading) return <Loading />;

  if (!misPropuestas.length) {
    return <EmptyState>Todavía no has enviado ninguna propuesta.</EmptyState>;
  }

  return (
    <Stack $gap={1.75}>
      {misPropuestas.map(({ proyecto, propuesta }) => (
        <Card key={proyecto._id}>
          <Link to={`/proyectos/${proyecto._id}`}>
            <CardTitle>{proyecto.titulo}</CardTitle>
          </Link>
          <Badge $tone={TONO_ESTADO[proyecto.estado]}>{proyecto.estado}</Badge>
          <Detalle>
            Tu propuesta: <strong>{propuesta.precio}€</strong> — {propuesta.mensaje}
          </Detalle>
          <MutedText>Enviada el {formatearFecha(propuesta.createdAt)}</MutedText>
        </Card>
      ))}
    </Stack>
  );
};

export default Propuestas;
