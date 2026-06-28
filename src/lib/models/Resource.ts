import mongoose, { Schema, Document, Model } from "mongoose";

export interface IResourceDoc extends Document {
  uid: string;
  label?: string;
  owner: mongoose.Types.ObjectId;
  status: "active" | "expired" | "revoked" | "suspended";
  expiresAt?: Date;
  metadata?: Record<string, unknown>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const resourceSchema = new Schema<IResourceDoc>(
  {
    uid: { type: String, required: true, trim: true },
    label: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "expired", "revoked", "suspended"],
      default: "active",
    },
    expiresAt: { type: Date },
    metadata: { type: Schema.Types.Mixed },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

resourceSchema.index({ uid: 1 });
resourceSchema.index({ owner: 1 });
resourceSchema.index({ status: 1 });

const Resource: Model<IResourceDoc> =
  mongoose.models.Resource ?? mongoose.model<IResourceDoc>("Resource", resourceSchema);

export default Resource;
