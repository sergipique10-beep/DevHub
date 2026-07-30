import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import proyectoService from "../../services/proyectoService";
import Avatar from "../common/Avatar";
import Loading from "../common/Loading";
import ProyectoCard from "../common/ProyectoCard";
import { Card, Grid, SectionTitle, EmptyState, MutedText } from "../../styles/ui";

const Header = styled(Card)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2.5)};
  align-items: flex-start;
  flex-wrap: wrap;
`;

const Section = styled.div`
  margin-top: ${({ theme }) => theme.spacing(3)};
`;

const Nombre = styled.h1`
  margin: 0;
`;

const Bio = styled.p`
  max-width: 560px;
`;

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
          <Nombre>
            {usuario.nombre} {usuario.apellido}
          </Nombre>
          <MutedText>{usuario.ubicacion || "Ubicación no especificada"}</MutedText>
          <Bio>{usuario.bio}</Bio>
        </div>
      </Header>

      <Section>
        <SectionTitle>Proyectos publicados</SectionTitle>
        {isLoading ? (
          <Loading />
        ) : proyectos?.length ? (
          <Grid>
            {proyectos.map((p) => (
              <ProyectoCard key={p._id} proyecto={p} />
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
