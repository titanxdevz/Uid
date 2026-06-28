import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLogDoc extends Document {
  action: string;
  actor: mongoose.Types.ObjectId;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ip?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLogDoc>(
  {
    action: { type: String, required: true, trim: true },
    actor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetType: { type: String, trim: true },
    targetId: { type: String, trim: true },
    details: { type: Schema.Types.Mixed },
    ip: { type: String, trim: true },
  },
  { timestamps: true }
);

auditLogSchema.index({ actor: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog: Model<IAuditLogDoc> =
  mongoose.models.AuditLog ?? mongoose.model<IAuditLogDoc>("AuditLog", auditLogSchema);

export default AuditLog;
