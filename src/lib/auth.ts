import { UserRole } from "@prisma/client";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "school_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type Session = {
  id: string;
  role: UserRole;
  name: string;
  mustChangePassword?: boolean;
};

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET deve ter pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(session: Session) {
  return new SignJWT({
    role: session.role,
    name: session.name,
    mustChangePassword: session.mustChangePassword ?? false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.id)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.name !== "string" ||
      !Object.values(UserRole).includes(payload.role as UserRole)
    ) {
      return null;
    }
    return {
      id: payload.sub,
      role: payload.role as UserRole,
      name: payload.name,
      mustChangePassword: payload.mustChangePassword === true,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function unauthorized(message = "Acesso não autorizado.") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbidden() {
  return NextResponse.json(
    { error: "Você não tem permissão para esta operação." },
    { status: 403 },
  );
}

export function hasRole(session: Session, roles: UserRole[]) {
  return roles.includes(session.role);
}
