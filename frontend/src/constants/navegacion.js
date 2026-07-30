/**
 * Entradas del menú de cuenta según el rol. Vive fuera de UserMenu porque la
 * comparten el dropdown de escritorio y el panel móvil del navbar — y porque
 * un archivo de componentes que además exporta funciones rompe el fast refresh.
 */
export const entradasCuenta = (role) => [
  { to: "/perfil/editar", label: "Mi perfil" },
  ...(role === "Freelancer"
    ? [
        { to: "/mis-servicios", label: "Mis servicios" },
        { to: "/mi-portfolio", label: "Portfolio" },
      ]
    : []),
  ...(role === "Cliente" ? [{ to: "/crear-proyecto", label: "Publicar proyecto" }] : []),
  { to: "/mis-proyectos", label: "Proyectos" },
  ...(role === "Admin" ? [{ to: "/admin", label: "Admin" }] : []),
];
