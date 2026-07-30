import styled, { css } from "styled-components";
import { alpha, media } from "./theme";

export const PageContainer = styled.div`
  max-width: ${({ $max }) => $max || "1100px"};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(3)};
  ${media.mobile} {
    padding: ${({ theme }) => theme.spacing(2)};
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: ${({ theme }) => theme.spacing(3)};
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  color: inherit;

  &[href] {
    display: block;
    cursor: pointer;
  }

  &[href]:hover {
    transform: translateY(-3px);
    border-color: ${({ theme }) => theme.colors.accentCyan};
    box-shadow: ${({ theme }) => theme.shadow.glow};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing(2.5)};
`;

const gradientButton = css`
  background: ${({ theme }) => theme.gradient.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  border: none;
  box-shadow: 0 4px 20px ${alpha("primary", 0.25)};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 28px ${alpha("violet", 0.4)};
    transform: translateY(-1px);
  }
`;

const secondaryButton = css`
  background: ${({ theme }) => theme.colors.hover};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.accentCyan};
    color: ${({ theme }) => theme.colors.accentCyan};
  }
`;

const dangerButton = css`
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  border: 1px solid ${({ theme }) => theme.colors.dangerBorder};

  &:hover:not(:disabled) {
    background: ${alpha("danger", 0.2)};
  }
`;

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing(1)};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing(1.25)} ${({ theme }) => theme.spacing(2.5)};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: ${({ theme }) => theme.font.body};

  ${({ $variant }) =>
    $variant === "secondary" ? secondaryButton : $variant === "danger" ? dangerButton : gradientButton}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(0.75)};
  ${({ $flex }) => $flex && `flex: ${$flex};`}
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const fieldStyles = css`
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.95rem;
  width: 100%;
  background: ${({ theme }) => theme.colors.field};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accentCyan};
    box-shadow: 0 0 0 3px ${alpha("primary", 0.18)};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const TextArea = styled.textarea`
  ${fieldStyles}
  min-height: 110px;
  resize: vertical;
`;

export const Select = styled.select`
  ${fieldStyles}

  option {
    background: ${({ theme }) => theme.colors.surfaceSolid};
    color: ${({ theme }) => theme.colors.text};
  }
`;

export const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.8rem;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid transparent;
  background: ${({ theme, $tone }) =>
    $tone === "success"
      ? theme.colors.secondarySoft
      : $tone === "warning"
      ? theme.colors.warningSoft
      : $tone === "danger"
      ? theme.colors.dangerTint
      : theme.colors.primaryLight};
  color: ${({ theme, $tone }) =>
    $tone === "success"
      ? theme.colors.secondary
      : $tone === "warning"
      ? theme.colors.warning
      : $tone === "danger"
      ? theme.colors.danger
      : theme.colors.primary};
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  padding: ${({ theme }) => theme.spacing(4)} 0;
`;

export const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.font.heading};
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing(1.5)};
`;

export const GradientText = styled.span`
  background: ${({ theme }) => theme.gradient.primary};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

export const Flex = styled.div`
  display: flex;
  align-items: ${({ $align }) => $align || "center"};
  justify-content: ${({ $justify }) => $justify || "flex-start"};
  gap: ${({ theme, $gap }) => theme.spacing($gap ?? 1)};
  flex-wrap: ${({ $wrap }) => ($wrap ? "wrap" : "nowrap")};
`;

/**
 * Apilado vertical con separación uniforme. Sustituye a los `margin-bottom`
 * sueltos: el espaciado lo decide el contenedor, no cada hijo.
 */
export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme, $gap }) => theme.spacing($gap ?? 1.5)};
  ${({ $mt, theme }) => $mt && `margin-top: ${theme.spacing($mt)};`}
`;

/** Título de una tarjeta dentro de una rejilla o lista. */
export const CardTitle = styled.h3`
  margin-bottom: 6px;
  font-size: 1.05rem;
`;

/** Texto secundario: descripciones, metadatos, fechas. */
export const MutedText = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ $size }) => $size || "0.85rem"};
`;

/** Cifra grande de las tarjetas de estadística. */
export const StatNumber = styled.p`
  font-size: 1.6rem;
  font-weight: 800;
`;

/** Imagen de cabecera de una tarjeta (portfolio, servicios, posts). */
export const Thumb = styled.img`
  width: 100%;
  height: ${({ $height }) => $height || "140px"};
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.sm};
  display: block;
`;

