import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  return session;
}

export function requireRole(session: { user: { role: string } }, ...roles: string[]) {
  if (!roles.includes(session.user.role)) {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function apiError(message: string, status: number = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json({ success: true, data }, { status });
}
