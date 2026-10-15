import { timeStamp } from "console";
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    category: {
      type: String,
      enum: ['pothole', 'streetlight', 'garbage', 'water', 'sanitation', 'drainage', 'other'],
      required: true,
    },
    roadType: {
      type: String,
      enum: ['local', 'pwd'],
      default: 'local'
    },
    localbody: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'localBody',
      required: true
    },
    location: {
      address: { type: String, trim: true },
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    photoUrl: { type: String },
    photoPublicId: { type: String }, // needed to delete from Cloudinary later
    status: {
      type: String,
      enum: ['reported', 'acknowledged', 'in-progress', 'resolved'],
      default: 'reported',
    },
    upvoteCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  },
  {timestamps: true}
);

issueSchema.index({ category: 1, localbody: 1, status: 1 });
issueSchema.index({ upvoteCount: -1 });

const issueModel = mongoose.models.issue || mongoose.model('issue', issueSchema);

export default issueModel;