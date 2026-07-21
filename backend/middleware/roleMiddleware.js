const permitirRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario || !rolesPermitidos.includes(req.usuario.role)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para realizar esta acción" });
    }
    next();
  };
};

module.exports = permitirRoles;
