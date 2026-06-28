import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (session.user.id !== id && session.user.role !== "admin" && session.user.role !== "manager") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  await connectDB();

  const user = await User.findById(id).lean();
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      credits: user.credits,
      creditsUsed: user.creditsUsed,
      isActive: user.isActive,
      createdAt: user.createdAt,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (session.user.id !== id && session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    await connectDB();

    const allowed: Record<string, unknown> = {};
    if (body.name) allowed.name = body.name;
    if (body.password) allowed.password = await bcrypt.hash(body.password, 12);
    if (session.user.role === "admin") {
      if (body.role) allowed.role = body.role;
      if (body.isActive !== undefined) allowed.isActive = body.isActive;
      if (body.credits !== undefined) allowed.credits = body.credits;
    }

    const user = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true }).lean();
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    await createAuditLog({
      action: "user.update",
      actor: session.user.id,
      targetType: "user",
      targetId: id,
      details: { changes: Object.keys(allowed) },
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
        isActive: user.isActive,
      },
    });
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
  if (session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  await connectDB();

  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  await createAuditLog({
    action: "user.deactivate",
    actor: session.user.id,
    targetType: "user",
    targetId: id,
    details: { email: user.email },
    ip: req.headers.get("x-forwarded-for") ?? undefined,
  });

  return NextResponse.json({ success: true, message: "User deactivated" });
}
