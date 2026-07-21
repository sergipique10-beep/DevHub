const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    autor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    freelancer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    proyecto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    puntuacion: { type: Number, min: 1, max: 5, required: true },
    comentario: { type: String, required: true },
    aspectos: {
      comunicacion: { type: Number, min: 1, max: 5, required: true },
      calidad: { type: Number, min: 1, max: 5, required: true },
      puntualidad: { type: Number, min: 1, max: 5, required: true },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Review", reviewSchema);
