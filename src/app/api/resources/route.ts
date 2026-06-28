import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Resource from "@/lib/models/Resource";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const status = searchParams.get("status");
  const ownerId = searchParams.get("ownerId");
  const search = searchParams.get("search");

  const filter: Record<string, unknown> = {};

  if (session.user.role === "user") {
    filter.owner = session.user.id;
  } else if (ownerId) {
    filter.owner = ownerId;
  }

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { uid: { $regex: search, $options: "i" } },
      { label: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [resources, total] = await Promise.all([
    Resource.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name email")
      .populate("createdBy", "name email")
      .lean(),
    Resource.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      resources,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uid, label, ownerId, expiresInDays, metadata } = await req.json();

    if (!uid) {
      return NextResponse.json({ success: false, error: "UID is required" }, { status: 400 });
    }

    await connectDB();

    const targetOwner = ownerId && session.user.role !== "user" ? ownerId : session.user.id;

    const owner = await User.findById(targetOwner);
    if (!owner) {
      return NextResponse.json({ success: false, error: "Owner not found" }, { status: 404 });
    }

    if (owner.credits <= owner.creditsUsed && session.user.role === "user") {
      return NextResponse.json(
        { success: false, error: "Insufficient credits" },
        { status: 403 }
      );
    }

    const existing = await Resource.findOne({ uid });
    if (existing) {
      return NextResponse.json({ success: false, error: "UID already exists" }, { status: 409 });
    }

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 86400000)
      : undefined;

    const resource = await Resource.create({
      uid,
      label,
      owner: targetOwner,
      expiresAt,
      metadata,
      createdBy: session.user.id,
    });

    if (session.user.role === "user") {
      await User.findByIdAndUpdate(targetOwner, { $inc: { creditsUsed: 1 } });
    }

    await createAuditLog({
      action: "resource.create",
      actor: session.user.id,
      targetType: "resource",
      targetId: resource._id.toString(),
      details: { uid, owner: targetOwner, expiresAt },
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({ success: true, data: resource }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
