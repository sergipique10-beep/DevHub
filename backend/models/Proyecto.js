const mongoose = require("mongoose");

const propuestaSchema = new mongoose.Schema(
  {
    freelancer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    precio: { type: Number, required: true, min: 0 },
    mensaje: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const proyectoSchema = new mongoose.Schema(
  {
    cliente_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, required: true },
    presupuesto: { type: Number, required: true, min: 0 },
    deadline: { type: Date, required: true },
    estado: {
      type: String,
      enum: ["Abierto", "En progreso", "Completado", "Cancelado"],
      default: "Abierto",
    },
    propuestas: [propuestaSchema],
    freelancer_asignado_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
    tecnologiasRequeridas: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proyecto", proyectoSchema);
