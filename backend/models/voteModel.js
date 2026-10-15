import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'issue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  { timestamps: true }
);

voteSchema.index({ issueId: 1, userId: 1 }, { unique: true });

const voteModel = mongoose.models.vote || mongoose.model('vote', voteSchema);

export default voteModel;