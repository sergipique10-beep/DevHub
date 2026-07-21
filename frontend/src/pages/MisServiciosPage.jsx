import { Link } from "react-router-dom";
import MisServicios from "../components/Freelancer/MisServicios";
import { PageContainer, PageTitle, Button, Flex } from "../styles/ui";

const MisServiciosPage = () => (
  <PageContainer>
    <Flex $justify="space-between" style={{ marginBottom: "16px" }}>
      <PageTitle style={{ margin: 0 }}>Mis servicios</PageTitle>
      <Button as={Link} to="/crear-servicio">
        Publicar servicio
      </Button>
    </Flex>
    <MisServicios />
  </PageContainer>
);

export default MisServiciosPage;
