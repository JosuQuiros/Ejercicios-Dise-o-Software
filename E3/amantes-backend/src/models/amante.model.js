import mongoose from 'mongoose';

const amanteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    edad: { type: Number, required: true, min: 0 },
    intereses: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const AmanteModel = mongoose.model('Amante', amanteSchema);
