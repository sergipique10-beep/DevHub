import { useQuery } from "@tanstack/react-query";
import reviewService from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import { PageContainer, PageTitle, Card, EmptyState, Flex } from "../styles/ui";
import { formatearFecha } from "../utils/parse";

const Reviews = () => {
  const { usuario } = useAuth();
  const esFreelancer = usuario.role === "Freelancer";

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", usuario.id],
    queryFn: () => reviewService.getPorFreelancer(usuario.id),
    enabled: esFreelancer,
  });

  return (
    <PageContainer style={{ maxWidth: "640px" }}>
      <PageTitle>Reviews recibidas</PageTitle>
      {!esFreelancer ? (
        <EmptyState>
          Las reviews que has escrito aparecen en la página de cada proyecto completado.
        </EmptyState>
      ) : isLoading ? (
        <Loading />
      ) : reviews?.length ? (
        reviews.map((r) => (
          <Card key={r._id} style={{ marginBottom: "14px" }}>
            <Flex $justify="space-between">
              <strong>
                {r.autor_id?.nombre} {r.autor_id?.apellido}
              </strong>
              <RatingStars promedio={r.puntuacion} />
            </Flex>
            <p style={{ margin: "8px 0" }}>{r.comentario}</p>
            <Flex $gap={2} style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              <span>Comunicación: {r.aspectos.comunicacion}/5</span>
              <span>Calidad: {r.aspectos.calidad}/5</span>
              <span>Puntualidad: {r.aspectos.puntualidad}/5</span>
            </Flex>
            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "6px" }}>
              {formatearFecha(r.createdAt)}
            </p>
          </Card>
        ))
      ) : (
        <EmptyState>Todavía no has recibido reviews.</EmptyState>
      )}
    </PageContainer>
  );
};

export default Reviews;
