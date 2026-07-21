import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import usuarioService from "../services/usuarioService";
import servicioService from "../services/servicioService";
import proyectoService from "../services/proyectoService";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import { PageContainer, PageTitle, Card, Grid, Button, Flex } from "../styles/ui";

const StatValue = styled.p`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  margin: 0;
`;

const StatCard = ({ label, value }) => (
  <Card>
    <StatLabel>{label}</StatLabel>
    <StatValue>{value}</StatValue>
  </Card>
);

const DashboardFreelancer = ({ usuarioId }) => {
  const { data: perfil, isLoading: cargandoPerfil } = useQuery({
    queryKey: ["usuario", usuarioId],
    queryFn: () => usuarioService.getById(usuarioId),
  });
  const { data: servicios, isLoading: cargandoServicios } = useQuery({
    queryKey: ["servicios", { freelancer_id: usuarioId }],
    queryFn: () => servicioService.getAll({ freelancer_id: usuarioId }),
  });
  const { data: proyectos, isLoading: cargandoProyectos } = useQuery({
    queryKey: ["proyectos", "todos"],
    queryFn: () => proyectoService.getAll(),
  });

  if (cargandoPerfil || cargandoServicios || cargandoProyectos) return <Loading />;

  const asignados = (proyectos || []).filter(
    (p) => (p.freelancer_asignado_id?._id || p.freelancer_asignado_id) === usuarioId
  );
  const propuestasEnviadas = (proyectos || []).filter((p) =>
    p.propuestas?.some((prop) => (prop.freelancer_id?._id || prop.freelancer_id) === usuarioId)
  );

  return (
    <>
      <Grid>
        <StatCard label="Servicios activos" value={servicios?.length || 0} />
        <StatCard label="Propuestas enviadas" value={propuestasEnviadas.length} />
        <StatCard
          label="Proyectos en progreso/completados"
          value={asignados.length}
        />
        <Card>
          <StatLabel>Rating</StatLabel>
          <RatingStars promedio={perfil?.rating?.promedio} cantidad={perfil?.rating?.cantidad} />
        </Card>
      </Grid>

      <Flex $gap={1.5} $wrap style={{ marginTop: "20px" }}>
        <Button as={Link} to="/crear-servicio">Publicar servicio</Button>
        <Button as={Link} to="/mi-portfolio" $variant="secondary">Editar portfolio</Button>
        <Button as={Link} to="/propuestas" $variant="secondary">Ver mis propuestas</Button>
      </Flex>
    </>
  );
};

const DashboardCliente = ({ usuarioId }) => {
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ["proyectos", { cliente_id: usuarioId }],
    queryFn: () => proyectoService.getAll({ cliente_id: usuarioId }),
  });

  if (isLoading) return <Loading />;

  const porEstado = (estado) => (proyectos || []).filter((p) => p.estado === estado).length;
  const propuestasRecibidas = (proyectos || []).reduce(
    (total, p) => total + (p.propuestas?.length || 0),
    0
  );

  return (
    <>
      <Grid>
        <StatCard label="Proyectos abiertos" value={porEstado("Abierto")} />
        <StatCard label="En progreso" value={porEstado("En progreso")} />
        <StatCard label="Completados" value={porEstado("Completado")} />
        <StatCard label="Propuestas recibidas" value={propuestasRecibidas} />
      </Grid>

      <Flex $gap={1.5} $wrap style={{ marginTop: "20px" }}>
        <Button as={Link} to="/crear-proyecto">Publicar proyecto</Button>
        <Button as={Link} to="/explorar" $variant="secondary">Buscar freelancers</Button>
      </Flex>
    </>
  );
};

const DashboardAdmin = () => {
  const { data: usuarios, isLoading: cargandoUsuarios } = useQuery({
    queryKey: ["usuarios"],
    queryFn: () => usuarioService.getAll(),
  });
  const { data: proyectos, isLoading: cargandoProyectos } = useQuery({
    queryKey: ["proyectos", "todos"],
    queryFn: () => proyectoService.getAll(),
  });

  if (cargandoUsuarios || cargandoProyectos) return <Loading />;

  const noVerificados = (usuarios || []).filter(
    (u) => u.role === "Freelancer" && !u.verificado
  ).length;

  return (
    <>
      <Grid>
        <StatCard label="Usuarios totales" value={usuarios?.length || 0} />
        <StatCard label="Freelancers sin verificar" value={noVerificados} />
        <StatCard label="Proyectos totales" value={proyectos?.length || 0} />
      </Grid>
      <Flex style={{ marginTop: "20px" }}>
        <Button as={Link} to="/admin">Ir al panel de administración</Button>
      </Flex>
    </>
  );
};

const Dashboard = () => {
  const { usuario } = useAuth();

  return (
    <PageContainer>
      <PageTitle>Hola, {usuario.nombre}</PageTitle>
      {usuario.role === "Freelancer" && <DashboardFreelancer usuarioId={usuario.id} />}
      {usuario.role === "Cliente" && <DashboardCliente usuarioId={usuario.id} />}
      {usuario.role === "Admin" && <DashboardAdmin />}
    </PageContainer>
  );
};

export default Dashboard;
