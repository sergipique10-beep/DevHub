const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const protegerRuta = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado, falta el token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "Usuario no válido o inactivo" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = protegerRuta;
