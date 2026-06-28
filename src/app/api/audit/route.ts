import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import AuditLog from "@/lib/models/AuditLog";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin" && session.user.role !== "manager") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const action = searchParams.get("action");
  const actorId = searchParams.get("actorId");

  const filter: Record<string, unknown> = {};
  if (action) filter.action = action;
  if (actorId) filter.actor = actorId;

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("actor", "name email")
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
}
