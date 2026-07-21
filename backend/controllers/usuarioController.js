const Usuario = require("../models/Usuario");

// GET /api/usuarios
const getUsuarios = async (req, res, next) => {
  try {
    const usuarios = await Usuario.find({ activo: true });
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

// GET /api/usuarios/buscar?skills=react,node&minRating=4
const buscarUsuarios = async (req, res, next) => {
  try {
    const { skills, minRating } = req.query;
    const filtro = { activo: true };

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      filtro["skills.nombre"] = { $in: skillsArray };
    }

    if (minRating) {
      filtro["rating.promedio"] = { $gte: Number(minRating) };
    }

    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
};

// GET /api/usuarios/:id
const getUsuarioPorId = async (req, res, next) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// PUT /api/usuarios/:id (solo propio)
const actualizarUsuario = async (req, res, next) => {
  try {
    if (req.usuario._id.toString() !== req.params.id && req.usuario.role !== "Admin") {
      return res.status(403).json({ error: "Solo puedes editar tu propio perfil" });
    }

    const camposPermitidos = [
      "nombre",
      "apellido",
      "fotoPerfil",
      "bio",
      "ubicacion",
      "enlaces",
      "skills",
      "experiencia",
    ];
    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) actualizaciones[campo] = req.body[campo];
    });

    if (req.usuario.role === "Admin" && req.body.verificado !== undefined) {
      actualizaciones.verificado = req.body.verificado;
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, actualizaciones, {
      new: true,
      runValidators: true,
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/usuarios/:id (solo Admin)
const eliminarUsuario = async (req, res, next) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { activo: false },
      { new: true }
    );
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario desactivado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsuarios,
  buscarUsuarios,
  getUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
};
