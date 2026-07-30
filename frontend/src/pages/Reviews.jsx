import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import reviewService from "../services/reviewService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import {
  PageContainer,
  PageTitle,
  Card,
  EmptyState,
  Flex,
  Stack,
  MutedText,
} from "../styles/ui";
import { formatearFecha } from "../utils/parse";

const Pagina = styled(PageContainer)`
  max-width: 640px;
`;

const Comentario = styled.p`
  margin: ${({ theme }) => theme.spacing(1)} 0;
`;

const Aspectos = styled(Flex)`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Fecha = styled(MutedText)`
  font-size: 0.8rem;
  margin-top: 6px;
`;

const Reviews = () => {
  const { usuario } = useAuth();
  const esFreelancer = usuario.role === "Freelancer";

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", usuario.id],
    queryFn: () => reviewService.getPorFreelancer(usuario.id),
    enabled: esFreelancer,
  });

  return (
    <Pagina>
      <PageTitle>Reviews recibidas</PageTitle>
      {!esFreelancer ? (
        <EmptyState>
          Las reviews que has escrito aparecen en la página de cada proyecto completado.
        </EmptyState>
      ) : isLoading ? (
        <Loading />
      ) : reviews?.length ? (
        <Stack $gap={1.75}>
          {reviews.map((r) => (
            <Card key={r._id}>
              <Flex $justify="space-between">
                <strong>
                  {r.autor_id?.nombre} {r.autor_id?.apellido}
                </strong>
                <RatingStars promedio={r.puntuacion} />
              </Flex>
              <Comentario>{r.comentario}</Comentario>
              <Aspectos $gap={2} $wrap>
                <span>Comunicación: {r.aspectos.comunicacion}/5</span>
                <span>Calidad: {r.aspectos.calidad}/5</span>
                <span>Puntualidad: {r.aspectos.puntualidad}/5</span>
              </Aspectos>
              <Fecha>{formatearFecha(r.createdAt)}</Fecha>
            </Card>
          ))}
        </Stack>
      ) : (
        <EmptyState>Todavía no has recibido reviews.</EmptyState>
      )}
    </Pagina>
  );
};

export default Reviews;
