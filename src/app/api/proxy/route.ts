import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const UPSTREAM_URL = process.env.UPSTREAM_API_URL;
const UPSTREAM_API_KEY = process.env.UPSTREAM_API_KEY;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (!UPSTREAM_URL) {
    return NextResponse.json(
      { success: false, error: "Upstream not configured" },
      { status: 501 }
    );
  }

  try {
    const body = await req.json();
    const { endpoint, data } = body;

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "endpoint is required" },
        { status: 400 }
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (UPSTREAM_API_KEY) {
      headers["Authorization"] = `Bearer ${UPSTREAM_API_KEY}`;
    }

    const response = await fetch(`${UPSTREAM_URL}${endpoint}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data ?? {}),
    });

    const result = await response.json();

    return NextResponse.json(
      { success: response.ok, data: result },
      { status: response.status }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Proxy error";
    return NextResponse.json({ success: false, error: message }, { status: 502 });
  }
}
