const mongoose = require("mongoose");

const transaccionSchema = new mongoose.Schema(
  {
    cliente_id: {
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
      default: null,
    },
    servicio_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servicio",
      default: null,
    },
    monto: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ["Pendiente", "Completada", "Reembolsada"],
      default: "Pendiente",
    },
    metodoPago: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaccion", transaccionSchema);
