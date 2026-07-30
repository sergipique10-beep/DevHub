import { Link } from "react-router-dom";
import styled from "styled-components";
import LoginForm from "../components/Auth/LoginForm";
import AuthLayout from "../components/common/AuthLayout";
import { PageTitle } from "../styles/ui";

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: -12px 0 ${({ theme }) => theme.spacing(2.5)};
  font-size: 0.9rem;
`;

const Footnote = styled.p`
  margin-top: ${({ theme }) => theme.spacing(2)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

const Titulo = styled(PageTitle)`
  margin-bottom: 4px;
`;

const Login = () => (
  <AuthLayout>
    <Titulo>Inicia sesión</Titulo>
    <Subtitle>Conecta con tu red de developers.</Subtitle>
    <LoginForm />
    <Footnote>
      ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
    </Footnote>
  </AuthLayout>
);

export default Login;
