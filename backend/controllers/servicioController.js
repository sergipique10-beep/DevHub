const Servicio = require("../models/Servicio");

// GET /api/servicios
const getServicios = async (req, res, next) => {
  try {
    const { categoria, freelancer_id } = req.query;
    const filtro = { activo: true };
    if (categoria) filtro.categoria = categoria;
    if (freelancer_id) filtro.freelancer_id = freelancer_id;

    const servicios = await Servicio.find(filtro).populate(
      "freelancer_id",
      "nombre apellido fotoPerfil rating verificado"
    );
    res.json(servicios);
  } catch (error) {
    next(error);
  }
};

// GET /api/servicios/:id
const getServicioPorId = async (req, res, next) => {
  try {
    const servicio = await Servicio.findById(req.params.id).populate(
      "freelancer_id",
      "nombre apellido fotoPerfil rating verificado"
    );
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    res.json(servicio);
  } catch (error) {
    next(error);
  }
};

// POST /api/servicios (solo Freelancer)
const crearServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.create({
      ...req.body,
      freelancer_id: req.usuario._id,
    });
    res.status(201).json(servicio);
  } catch (error) {
    next(error);
  }
};

// PUT /api/servicios/:id (solo propietario)
const actualizarServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    if (servicio.freelancer_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo puedes editar tus propios servicios" });
    }

    Object.assign(servicio, req.body);
    await servicio.save();
    res.json(servicio);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/servicios/:id (solo propietario)
const eliminarServicio = async (req, res, next) => {
  try {
    const servicio = await Servicio.findById(req.params.id);
    if (!servicio) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }
    if (
      servicio.freelancer_id.toString() !== req.usuario._id.toString() &&
      req.usuario.role !== "Admin"
    ) {
      return res.status(403).json({ error: "Solo puedes eliminar tus propios servicios" });
    }

    servicio.activo = false;
    await servicio.save();
    res.json({ mensaje: "Servicio eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServicios,
  getServicioPorId,
  crearServicio,
  actualizarServicio,
  eliminarServicio,
};
