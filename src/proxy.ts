import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const managementRoutes = ["/management"];
const apiManagementRoutes = ["/api/users", "/api/audit", "/api/credits"];

const apiResourceRoutes = ["/api/resources"];

export default auth(async (req: NextRequest & { auth?: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = (req as unknown as { auth: { user: { role: string } } | null }).auth;

  const isLoggedIn = !!session;
  const role = session?.user?.role ?? null;

  const isAuthRoute = pathname.startsWith("/api/auth/");

  const needsAuth = !isAuthRoute && (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/uids") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/api/")
  );

  if (needsAuth && !isLoggedIn) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isManagementRoute =
    managementRoutes.some((r) => pathname.startsWith(r)) ||
    (pathname.startsWith("/api/") &&
      apiManagementRoutes.some((r) => pathname.startsWith(r)));

  if (isManagementRoute && role !== "admin" && role !== "manager") {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/management/:path*", "/uids/:path*", "/profile/:path*", "/api/:path*"],
};
