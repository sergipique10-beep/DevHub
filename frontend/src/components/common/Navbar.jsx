import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiMenu, FiX, FiCode } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { media } from "../../styles/theme";
import { Button, GradientText } from "../../styles/ui";

const Bar = styled.nav`
  background: rgba(8, 11, 20, 0.72);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 50;
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  ${media.mobile} {
    padding: 0 ${({ theme }) => theme.spacing(2)};
  }
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font.heading};
  font-weight: 700;
  font-size: 1.3rem;

  svg {
    color: ${({ theme }) => theme.colors.accentCyan};
    filter: drop-shadow(0 0 6px rgba(56, 189, 248, 0.6));
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2.5)};

  ${media.mobile} {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    background: rgba(8, 11, 20, 0.94);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing(2)};
    gap: ${({ theme }) => theme.spacing(1.5)};
  }
`;

const StyledLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  font-size: 0.92rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.accentCyan};
    font-weight: 700;
  }
`;

const MenuToggle = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.text};
  ${media.mobile} {
    display: block;
  }
`;

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const esPaginaAuth = pathname === "/login" || pathname === "/register";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const cerrarMenu = () => setOpen(false);

  return (
    <Bar>
      <Inner>
        <Brand to={usuario ? "/dashboard" : "/login"} onClick={cerrarMenu}>
          <FiCode size={22} /> <GradientText>DevHub</GradientText>
        </Brand>

        {!esPaginaAuth && (
          <>
            <MenuToggle onClick={() => setOpen((o) => !o)} aria-label="Abrir menú">
              {open ? <FiX /> : <FiMenu />}
            </MenuToggle>

            <Links $open={open}>
              <StyledLink to="/explorar" onClick={cerrarMenu}>
                Explorar
              </StyledLink>
              <StyledLink to="/feed" onClick={cerrarMenu}>
                Feed
              </StyledLink>

              {usuario && (
                <StyledLink to="/dashboard" onClick={cerrarMenu}>
                  Dashboard
                </StyledLink>
              )}

              {usuario?.role === "Freelancer" && (
                <>
                  <StyledLink to="/mis-servicios" onClick={cerrarMenu}>
                    Mis servicios
                  </StyledLink>
                  <StyledLink to="/mi-portfolio" onClick={cerrarMenu}>
                    Portfolio
                  </StyledLink>
                </>
              )}

              {usuario?.role === "Cliente" && (
                <StyledLink to="/crear-proyecto" onClick={cerrarMenu}>
                  Publicar proyecto
                </StyledLink>
              )}

              {usuario && (
                <StyledLink to="/mis-proyectos" onClick={cerrarMenu}>
                  Proyectos
                </StyledLink>
              )}

              {usuario?.role === "Admin" && (
                <StyledLink to="/admin" onClick={cerrarMenu}>
                  Admin
                </StyledLink>
              )}

              {usuario ? (
                <>
                  <StyledLink to="/perfil/editar" onClick={cerrarMenu}>
                    {usuario.nombre}
                  </StyledLink>
                  <Button type="button" $variant="secondary" onClick={handleLogout}>
                    Salir
                  </Button>
                </>
              ) : (
                <>
                  <StyledLink to="/login" onClick={cerrarMenu}>
                    Entrar
                  </StyledLink>
                  <Button as={NavLink} to="/register" onClick={cerrarMenu}>
                    Registrarse
                  </Button>
                </>
              )}
            </Links>
          </>
        )}
      </Inner>
    </Bar>
  );
};

export default Navbar;
