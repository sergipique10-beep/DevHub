const Portfolio = require("../models/Portfolio");

// GET /api/portfolio/:freelancer_id
const getPortfolioPorFreelancer = async (req, res, next) => {
  try {
    const items = await Portfolio.find({ freelancer_id: req.params.freelancer_id }).sort({
      featured: -1,
      createdAt: -1,
    });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// POST /api/portfolio (solo Freelancer)
const crearPortfolio = async (req, res, next) => {
  try {
    const item = await Portfolio.create({
      ...req.body,
      freelancer_id: req.usuario._id,
    });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// PUT /api/portfolio/:id (solo propietario)
const actualizarPortfolio = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Elemento de portfolio no encontrado" });
    }
    if (item.freelancer_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo puedes editar tu propio portfolio" });
    }

    Object.assign(item, req.body);
    await item.save();
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/portfolio/:id (solo propietario)
const eliminarPortfolio = async (req, res, next) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Elemento de portfolio no encontrado" });
    }
    if (
      item.freelancer_id.toString() !== req.usuario._id.toString() &&
      req.usuario.role !== "Admin"
    ) {
      return res.status(403).json({ error: "Solo puedes eliminar tu propio portfolio" });
    }

    await item.deleteOne();
    res.json({ mensaje: "Elemento de portfolio eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPortfolioPorFreelancer,
  crearPortfolio,
  actualizarPortfolio,
  eliminarPortfolio,
};
