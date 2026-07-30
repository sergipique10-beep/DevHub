import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import proyectoService from "../services/proyectoService";
import reviewService from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import useMutacion from "../hooks/useMutacion";
import PropuestaForm from "../components/Freelancer/PropuestaForm";
import ReviewForm from "../components/Cliente/ReviewForm";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import {
  PageContainer,
  Card,
  Badge,
  Button,
  Select,
  Flex,
  SectionTitle,
  EmptyState,
  Stack,
} from "../styles/ui";
import { ESTADOS_PROYECTO, TONO_ESTADO } from "../constants/proyecto";
import { formatearFecha } from "../utils/parse";



const Pagina = styled(PageContainer)`
  max-width: 760px;
`;

const Titulo = styled.h1`
  margin: 0;
`;

const Descripcion = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-top: ${({ theme }) => theme.spacing(1.75)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Tecnologias = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
`;

const Asignado = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1.75)};
`;

const SelectorEstado = styled(Select)`
  max-width: 220px;
  margin-top: ${({ theme }) => theme.spacing(2.25)};
`;

const Bloque = styled(Card)`
  margin-top: ${({ theme }) => theme.spacing(2.5)};
`;

const Mensaje = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const ProyectoDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();

  const { data: proyecto, isLoading } = useQuery({
    queryKey: ["proyecto", id],
    queryFn: () => proyectoService.getById(id),
  });

  const freelancerAsignadoId = proyecto?.freelancer_asignado_id?._id;

  const { data: reviews } = useQuery({
    queryKey: ["reviews", freelancerAsignadoId],
    queryFn: () => reviewService.getPorFreelancer(freelancerAsignadoId),
    enabled: Boolean(freelancerAsignadoId),
  });

  const estadoMutation = useMutacion({
    mutationFn: (estado) => proyectoService.cambiarEstado(id, estado),
    exito: "Estado actualizado",
    invalidar: [["proyecto", id], ["proyectos"]],
  });

  const asignarMutation = useMutacion({
    mutationFn: (freelancerId) => proyectoService.asignarFreelancer(id, freelancerId),
    exito: "Freelancer asignado",
    invalidar: [["proyecto", id], ["proyectos"]],
  });

  if (isLoading) return <Loading />;
  if (!proyecto) return <EmptyState>Proyecto no encontrado.</EmptyState>;

  const esClienteDueño = usuario?.id === proyecto.cliente_id?._id;
  const esFreelancer = usuario?.role === "Freelancer";
  const miPropuesta = proyecto.propuestas?.find(
    (p) => (p.freelancer_id?._id || p.freelancer_id) === usuario?.id
  );
  const yaTengoReview = reviews?.some(
    (r) => r.autor_id?._id === usuario?.id && (r.proyecto_id?._id || r.proyecto_id) === proyecto._id
  );

  return (
    <Pagina>
      <Card>
        <Flex $justify="space-between" $wrap>
          <Titulo>{proyecto.titulo}</Titulo>
          <Badge $tone={TONO_ESTADO[proyecto.estado]}>{proyecto.estado}</Badge>
        </Flex>

        <Descripcion>{proyecto.descripcion}</Descripcion>

        <Meta>
          <span>Presupuesto: <strong>{proyecto.presupuesto}€</strong></span>
          <span>Entrega: {formatearFecha(proyecto.deadline)}</span>
          <span>
            Cliente:{" "}
            <Link to={`/perfil/${proyecto.cliente_id?._id}`}>
              {proyecto.cliente_id?.nombre} {proyecto.cliente_id?.apellido}
            </Link>
          </span>
        </Meta>

        <Tecnologias $wrap $gap={0.5}>
          {(proyecto.tecnologiasRequeridas || []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </Tecnologias>

        {proyecto.freelancer_asignado_id && (
          <Asignado>
            Freelancer asignado:{" "}
            <Link to={`/perfil/${proyecto.freelancer_asignado_id._id}`}>
              {proyecto.freelancer_asignado_id.nombre} {proyecto.freelancer_asignado_id.apellido}
            </Link>
          </Asignado>
        )}

        {esClienteDueño && (
          <SelectorEstado
            aria-label="Estado del proyecto"
            defaultValue={proyecto.estado}
            onChange={(e) => estadoMutation.mutate(e.target.value)}
          >
            {ESTADOS_PROYECTO.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </SelectorEstado>
        )}
      </Card>

      {esClienteDueño && (
        <Bloque>
          <SectionTitle>Propuestas recibidas</SectionTitle>
          {proyecto.propuestas?.length ? (
            <Stack>
              {proyecto.propuestas.map((p) => (
                <Card key={p._id}>
                  <Flex $justify="space-between" $wrap>
                    <div>
                      <Link to={`/perfil/${p.freelancer_id?._id}`}>
                        <strong>
                          {p.freelancer_id?.nombre} {p.freelancer_id?.apellido}
                        </strong>
                      </Link>
                      <RatingStars
                        promedio={p.freelancer_id?.rating?.promedio}
                        cantidad={p.freelancer_id?.rating?.cantidad}
                      />
                    </div>
                    <strong>{p.precio}€</strong>
                  </Flex>
                  <Mensaje>{p.mensaje}</Mensaje>
                  {proyecto.estado === "Abierto" && (
                    <Button
                      type="button"
                      onClick={() =>
                        asignarMutation.mutate(p.freelancer_id?._id || p.freelancer_id)
                      }
                    >
                      Asignar a este freelancer
                    </Button>
                  )}
                </Card>
              ))}
            </Stack>
          ) : (
            <EmptyState>Todavía no has recibido propuestas.</EmptyState>
          )}
        </Bloque>
      )}

      {esFreelancer && !esClienteDueño && (
        <Bloque>
          <SectionTitle>Tu propuesta</SectionTitle>
          {miPropuesta ? (
            <p>
              Ya enviaste una propuesta de <strong>{miPropuesta.precio}€</strong>: "{miPropuesta.mensaje}"
            </p>
          ) : proyecto.estado === "Abierto" ? (
            <PropuestaForm proyectoId={proyecto._id} />
          ) : (
            <EmptyState>Este proyecto ya no admite nuevas propuestas.</EmptyState>
          )}
        </Bloque>
      )}

      {esClienteDueño && proyecto.estado === "Completado" && proyecto.freelancer_asignado_id && (
        <Bloque>
          <SectionTitle>Dejar review</SectionTitle>
          {yaTengoReview ? (
            <EmptyState>Ya has dejado una review para este proyecto.</EmptyState>
          ) : (
            <ReviewForm
              proyectoId={proyecto._id}
              freelancerId={proyecto.freelancer_asignado_id._id}
            />
          )}
        </Bloque>
      )}
    </Pagina>
  );
};

export default ProyectoDetalle;
