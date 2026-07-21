import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import proyectoService from "../../services/proyectoService";
import Avatar from "../common/Avatar";
import Loading from "../common/Loading";
import { Card, Grid, Badge, SectionTitle, EmptyState } from "../../styles/ui";
import { formatearFecha } from "../../utils/parse";

const Header = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2.5)};
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const tonoEstado = {
  Abierto: "primary",
  "En progreso": "warning",
  Completado: "success",
  Cancelado: "danger",
};

const PerfilCliente = ({ usuario }) => {
  const { data: proyectos, isLoading } = useQuery({
    queryKey: ["proyectos", { cliente_id: usuario._id }],
    queryFn: () => proyectoService.getAll({ cliente_id: usuario._id }),
  });

  return (
    <>
      <Header>
        <Avatar nombre={usuario.nombre} fotoPerfil={usuario.fotoPerfil} size="88px" />
        <div>
          <h1 style={{ margin: 0 }}>
            {usuario.nombre} {usuario.apellido}
          </h1>
          <p style={{ color: "#94a3b8", margin: "4px 0" }}>
            {usuario.ubicacion || "Ubicación no especificada"}
          </p>
          <p style={{ maxWidth: "560px" }}>{usuario.bio}</p>
        </div>
      </Header>

      <Section>
        <SectionTitle>Proyectos publicados</SectionTitle>
        {isLoading ? (
          <Loading />
        ) : proyectos?.length ? (
          <Grid>
            {proyectos.map((p) => (
              <Card key={p._id} as={Link} to={`/proyectos/${p._id}`} style={{ display: "block" }}>
                <h3 style={{ margin: "0 0 6px" }}>{p.titulo}</h3>
                <Badge $tone={tonoEstado[p.estado]}>{p.estado}</Badge>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px" }}>
                  Presupuesto: {p.presupuesto}€ · Entrega: {formatearFecha(p.deadline)}
                </p>
              </Card>
            ))}
          </Grid>
        ) : (
          <EmptyState>Sin proyectos publicados todavía.</EmptyState>
        )}
      </Section>
    </>
  );
};

export default PerfilCliente;
