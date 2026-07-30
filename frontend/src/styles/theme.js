// Canales RGB de la paleta. Se guardan sueltos para poder generar variantes con
// opacidad sin duplicar el color literal por los componentes.
const canales = {
  primary: "56, 189, 248",
  cyan: "34, 211, 238",
  violet: "168, 85, 247",
  blue: "59, 130, 246",
  danger: "251, 113, 133",
  secondary: "52, 211, 153",
  warning: "251, 191, 36",
  slate: "148, 163, 184",
  background: "8, 11, 20",
  surface: "19, 24, 41",
};

/** alpha("primary", 0.25) -> "rgba(56, 189, 248, 0.25)" */
export const alpha = (nombre, opacidad) => `rgba(${canales[nombre]}, ${opacidad})`;

/**
 * Paradas del gradiente de marca. Se exportan sueltas porque el SVG del logo
 * necesita los colores uno a uno, no la cadena `linear-gradient`.
 */
export const PARADAS_GRADIENTE = [
  { offset: "0%", color: "#22d3ee" },
  { offset: "55%", color: "#3b82f6" },
  { offset: "100%", color: "#a855f7" },
];

export const theme = {
  colors: {
    accentCyan: "#22d3ee",
    accentViolet: "#a855f7",
    accentBlue: "#3b82f6",
    primary: "#38bdf8",
    primaryDark: "#0ea5e9",
    primaryLight: alpha("primary", 0.14),
    secondary: "#34d399",
    danger: "#fb7185",
    warning: "#fbbf24",
    text: "#e7ebf5",
    textMuted: "#94a3b8",
    // Texto sobre el gradiente de marca (botón primario).
    onPrimary: "#051019",
    border: alpha("slate", 0.18),
    borderHover: alpha("primary", 0.45),
    background: "#080b14",
    backgroundAlt: "#0d1220",
    surface: alpha("surface", 0.72),
    surfaceSolid: "#131829",
    // Superficies interactivas: el gris de hover y el fondo de un campo.
    hover: alpha("slate", 0.08),
    hoverStrong: alpha("slate", 0.12),
    field: alpha("background", 0.55),
    // Fondos tenues para badges y botones de estado (todos a la misma opacidad).
    dangerSoft: alpha("danger", 0.12),
    dangerTint: alpha("danger", 0.14),
    dangerBorder: alpha("danger", 0.35),
    secondarySoft: alpha("secondary", 0.14),
    warningSoft: alpha("warning", 0.14),
    // Fondos translúcidos de las capas flotantes (navbar, dropdowns, paneles).
    veil: alpha("background", 0.6),
    veilStrong: alpha("background", 0.88),
    veilSolid: alpha("background", 0.97),
    panel: alpha("surface", 0.96),
    focusRing: alpha("primary", 0.25),
  },
  gradient: {
    primary: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 55%, #a855f7 100%)",
    subtle: `linear-gradient(135deg, ${alpha("primary", 0.16)} 0%, ${alpha("violet", 0.16)} 100%)`,
    glow: `radial-gradient(circle, ${alpha("primary", 0.35)} 0%, ${alpha("violet", 0)} 70%)`,
  },
  spacing: (factor) => `${factor * 8}px`,
  radius: {
    sm: "8px",
    md: "14px",
    lg: "20px",
    pill: "999px",
  },
  shadow: {
    card: "0 8px 30px rgba(0, 0, 0, 0.35)",
    raised: "0 12px 40px rgba(0, 0, 0, 0.5)",
    bar: "0 8px 30px rgba(0, 0, 0, 0.4)",
    glow: `0 0 24px ${alpha("primary", 0.35)}`,
    focus: `0 0 0 3px ${alpha("primary", 0.25)}`,
  },
  font: {
    heading: `'Space Grotesk', 'Sora', sans-serif`,
    body: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`,
  },
  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1100px",
  },
};

export const media = {
  mobile: `@media (max-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,
  reducedMotion: `@media (prefers-reduced-motion: reduce)`,
};

const guionado = (camelCase) => camelCase.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);

/**
 * Aplana el theme a declaraciones de custom properties CSS.
 *
 * Lo consume `scripts/generar-variables.js`, que escribe `styles/variables.css`.
 * Este módulo sigue siendo la única fuente de verdad: el CSS es una proyección
 * suya, no una segunda lista que haya que mantener en paralelo.
 */
export const variablesCSS = (sangria = "  ") =>
  [
    ...Object.entries(theme.colors).map(([k, v]) => `--color-${guionado(k)}: ${v};`),
    ...Object.entries(theme.gradient).map(([k, v]) => `--gradient-${guionado(k)}: ${v};`),
    ...Object.entries(theme.radius).map(([k, v]) => `--radius-${k}: ${v};`),
    ...Object.entries(theme.shadow).map(([k, v]) => `--shadow-${k}: ${v};`),
    ...Object.entries(theme.font).map(([k, v]) => `--font-${k}: ${v};`),
    ...Object.entries(theme.breakpoints).map(([k, v]) => `--breakpoint-${k}: ${v};`),
    ...[0.5, 1, 1.5, 2, 2.5, 3, 4].map(
      (f) => `--spacing-${String(f).replace(".", "-")}: ${theme.spacing(f)};`
    ),
  ].join(`\n${sangria}`);
