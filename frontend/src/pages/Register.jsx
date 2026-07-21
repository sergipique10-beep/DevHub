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

const Register = () => (
  <AuthLayout>
    <PageTitle style={{ marginBottom: "4px" }}>Crea tu cuenta</PageTitle>
    <Subtitle>Muestra tu trabajo, encuentra talento o tu próximo proyecto.</Subtitle>
    <RegisterForm />
    <Footnote>
      ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
    </Footnote>
  </AuthLayout>
);

export default Register;
