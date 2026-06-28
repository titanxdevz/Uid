import { connectDB } from "./db";
import AuditLog from "./models/AuditLog";

export async function createAuditLog(params: {
  action: string;
  actor: string;
  targetType?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ip?: string;
}) {
  await connectDB();
  return AuditLog.create(params);
}
