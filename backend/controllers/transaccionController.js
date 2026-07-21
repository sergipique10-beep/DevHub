const Transaccion = require("../models/Transaccion");
const Proyecto = require("../models/Proyecto");

// GET /api/transacciones (solo Admin)
const getTransacciones = async (req, res, next) => {
  try {
    const transacciones = await Transaccion.find()
      .populate("cliente_id", "nombre apellido")
      .populate("freelancer_id", "nombre apellido")
      .sort({ createdAt: -1 });

    res.json(transacciones);
  } catch (error) {
    next(error);
  }
};

// GET /api/transacciones/:usuario_id (solo propio o Admin)
const getTransaccionesPorUsuario = async (req, res, next) => {
  try {
    if (req.usuario._id.toString() !== req.params.usuario_id && req.usuario.role !== "Admin") {
      return res.status(403).json({ error: "Solo puedes ver tus propias transacciones" });
    }

    const transacciones = await Transaccion.find({
      $or: [{ cliente_id: req.params.usuario_id }, { freelancer_id: req.params.usuario_id }],
    })
      .populate("cliente_id", "nombre apellido")
      .populate("freelancer_id", "nombre apellido")
      .sort({ createdAt: -1 });

    res.json(transacciones);
  } catch (error) {
    next(error);
  }
};

// POST /api/transacciones
const crearTransaccion = async (req, res, next) => {
  try {
    const { proyecto_id } = req.body;

    if (proyecto_id) {
      const proyecto = await Proyecto.findById(proyecto_id);
      if (!proyecto) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      if (!proyecto.freelancer_asignado_id) {
        return res
          .status(400)
          .json({ error: "El proyecto debe tener un freelancer asignado para generar una transacción" });
      }
    }

    const transaccion = await Transaccion.create(req.body);
    res.status(201).json(transaccion);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTransacciones, getTransaccionesPorUsuario, crearTransaccion };
