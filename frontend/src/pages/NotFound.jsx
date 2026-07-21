import { Link } from "react-router-dom";
import { PageContainer, Button } from "../styles/ui";

const NotFound = () => (
  <PageContainer style={{ textAlign: "center", paddingTop: "80px" }}>
    <h1>404</h1>
    <p>La página que buscas no existe.</p>
    <Button as={Link} to="/">Volver al inicio</Button>
  </PageContainer>
);

export default NotFound;
