import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { auth } from "@/lib/auth";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      total: user.credits,
      used: user.creditsUsed,
      remaining: user.credits - user.creditsUsed,
    },
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const { userId, amount, reason } = await req.json();

    if (!userId || typeof amount !== "number") {
      return NextResponse.json(
        { success: false, error: "userId and amount are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    if (amount >= 0) {
      user.credits += amount;
    } else {
      const deduction = Math.abs(amount);
      if (user.credits - user.creditsUsed < deduction) {
        return NextResponse.json(
          { success: false, error: "Insufficient available credits" },
          { status: 400 }
        );
      }
      user.credits -= deduction;
    }

    await user.save();

    await createAuditLog({
      action: amount >= 0 ? "credits.add" : "credits.deduct",
      actor: session.user.id,
      targetType: "user",
      targetId: userId,
      details: { amount, reason, newBalance: user.credits },
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    return NextResponse.json({
      success: true,
      data: {
        userId: user._id,
        credits: user.credits,
        creditsUsed: user.creditsUsed,
        remaining: user.credits - user.creditsUsed,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
