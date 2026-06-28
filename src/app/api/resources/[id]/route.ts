import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const resource = await Resource.findById(id)
    .populate("owner", "name email")
    .populate("createdBy", "name email")
    .lean();

  if (!resource) {
    return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
  }

  if (session.user.role === "user" && resource.owner._id.toString() !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ success: true, data: resource });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    await connectDB();

    const resource = await Resource.findById(id);
    if (!resource) {
      return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
    }

    if (session.user.role === "user" && resource.owner.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const allowed: Record<string, unknown> = {};
    if (body.label) allowed.label = body.label;
    if (body.status) allowed.status = body.status;
    if (body.expiresAt) allowed.expiresAt = new Date(body.expiresAt);
    if (body.metadata) allowed.metadata = body.metadata;
    if (session.user.role !== "user") {
      if (body.uid) allowed.uid = body.uid;
      if (body.owner) allowed.owner = body.owner;
    }

    const updated = await Resource.findByIdAndUpdate(id, { $set: allowed }, { new: true })
      .populate("owner", "name email")
      .lean();

    await createAuditLog({
      action: "resource.update",
      actor: session.user.id,
      targetType: "resource",
      targetId: id,
      details: { changes: Object.keys(allowed) },
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  const resource = await Resource.findById(id);
  if (!resource) {
    return NextResponse.json({ success: false, error: "Resource not found" }, { status: 404 });
  }

  if (session.user.role === "user" && resource.owner.toString() !== session.user.id) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  if (session.user.role === "user") {
    await User.findByIdAndUpdate(resource.owner, { $inc: { creditsUsed: -1 } });
  }

  await Resource.findByIdAndDelete(id);

  await createAuditLog({
    action: "resource.delete",
    actor: session.user.id,
    targetType: "resource",
    targetId: id,
    details: { uid: resource.uid },
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ success: true, message: "Resource deleted" });
}
