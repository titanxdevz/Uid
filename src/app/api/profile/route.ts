import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id).select("+password").lean();

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
      avatarUrl: user.avatarUrl ?? "",
      createdAt: user.createdAt,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, email, avatarUrl } = await req.json();

    if (!name && !email && avatarUrl === undefined) {
      return NextResponse.json(
        { success: false, error: "Nothing to update" },
        { status: 400 }
      );
    }

    await connectDB();

    const update: Record<string, unknown> = {};
    if (name) update.name = name.trim();
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existing = await User.findOne({ email: normalizedEmail, _id: { $ne: session.user.id } });
      if (existing) {
        return NextResponse.json(
          { success: false, error: "Email already in use" },
          { status: 409 }
        );
      }
      update.email = normalizedEmail;
    }

    const user = await User.findByIdAndUpdate(session.user.id, update, { new: true }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
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
        avatarUrl: user.avatarUrl ?? "",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
