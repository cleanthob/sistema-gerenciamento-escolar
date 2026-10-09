import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const cookieName = "school_session";
const staffRoles = new Set(["ADMIN", "DIRECTOR", "TEACHER"]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminArea = pathname === "/admin" || pathname.startsWith("/admin/");
  const isStudentArea =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  const isAdminLogin = pathname === "/login/admin";
  const isStudentLogin = pathname === "/login";
  const isLoginPage = isAdminLogin || isStudentLogin;

  if (!isAdminArea && !isStudentArea && !isLoginPage) {
    return NextResponse.next();
  }

  const secret = process.env.AUTH_SECRET;
  const token = request.cookies.get(cookieName)?.value;

  // Sem segredo válido ou cookie, permite acessar a página de login.
  if (!secret || secret.length < 32 || !token) {
    if (isLoginPage) {
      return NextResponse.next();
    }

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

    // Redireciona usuários autenticados que acessam as páginas de login.
    if (isLoginPage) {
      // Administradores, diretores e professores.
      if (isAdminLogin && typeof role === "string" && staffRoles.has(role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Estudantes.
      if (isStudentLogin && role === "STUDENT") {
        if (payload.mustChangePassword === true) {
          return NextResponse.redirect(
            new URL("/login/change-password", request.url),
          );
        }

        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // Usuário autenticado com perfil diferente pode acessar o login.
      return NextResponse.next();
    }

    // Verifica as permissões das áreas protegidas.
    const hasAccess = isAdminArea
      ? typeof role === "string" && staffRoles.has(role)
      : role === "STUDENT";

    // Impede que estudantes ignorem a troca obrigatória de senha.
    if (
      role === "STUDENT" &&
      payload.mustChangePassword === true &&
      isStudentArea
    ) {
      return NextResponse.redirect(
        new URL("/login/change-password", request.url),
      );
    }

    if (hasAccess) {
      return NextResponse.next();
    }
  } catch {
    // Token inválido: permite visualizar a página de login.
    if (isLoginPage) {
      return NextResponse.next();
    }

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
  matcher: ["/admin/:path*", "/dashboard/:path*", "/login", "/login/admin"],
};
