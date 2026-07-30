import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { FiGithub, FiLinkedin, FiGlobe, FiCheckCircle } from "react-icons/fi";
import servicioService from "../../services/servicioService";
import portfolioService from "../../services/portfolioService";
import reviewService from "../../services/reviewService";
import Avatar from "../common/Avatar";
import RatingStars from "../common/RatingStars";
import Loading from "../common/Loading";
import {
  Card,
  Grid,
  Badge,
  SectionTitle,
  EmptyState,
  Flex,
  Stack,
  MutedText,
  Thumb,
} from "../../styles/ui";

const Header = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2.5)};
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Enlaces = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  a {
    color: ${({ theme }) => theme.colors.textMuted};
    display: inline-flex;
  }
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const Portada = styled(Thumb)`
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  background: ${({ theme }) => theme.colors.background};
`;

const Titulo = styled.h1`
  margin: 0;
`;

const TituloTarjeta = styled.h3`
  margin: 0 0 6px;
`;

const Bio = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1.25)};
  max-width: 560px;
`;

const Precio = styled.p`
  font-weight: 700;
`;

const Tags = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const Comentario = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

const PerfilFreelancer = ({ usuario }) => {
  const { data: servicios, isLoading: cargandoServicios } = useQuery({
    queryKey: ["servicios", { freelancer_id: usuario._id }],
    queryFn: () => servicioService.getAll({ freelancer_id: usuario._id }),
  });

  const { data: portfolio, isLoading: cargandoPortfolio } = useQuery({
    queryKey: ["portfolio", usuario._id],
    queryFn: () => portfolioService.getPorFreelancer(usuario._id),
  });

  const { data: reviews, isLoading: cargandoReviews } = useQuery({
    queryKey: ["reviews", usuario._id],
    queryFn: () => reviewService.getPorFreelancer(usuario._id),
  });

  return (
    <>
      <Header>
        <Avatar nombre={usuario.nombre} fotoPerfil={usuario.fotoPerfil} size="88px" />
        <div>
          <Flex $gap={1}>
            <Titulo>
              {usuario.nombre} {usuario.apellido}
            </Titulo>
            {usuario.verificado && (
              <Badge $tone="success">
                <FiCheckCircle /> Verificado
              </Badge>
            )}
          </Flex>
          <MutedText>{usuario.ubicacion || "Ubicación no especificada"}</MutedText>
          <RatingStars promedio={usuario.rating?.promedio} cantidad={usuario.rating?.cantidad} />
          <Bio>{usuario.bio}</Bio>

          <Tags $wrap $gap={1}>
            {(usuario.skills || []).map((s) => (
              <Badge key={s.nombre}>
                {s.nombre} · {s.nivel}/5
              </Badge>
            ))}
          </Tags>

          <Enlaces>
            {usuario.enlaces?.github && (
              <a href={usuario.enlaces.github} target="_blank" rel="noreferrer">
                <FiGithub size={20} />
              </a>
            )}
            {usuario.enlaces?.linkedin && (
              <a href={usuario.enlaces.linkedin} target="_blank" rel="noreferrer">
                <FiLinkedin size={20} />
              </a>
            )}
            {usuario.enlaces?.portfolio && (
              <a href={usuario.enlaces.portfolio} target="_blank" rel="noreferrer">
                <FiGlobe size={20} />
              </a>
            )}
          </Enlaces>
        </div>
      </Header>

      <Section>
        <SectionTitle>Servicios</SectionTitle>
        {cargandoServicios ? (
          <Loading />
        ) : servicios?.length ? (
          <Grid>
            {servicios.map((s) => (
              <Card key={s._id}>
                <TituloTarjeta>{s.titulo}</TituloTarjeta>
                <MutedText $size="0.9rem">{s.categoria}</MutedText>
                <Precio>{s.precioBase}€</Precio>
              </Card>
            ))}
          </Grid>
        ) : (
          <EmptyState>Sin servicios publicados todavía.</EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>Portfolio</SectionTitle>
        {cargandoPortfolio ? (
          <Loading />
        ) : portfolio?.length ? (
          <Grid>
            {portfolio.map((p) => (
              <Card key={p._id}>
                {p.imagenes?.[0] && <Portada src={p.imagenes[0]} alt={p.titulo} />}
                <TituloTarjeta>{p.titulo}</TituloTarjeta>
                <MutedText $size="0.9rem">{p.descripcion}</MutedText>
                <Tags $wrap $gap={0.5}>
                  {(p.tecnologias || []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </Tags>
                <Tags $gap={1}>
                  {p.enlaceProyecto && (
                    <a href={p.enlaceProyecto} target="_blank" rel="noreferrer">
                      Demo
                    </a>
                  )}
                  {p.repositorioGithub && (
                    <a href={p.repositorioGithub} target="_blank" rel="noreferrer">
                      Repositorio
                    </a>
                  )}
                </Tags>
              </Card>
            ))}
          </Grid>
        ) : (
          <EmptyState>Sin proyectos en el portfolio todavía.</EmptyState>
        )}
      </Section>

      <Section>
        <SectionTitle>Reviews</SectionTitle>
        {cargandoReviews ? (
          <Loading />
        ) : reviews?.length ? (
          <Stack>
            {reviews.map((r) => (
              <Card key={r._id}>
                <Flex $justify="space-between">
                  <strong>
                    {r.autor_id?.nombre} {r.autor_id?.apellido}
                  </strong>
                  <RatingStars promedio={r.puntuacion} />
                </Flex>
                <Comentario>{r.comentario}</Comentario>
              </Card>
            ))}
          </Stack>
        ) : (
          <EmptyState>Sin reviews todavía.</EmptyState>
        )}
      </Section>
    </>
  );
};

export default PerfilFreelancer;
