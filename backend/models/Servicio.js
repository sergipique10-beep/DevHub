const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema(
  {
    freelancer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precioBase: { type: Number, required: true, min: 0 },
    tiempoEntrega: { type: Number, required: true, min: 1 },
    imagenPrincipal: { type: String, default: "" },
    tags: [{ type: String }],
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Servicio", servicioSchema);
