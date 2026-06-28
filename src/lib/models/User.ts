import mongoose, { Schema, Document, Model } from "mongoose";
import type { Role } from "@/types";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password: string;
  role: Role;
  credits: number;
  creditsUsed: number;
  isActive: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "manager", "user"], default: "user" },
    credits: { type: Number, default: 0, min: 0 },
    creditsUsed: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User: Model<IUserDoc> =
  mongoose.models.User ?? mongoose.model<IUserDoc>("User", userSchema);

export default User;
