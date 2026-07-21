const Review = require("../models/Review");
const Proyecto = require("../models/Proyecto");
const Usuario = require("../models/Usuario");

const recalcularRating = async (freelancer_id) => {
  const reviews = await Review.find({ freelancer_id });
  const cantidad = reviews.length;
  const promedio = cantidad
    ? reviews.reduce((suma, r) => suma + r.puntuacion, 0) / cantidad
    : 0;

  await Usuario.findByIdAndUpdate(freelancer_id, {
    rating: { promedio: Math.round(promedio * 10) / 10, cantidad },
  });
};

// POST /api/reviews (solo Cliente después de completar)
const crearReview = async (req, res, next) => {
  try {
    const { proyecto_id, puntuacion, comentario, aspectos } = req.body;

    const proyecto = await Proyecto.findById(proyecto_id);
    if (!proyecto) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }
    if (proyecto.cliente_id.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ error: "Solo el cliente del proyecto puede dejar una review" });
    }
    if (proyecto.estado !== "Completado") {
      return res.status(400).json({ error: "Solo puedes dejar review de proyectos completados" });
    }
    if (!proyecto.freelancer_asignado_id) {
      return res.status(400).json({ error: "El proyecto no tiene un freelancer asignado" });
    }

    const yaExiste = await Review.findOne({ proyecto_id, autor_id: req.usuario._id });
    if (yaExiste) {
      return res.status(409).json({ error: "Ya has dejado una review para este proyecto" });
    }

    const review = await Review.create({
      autor_id: req.usuario._id,
      freelancer_id: proyecto.freelancer_asignado_id,
      proyecto_id,
      puntuacion,
      comentario,
      aspectos,
    });

    await recalcularRating(proyecto.freelancer_asignado_id);

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// GET /api/reviews/:freelancer_id
const getReviewsPorFreelancer = async (req, res, next) => {
  try {
    const reviews = await Review.find({ freelancer_id: req.params.freelancer_id })
      .populate("autor_id", "nombre apellido fotoPerfil")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = { crearReview, getReviewsPorFreelancer };
