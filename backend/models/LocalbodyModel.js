import mongoose from "mongoose";

const localBodySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['panchayat', 'municipality'],
      required: true,
    },
    block: { type: String, trim: true }, // only applicable for panchayats, optional for municipalities
    district: { type: String, default: 'Palakkad', immutable: true },
    isActive: { type: Boolean, default: true }, // lets you disable one without deleting
  },
);

// Prevent duplicate names within the same type
localBodySchema.index({ name: 1, type: 1 }, { unique: true });

const localBodyModel = mongoose.models.localbody || mongoose.model('localBody', localBodySchema);

export default localBodyModel;