export const theme = {
  colors: {
    accentCyan: "#22d3ee",
    accentViolet: "#a855f7",
    accentBlue: "#3b82f6",
    primary: "#38bdf8",
    primaryDark: "#0ea5e9",
    primaryLight: "rgba(56, 189, 248, 0.14)",
    secondary: "#34d399",
    danger: "#fb7185",
    warning: "#fbbf24",
    text: "#e7ebf5",
    textMuted: "#94a3b8",
    border: "rgba(148, 163, 184, 0.18)",
    background: "#080b14",
    backgroundAlt: "#0d1220",
    surface: "rgba(19, 24, 41, 0.72)",
    surfaceSolid: "#131829",
  },
  gradient: {
    primary: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 55%, #a855f7 100%)",
    subtle: "linear-gradient(135deg, rgba(56,189,248,0.16) 0%, rgba(168,85,247,0.16) 100%)",
    glow: "radial-gradient(circle, rgba(56,189,248,0.35) 0%, rgba(168,85,247,0) 70%)",
  },
  spacing: (factor) => `${factor * 8}px`,
  radius: {
    sm: "8px",
    md: "14px",
    lg: "20px",
  },
  shadow: {
    card: "0 8px 30px rgba(0,0,0,0.35)",
    raised: "0 12px 40px rgba(0,0,0,0.5)",
    glow: "0 0 24px rgba(56, 189, 248, 0.35)",
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
};
