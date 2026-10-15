import mongoose from "mongoose";

const statusUpdateSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'issue', required: true },
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'in-progress', 'resolved'],
      required: true,
    },
    note: { type: String, trim: true, maxlength: 500 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  {timestamps: true}
);

const statusUpdateModel = mongoose.models.statusUpdate || mongoose.model('statusUpdate', statusUpdateSchema);

export default statusUpdateModel;