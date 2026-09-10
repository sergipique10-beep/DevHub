import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../styles/ui";

const CUENTAS_DEMO = [
  { rol: "Freelancer", email: "laura.roca@devhub-mail.com" },
  { rol: "Cliente", email: "bruno.perez@devhub-mail.com" },
  { rol: "Admin", email: "julia.vila@devhub-mail.com" },
];

const Separador = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin: ${({ theme }) => theme.spacing(2.5)} 0 ${({ theme }) => theme.spacing(1.5)};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const Grupo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const DemoAccessButtons = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(null);

  const entrarComo = async ({ rol, email }) => {
    setCargando(rol);
    try {
      await login({ email, password: "Password123!" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setCargando(null);
    }
  };

  return (
    <>
      <Separador>o entra directamente como</Separador>
      <Grupo>
        {CUENTAS_DEMO.map((cuenta) => (
          <Button
            key={cuenta.rol}
            type="button"
            $variant="secondary"
            disabled={cargando !== null}
            onClick={() => entrarComo(cuenta)}
          >
            {cargando === cuenta.rol ? "Entrando..." : cuenta.rol}
          </Button>
        ))}
      </Grupo>
    </>
  );
};

export default DemoAccessButtons;
