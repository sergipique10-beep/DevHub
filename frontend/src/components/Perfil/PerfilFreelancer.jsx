import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { FiGithub, FiLinkedin, FiGlobe, FiCheckCircle } from "react-icons/fi";
import servicioService from "../../services/servicioService";
import portfolioService from "../../services/portfolioService";
import reviewService from "../../services/reviewService";
import Avatar from "../common/Avatar";
import RatingStars from "../common/RatingStars";
import Loading from "../common/Loading";
import { Card, Grid, Badge, SectionTitle, EmptyState, Flex } from "../../styles/ui";

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

const SkillTag = styled.span`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const PortfolioCard = styled(Card)`
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.radius.sm};
    margin-bottom: ${({ theme }) => theme.spacing(1)};
    background: ${({ theme }) => theme.colors.background};
  }
`;

const ReviewCard = styled(Card)`
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
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
            <h1 style={{ margin: 0 }}>
              {usuario.nombre} {usuario.apellido}
            </h1>
            {usuario.verificado && (
              <Badge $tone="success">
                <FiCheckCircle /> Verificado
              </Badge>
            )}
          </Flex>
          <p style={{ color: "#94a3b8", margin: "4px 0" }}>
            {usuario.ubicacion || "Ubicación no especificada"}
          </p>
          <RatingStars promedio={usuario.rating?.promedio} cantidad={usuario.rating?.cantidad} />
          <p style={{ marginTop: "10px", maxWidth: "560px" }}>{usuario.bio}</p>

          <Flex $wrap $gap={1} style={{ marginTop: "8px" }}>
            {(usuario.skills || []).map((s) => (
              <SkillTag key={s.nombre}>
                {s.nombre} · {s.nivel}/5
              </SkillTag>
            ))}
          </Flex>

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
                <h3 style={{ margin: "0 0 6px" }}>{s.titulo}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{s.categoria}</p>
                <p style={{ fontWeight: 700 }}>{s.precioBase}€</p>
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
              <PortfolioCard key={p._id}>
                {p.imagenes?.[0] && <img src={p.imagenes[0]} alt={p.titulo} />}
                <h3 style={{ margin: "0 0 6px" }}>{p.titulo}</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>{p.descripcion}</p>
                <Flex $wrap $gap={0.5} style={{ marginTop: "8px" }}>
                  {(p.tecnologias || []).map((t) => (
                    <SkillTag key={t}>{t}</SkillTag>
                  ))}
                </Flex>
                <Flex $gap={1} style={{ marginTop: "10px" }}>
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
                </Flex>
              </PortfolioCard>
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
          reviews.map((r) => (
            <ReviewCard key={r._id}>
              <Flex $justify="space-between">
                <strong>
                  {r.autor_id?.nombre} {r.autor_id?.apellido}
                </strong>
                <RatingStars promedio={r.puntuacion} />
              </Flex>
              <p style={{ margin: "8px 0 0" }}>{r.comentario}</p>
            </ReviewCard>
          ))
        ) : (
          <EmptyState>Sin reviews todavía.</EmptyState>
        )}
      </Section>
    </>
  );
};

export default PerfilFreelancer;
