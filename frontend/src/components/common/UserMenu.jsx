import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { alpha, media } from "../../styles/theme";
import { entradasCuenta } from "../../constants/navegacion";
import useClickOutside from "../../hooks/useClickOutside";
import Avatar from "./Avatar";

const Wrap = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  padding: 4px 10px 4px 4px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.hover};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.font.body};
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover,
  &[aria-expanded="true"] {
    border-color: ${({ theme }) => theme.colors.accentCyan};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadow.focus};
  }

  svg.chevron {
    color: ${({ theme }) => theme.colors.textMuted};
    transition: transform 0.18s ease;
    transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  }

  ${media.reducedMotion} {
    transition: none;
    svg.chevron {
      transition: none;
    }
  }
`;

const Name = styled.span`
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  min-width: 210px;
  padding: ${({ theme }) => theme.spacing(0.75)};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.raised};
  display: flex;
  flex-direction: column;
  gap: 2px;
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  transform: translateY(${({ $open }) => ($open ? "0" : "-6px")});
  visibility: ${({ $open }) => ($open ? "visible" : "hidden")};
  transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s;

  ${media.reducedMotion} {
    transition: none;
    transform: none;
  }
`;

const itemStyles = `
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
`;

const Item = styled(NavLink)`
  ${itemStyles}
  color: ${({ theme }) => theme.colors.textMuted};

  &:hover {
    background: ${({ theme }) => theme.colors.hoverStrong};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    color: ${({ theme }) => theme.colors.accentCyan};
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${alpha("primary", 0.4)};
  }

  ${media.reducedMotion} {
    transition: none;
  }
`;

const LogoutItem = styled.button`
  ${itemStyles}
  font-family: ${({ theme }) => theme.font.body};
  color: ${({ theme }) => theme.colors.danger};

  &:hover {
    background: ${({ theme }) => theme.colors.dangerSoft};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px ${alpha("danger", 0.4)};
  }

  ${media.reducedMotion} {
    transition: none;
  }
`;

const Separator = styled.div`
  height: 1px;
  margin: 4px 8px;
  background: ${({ theme }) => theme.colors.border};
`;


const UserMenu = ({ usuario, onLogout }) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const { pathname } = useLocation();

  // Al cerrar con Escape devolvemos el foco al disparador; con click fuera no,
  // porque el usuario ya ha movido el foco a donde queria ir.
  const cerrar = useCallback((motivo) => {
    setOpen(false);
    if (motivo === "escape") triggerRef.current?.focus();
  }, []);

  const wrapRef = useClickOutside(open, cerrar);

  // Cerrar al navegar a otra ruta.
  useEffect(() => setOpen(false), [pathname]);

  const entradas = useMemo(() => entradasCuenta(usuario.role), [usuario.role]);

  return (
    <Wrap ref={wrapRef}>
      <Trigger
        ref={triggerRef}
        type="button"
        $open={open}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Avatar nombre={usuario.nombre} fotoPerfil={usuario.fotoPerfil} size="30px" />
        <Name>{usuario.nombre}</Name>
        <FiChevronDown className="chevron" size={16} />
      </Trigger>

      <Panel $open={open} role="menu" aria-hidden={!open}>
        {entradas.map(({ to, label }) => (
          <Item key={to} to={to} role="menuitem" tabIndex={open ? 0 : -1}>
            {label}
          </Item>
        ))}
        <Separator />
        <LogoutItem type="button" role="menuitem" tabIndex={open ? 0 : -1} onClick={onLogout}>
          <FiLogOut size={15} /> Salir
        </LogoutItem>
      </Panel>
    </Wrap>
  );
};

// memo para que el useCallback de handleLogout en Navbar sirva de algo:
// sin el, UserMenu se re-renderizaria igual en cada render de la barra.
export default memo(UserMenu);
