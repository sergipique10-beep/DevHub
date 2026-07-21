const notFound = (req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: mensajes.join(", ") });
  }

  if (err.code === 11000) {
    const campo = Object.keys(err.keyValue || {})[0] || "campo";
    return res.status(409).json({ error: `El valor de '${campo}' ya existe` });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: `ID inválido: ${err.value}` });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }

  const statusCode = err.statusCode && err.statusCode !== 200 ? err.statusCode : 500;
  res.status(statusCode).json({ error: err.message || "Error interno del servidor" });
};

module.exports = { notFound, errorHandler };
