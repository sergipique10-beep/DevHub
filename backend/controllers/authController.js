const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const formatearUsuario = (usuario) => ({
  id: usuario._id,
  email: usuario.email,
  nombre: usuario.nombre,
  apellido: usuario.apellido,
  role: usuario.role,
});

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, role } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(409).json({ error: "Ya existe un usuario con ese email" });
    }

    const usuario = await Usuario.create({ email, password, nombre, apellido, role });
    const token = generarToken(usuario._id);

    res.status(201).json({ token, usuario: formatearUsuario(usuario) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email }).select("+password");
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generarToken(usuario._id);
    res.json({ token, usuario: formatearUsuario(usuario) });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  res.json({ mensaje: "Sesión cerrada correctamente" });
};

// GET /api/auth/verify
const verify = async (req, res) => {
  res.json({ usuario: formatearUsuario(req.usuario) });
};

module.exports = { register, login, logout, verify };
