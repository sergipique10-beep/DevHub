import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { alpha, media } from "../../styles/theme";
import useScrolled from "../../hooks/useScrolled";
import { entradasCuenta } from "../../constants/navegacion";
import { Button } from "../../styles/ui";
import Avatar from "./Avatar";
import Logo from "./Logo";
import UserMenu from "./UserMenu";

const Bar = styled.nav`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme, $scrolled }) =>
    $scrolled ? theme.colors.veilStrong : theme.colors.veil};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid
    ${({ theme, $scrolled }) => ($scrolled ? theme.colors.border : "transparent")};
  box-shadow: ${({ theme, $scrolled }) => ($scrolled ? theme.shadow.bar : "none")};
  transition: background 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;

  ${media.reducedMotion} {
    transition: none;
  }
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing(3)};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  height: ${({ $scrolled }) => ($scrolled ? "58px" : "68px")};
  transition: height 0.25s ease;

  ${media.mobile} {
    padding: 0 ${({ theme }) => theme.spacing(2)};
    gap: ${({ theme }) => theme.spacing(2)};
  }

  ${media.reducedMotion} {
    transition: none;
  }
`;

const Brand = styled(NavLink)`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  &:hover svg {
    filter: drop-shadow(0 0 10px ${alpha("primary", 0.7)});
    transform: scale(1.05);
  }
`;

const Nav = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(0.5)};

  ${media.mobile} {
    display: none;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  margin-left: auto;

  ${media.mobile} {
    display: none;
  }
`;

const StyledLink = styled(NavLink)`
  position: relative;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 500;
  font-size: 0.92rem;
  transition: color 0.18s ease, background 0.18s ease;

  &::after {
    content: "";
    position: absolute;
    left: 14px;
    right: 14px;
    bottom: 2px;
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.gradient.primary};
    transform: scaleX(0);
    transition: transform 0.22s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.hover};
  }

  &.active {
    color: ${({ theme }) => theme.colors.accentCyan};
    font-weight: 600;
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &.active::after {
    transform: scaleX(1);
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  ${media.reducedMotion} {
    transition: none;
    &::after {
      transition: none;
    }
  }
`;

const MenuToggle = styled.button`
  display: none;
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 0;
  color: ${({ theme }) => theme.colors.text};

  ${media.mobile} {
    display: block;
  }
`;

const Panel = styled.div`
  display: none;

  ${media.mobile} {
    display: ${({ $open }) => ($open ? "flex" : "none")};
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing(0.5)};
    position: absolute;
    left: 0;
    right: 0;
    background: ${({ theme }) => theme.colors.veilSolid};
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    box-shadow: ${({ theme }) => theme.shadow.raised};
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

const PanelUser = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1.5)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  margin-bottom: ${({ theme }) => theme.spacing(1)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  strong {
    display: block;
    font-size: 0.95rem;
  }

  span {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const PanelHeading = styled.p`
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: 0 14px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PanelLogout = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  margin-top: ${({ theme }) => theme.spacing(1)};
  border: none;
  background: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 0.92rem;
  font-weight: 500;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.danger};
`;

const PanelActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  margin-top: ${({ theme }) => theme.spacing(1.5)};
`;

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const esPaginaAuth = pathname === "/login" || pathname === "/register";

  useEffect(() => setOpen(false), [pathname]);

  // useCallback porque handleLogout viaja como prop a UserMenu: sin el, el menu
  // recibiria una funcion nueva en cada render de la barra.
  const handleLogout = useCallback(() => {
    logout();
    setOpen(false);
    navigate("/login");
  }, [logout, navigate]);

  const cerrarMenu = () => setOpen(false);

  const enlacesNav = useMemo(
    () => [
      { to: "/explorar", label: "Explorar" },
      { to: "/feed", label: "Feed" },
      ...(usuario ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ],
    [usuario]
  );

  const entradasPanel = useMemo(
    () => (usuario ? entradasCuenta(usuario.role) : []),
    [usuario]
  );

  return (
    <Bar $scrolled={scrolled}>
      <Inner $scrolled={scrolled}>
        <Brand to={usuario ? "/dashboard" : "/login"} onClick={cerrarMenu}>
          <Logo size={30} />
        </Brand>

        {!esPaginaAuth && (
          <>
            <Nav>
              {enlacesNav.map(({ to, label }) => (
                <StyledLink key={to} to={to}>
                  {label}
                </StyledLink>
              ))}
            </Nav>

            <Account>
              {usuario ? (
                <UserMenu usuario={usuario} onLogout={handleLogout} />
              ) : (
                <>
                  <StyledLink to="/login">Entrar</StyledLink>
                  <Button as={NavLink} to="/register">
                    Registrarse
                  </Button>
                </>
              )}
            </Account>

            <MenuToggle
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <FiX /> : <FiMenu />}
            </MenuToggle>
          </>
        )}
      </Inner>

      {!esPaginaAuth && (
        <Panel $open={open}>
          {usuario && (
            <PanelUser>
              <Avatar nombre={usuario.nombre} fotoPerfil={usuario.fotoPerfil} size="44px" />
              <div>
                <strong>{usuario.nombre}</strong>
                <span>{usuario.role}</span>
              </div>
            </PanelUser>
          )}

          <PanelHeading>Navegación</PanelHeading>
          {enlacesNav.map(({ to, label }) => (
            <StyledLink key={to} to={to} onClick={cerrarMenu}>
              {label}
            </StyledLink>
          ))}

          {usuario ? (
            <>
              <PanelHeading>Mi cuenta</PanelHeading>
              {entradasPanel.map(({ to, label }) => (
                <StyledLink key={to} to={to} onClick={cerrarMenu}>
                  {label}
                </StyledLink>
              ))}
              <PanelLogout type="button" onClick={handleLogout}>
                <FiLogOut size={15} /> Salir
              </PanelLogout>
            </>
          ) : (
            <PanelActions>
              <Button as={NavLink} to="/login" $variant="secondary" onClick={cerrarMenu}>
                Entrar
              </Button>
              <Button as={NavLink} to="/register" onClick={cerrarMenu}>
                Registrarse
              </Button>
            </PanelActions>
          )}
        </Panel>
      )}
    </Bar>
  );
};

export default Navbar;
