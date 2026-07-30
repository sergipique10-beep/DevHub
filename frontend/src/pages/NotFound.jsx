import { Link } from "react-router-dom";
import styled from "styled-components";
import { PageContainer, Button } from "../styles/ui";

const Pagina = styled(PageContainer)`
  text-align: center;
  padding-top: ${({ theme }) => theme.spacing(10)};
`;

const NotFound = () => (
  <Pagina>
    <h1>404</h1>
    <p>La página que buscas no existe.</p>
    <Button as={Link} to="/">
      Volver al inicio
    </Button>
  </Pagina>
);

export default NotFound;
