const Transaccion = require("../models/Transaccion");
const Proyecto = require("../models/Proyecto");
const Usuario = require("../models/Usuario");
const Servicio = require("../models/Servicio");

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
    const { cliente_id, freelancer_id, proyecto_id, servicio_id } = req.body;

    const [cliente, freelancer, proyecto, servicio] = await Promise.all([
      Usuario.findById(cliente_id),
      Usuario.findById(freelancer_id),
      proyecto_id ? Proyecto.findById(proyecto_id) : null,
      servicio_id ? Servicio.findById(servicio_id) : null,
    ]);

    if (!cliente) {
      return res.status(404).json({ error: "El cliente indicado no existe" });
    }
    if (!freelancer) {
      return res.status(404).json({ error: "El freelancer indicado no existe" });
    }
    if (proyecto_id && !proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    if (proyecto && !proyecto.freelancer_asignado_id) {
      return res
        .status(400)
        .json({ error: "El proyecto debe tener un freelancer asignado para generar una transacción" });
    }
    if (servicio_id && !servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    const transaccion = await Transaccion.create(req.body);
    res.status(201).json(transaccion);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTransacciones, getTransaccionesPorUsuario, crearTransaccion };
