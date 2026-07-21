import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import proyectoService from "../services/proyectoService";
import reviewService from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
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
} from "../styles/ui";
import { formatearFecha } from "../utils/parse";

const tonoEstado = {
  Abierto: "primary",
  "En progreso": "warning",
  Completado: "success",
  Cancelado: "danger",
};

const estados = ["Abierto", "En progreso", "Completado", "Cancelado"];

const ProyectoDetalle = () => {
  const { id } = useParams();
  const { usuario } = useAuth();
  const queryClient = useQueryClient();

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

  const estadoMutation = useMutation({
    mutationFn: (estado) => proyectoService.cambiarEstado(id, estado),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyecto", id] });
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      toast.success("Estado actualizado");
    },
    onError: (error) => toast.error(error.message),
  });

  const asignarMutation = useMutation({
    mutationFn: (freelancerId) => proyectoService.asignarFreelancer(id, freelancerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proyecto", id] });
      queryClient.invalidateQueries({ queryKey: ["proyectos"] });
      toast.success("Freelancer asignado");
    },
    onError: (error) => toast.error(error.message),
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
    <PageContainer style={{ maxWidth: "760px" }}>
      <Card>
        <Flex $justify="space-between" $wrap>
          <h1 style={{ margin: 0 }}>{proyecto.titulo}</h1>
          <Badge $tone={tonoEstado[proyecto.estado]}>{proyecto.estado}</Badge>
        </Flex>

        <p style={{ marginTop: "10px" }}>{proyecto.descripcion}</p>

        <Flex $wrap $gap={3} style={{ marginTop: "14px", color: "#94a3b8", fontSize: "0.9rem" }}>
          <span>Presupuesto: <strong>{proyecto.presupuesto}€</strong></span>
          <span>Entrega: {formatearFecha(proyecto.deadline)}</span>
          <span>
            Cliente:{" "}
            <Link to={`/perfil/${proyecto.cliente_id?._id}`}>
              {proyecto.cliente_id?.nombre} {proyecto.cliente_id?.apellido}
            </Link>
          </span>
        </Flex>

        <Flex $wrap $gap={0.5} style={{ marginTop: "10px" }}>
          {(proyecto.tecnologiasRequeridas || []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </Flex>

        {proyecto.freelancer_asignado_id && (
          <p style={{ marginTop: "14px" }}>
            Freelancer asignado:{" "}
            <Link to={`/perfil/${proyecto.freelancer_asignado_id._id}`}>
              {proyecto.freelancer_asignado_id.nombre} {proyecto.freelancer_asignado_id.apellido}
            </Link>
          </p>
        )}

        {esClienteDueño && (
          <Flex $gap={1} style={{ marginTop: "18px" }}>
            <Select
              defaultValue={proyecto.estado}
              onChange={(e) => estadoMutation.mutate(e.target.value)}
              style={{ maxWidth: "220px" }}
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </Flex>
        )}
      </Card>

      {esClienteDueño && (
        <Card style={{ marginTop: "20px" }}>
          <SectionTitle>Propuestas recibidas</SectionTitle>
          {proyecto.propuestas?.length ? (
            proyecto.propuestas.map((p) => (
              <Card key={p._id} style={{ marginBottom: "12px" }}>
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
                <p style={{ marginTop: "8px" }}>{p.mensaje}</p>
                {proyecto.estado === "Abierto" && (
                  <Button
                    type="button"
                    onClick={() => asignarMutation.mutate(p.freelancer_id?._id || p.freelancer_id)}
                  >
                    Asignar a este freelancer
                  </Button>
                )}
              </Card>
            ))
          ) : (
            <EmptyState>Todavía no has recibido propuestas.</EmptyState>
          )}
        </Card>
      )}

      {esFreelancer && !esClienteDueño && (
        <Card style={{ marginTop: "20px" }}>
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
        </Card>
      )}

      {esClienteDueño && proyecto.estado === "Completado" && proyecto.freelancer_asignado_id && (
        <Card style={{ marginTop: "20px" }}>
          <SectionTitle>Dejar review</SectionTitle>
          {yaTengoReview ? (
            <EmptyState>Ya has dejado una review para este proyecto.</EmptyState>
          ) : (
            <ReviewForm proyectoId={proyecto._id} freelancerId={proyecto.freelancer_asignado_id._id} />
          )}
        </Card>
      )}
    </PageContainer>
  );
};

export default ProyectoDetalle;
