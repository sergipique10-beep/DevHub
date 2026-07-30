import { Link } from "react-router-dom";
import styled from "styled-components";
import RegisterForm from "../components/Auth/RegisterForm";
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

const Register = () => (
  <AuthLayout>
    <Titulo>Crea tu cuenta</Titulo>
    <Subtitle>Muestra tu trabajo, encuentra talento o tu próximo proyecto.</Subtitle>
    <RegisterForm />
    <Footnote>
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
    </Footnote>
  </AuthLayout>
);

export default Register;
