import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import usuarioService from "../services/usuarioService";
import servicioService from "../services/servicioService";
import proyectoService from "../services/proyectoService";
import Loading from "../components/common/Loading";
import RatingStars from "../components/common/RatingStars";
import { PageContainer, PageTitle, Card, Grid, Button, Flex, MutedText } from "../styles/ui";

const StatValue = styled.p`
  font-size: 1.8rem;
  font-weight: 800;
  margin: 4px 0 0;
  color: ${({ theme }) => theme.colors.primary};
`;

const Acciones = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing(2.5)};
`;

const StatCard = ({ label, value }) => (
  <Card>
    <MutedText>{label}</MutedText>
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

  // Dos recorridos sobre la lista completa de proyectos: se memorizan para no
  // repetirlos en cada render (p. ej. al refrescar cualquier otra query).
  const { asignados, propuestasEnviadas } = useMemo(() => {
    const todos = proyectos || [];
    return {
      asignados: todos.filter(
        (p) => (p.freelancer_asignado_id?._id || p.freelancer_asignado_id) === usuarioId
      ),
      propuestasEnviadas: todos.filter((p) =>
        p.propuestas?.some((prop) => (prop.freelancer_id?._id || prop.freelancer_id) === usuarioId)
      ),
    };
  }, [proyectos, usuarioId]);

  if (cargandoPerfil || cargandoServicios || cargandoProyectos) return <Loading />;

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
          <MutedText>Rating</MutedText>
          <RatingStars promedio={perfil?.rating?.promedio} cantidad={perfil?.rating?.cantidad} />
        </Card>
      </Grid>

      <Acciones $gap={1.5} $wrap>
        <Button as={Link} to="/crear-servicio">Publicar servicio</Button>
        <Button as={Link} to="/mi-portfolio" $variant="secondary">Editar portfolio</Button>
        <Button as={Link} to="/propuestas" $variant="secondary">Ver mis propuestas</Button>
      </Acciones>
    </>
  );
};

const DashboardCliente = ({ usuarioId }) => {
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ["proyectos", { cliente_id: usuarioId }],
    queryFn: () => proyectoService.getAll({ cliente_id: usuarioId }),
  });

  // Un solo recorrido para las cuatro cifras, en lugar de cuatro filtros sueltos.
  const stats = useMemo(() => {
    const inicial = { Abierto: 0, "En progreso": 0, Completado: 0, propuestas: 0 };
    return (proyectos || []).reduce((acc, p) => {
      if (p.estado in acc) acc[p.estado] += 1;
      acc.propuestas += p.propuestas?.length || 0;
      return acc;
    }, inicial);
  }, [proyectos]);

  if (isLoading) return <Loading />;

  return (
    <>
      <Grid>
        <StatCard label="Proyectos abiertos" value={stats.Abierto} />
        <StatCard label="En progreso" value={stats["En progreso"]} />
        <StatCard label="Completados" value={stats.Completado} />
        <StatCard label="Propuestas recibidas" value={stats.propuestas} />
      </Grid>

      <Acciones $gap={1.5} $wrap>
        <Button as={Link} to="/crear-proyecto">Publicar proyecto</Button>
        <Button as={Link} to="/explorar" $variant="secondary">Buscar freelancers</Button>
      </Acciones>
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

  const noVerificados = useMemo(
    () => (usuarios || []).filter((u) => u.role === "Freelancer" && !u.verificado).length,
    [usuarios]
  );

  if (cargandoUsuarios || cargandoProyectos) return <Loading />;

  return (
    <>
      <Grid>
        <StatCard label="Usuarios totales" value={usuarios?.length || 0} />
        <StatCard label="Freelancers sin verificar" value={noVerificados} />
        <StatCard label="Proyectos totales" value={proyectos?.length || 0} />
      </Grid>
      <Acciones>
        <Button as={Link} to="/admin">Ir al panel de administración</Button>
      </Acciones>
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
