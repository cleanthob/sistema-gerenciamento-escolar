import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const cookieName = "school_session";
const staffRoles = new Set(["ADMIN", "DIRECTOR", "TEACHER"]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isStudentArea =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  if (!isAdminArea && !isStudentArea) return NextResponse.next();

  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(cookieName)?.value;
  if (!secret || secret.length < 32 || !token) {
    return redirectUnauthorized(
      request,
      isAdminArea ? "/login/admin" : "/login",
    );
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
      { algorithms: ["HS256"] },
    );
    const role = payload.role;
    const hasAccess = isAdminArea
      ? typeof role === "string" && staffRoles.has(role)
      : role === "STUDENT";
    if (
      role === "STUDENT" &&
      payload.mustChangePassword === true &&
      isStudentArea
    ) {
      return NextResponse.redirect(
        new URL("/login/change-password", request.url),
      );
    }
    if (hasAccess) return NextResponse.next();
  } catch {
    return redirectUnauthorized(
      request,
      isAdminArea ? "/login/admin" : "/login",
    );
  }

  return NextResponse.redirect(new URL("/unauthorized", request.url));
}

function redirectUnauthorized(request: NextRequest, loginPath: string) {
  const target = new URL(loginPath, request.url);
  target.searchParams.set("error", "unauthorized");
  return NextResponse.redirect(target);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
