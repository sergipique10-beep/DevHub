import { Link } from "react-router-dom";
import MisServicios from "../components/Freelancer/MisServicios";
import styled from "styled-components";
import { PageContainer, PageTitle, Button, Flex } from "../styles/ui";

const Cabecera = styled(Flex)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

const Titulo = styled(PageTitle)`
  margin-bottom: 0;
`;

const MisServiciosPage = () => (
  <PageContainer>
    <Cabecera $justify="space-between">
      <Titulo>Mis servicios</Titulo>
      <Button as={Link} to="/crear-servicio">
        Publicar servicio
      </Button>
    </Cabecera>
    <MisServicios />
  </PageContainer>
);

export default MisServiciosPage;
