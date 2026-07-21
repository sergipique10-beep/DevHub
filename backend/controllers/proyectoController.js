const Proyecto = require("../models/Proyecto");

// GET /api/proyectos
const getProyectos = async (req, res, next) => {
  try {
    const { estado, cliente_id } = req.query;
    const filtro = {};
    if (estado) filtro.estado = estado;
    if (cliente_id) filtro.cliente_id = cliente_id;

    const proyectos = await Proyecto.find(filtro)
      .populate("cliente_id", "nombre apellido fotoPerfil")
      .populate("freelancer_asignado_id", "nombre apellido fotoPerfil");
    res.json(proyectos);
  } catch (error) {
    next(error);
  }
};

// GET /api/proyectos/:id
const getProyectoPorId = async (req, res, next) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id)
      .populate("cliente_id", "nombre apellido fotoPerfil")
      .populate("freelancer_asignado_id", "nombre apellido fotoPerfil")
      .populate("propuestas.freelancer_id", "nombre apellido fotoPerfil rating");

    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
};

// POST /api/proyectos (solo Cliente)
const crearProyecto = async (req, res, next) => {
  try {
    const proyecto = await Proyecto.create({
      ...req.body,
      cliente_id: req.usuario._id,
    });
    res.status(201).json(proyecto);
  } catch (error) {
    next(error);
  }
};

// PUT /api/proyectos/:id/estado (solo propietario)
const cambiarEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const estadosValidos = ["Abierto", "En progreso", "Completado", "Cancelado"];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado inválido" });
    }

    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    if (proyecto.cliente_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo el cliente propietario puede cambiar el estado" });
    }

    proyecto.estado = estado;
    await proyecto.save();
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
};

// POST /api/proyectos/:id/propuestas (solo Freelancer)
const enviarPropuesta = async (req, res, next) => {
  try {
    const { precio, mensaje } = req.body;

    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    if (proyecto.estado !== "Abierto") {
      return res.status(400).json({ error: "Solo se pueden enviar propuestas a proyectos abiertos" });
    }

    const yaPropuso = proyecto.propuestas.some(
      (p) => p.freelancer_id.toString() === req.usuario._id.toString()
    );
    if (yaPropuso) {
      return res.status(409).json({ error: "Ya has enviado una propuesta para este proyecto" });
    }

    proyecto.propuestas.push({ freelancer_id: req.usuario._id, precio, mensaje });
    await proyecto.save();
    res.status(201).json(proyecto);
  } catch (error) {
    next(error);
  }
};

// PUT /api/proyectos/:id/asignar (solo Cliente)
const asignarFreelancer = async (req, res, next) => {
  try {
    const { freelancer_id } = req.body;

    const proyecto = await Proyecto.findById(req.params.id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    if (proyecto.cliente_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo el cliente propietario puede asignar freelancer" });
    }

    const propuestaValida = proyecto.propuestas.some(
      (p) => p.freelancer_id.toString() === freelancer_id
    );
    if (!propuestaValida) {
      return res.status(400).json({ error: "El freelancer debe tener una propuesta enviada a este proyecto" });
    }

    proyecto.freelancer_asignado_id = freelancer_id;
    proyecto.estado = "En progreso";
    await proyecto.save();
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProyectos,
  getProyectoPorId,
  crearProyecto,
  cambiarEstado,
  enviarPropuesta,
  asignarFreelancer,
};
