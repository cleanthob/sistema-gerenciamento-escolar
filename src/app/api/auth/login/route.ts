import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/student";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Dados de login inválidos.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { identifier, password, audience } = parsed.data;
  const user =
    audience === "STAFF"
      ? await prisma.user.findUnique({
          where: { email: identifier.toLowerCase() },
        })
      : null;
  const student =
    audience === "STUDENT"
      ? await prisma.student.findFirst({
          where: {
            OR: [
              { registration: identifier },
              { email: identifier.toLowerCase() },
            ],
          },
        })
      : null;
  const account = user ?? student;

  if (!account || !(await compare(password, account.passwordHash))) {
    return NextResponse.json(
      { error: "Credenciais inválidas." },
      { status: 401 },
    );
  }
  if (user && !user.active) {
    return NextResponse.json(
      { error: "Conta desativada. Procure a administração." },
      { status: 403 },
    );
  }
  if (student && student.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Matrícula inativa. Procure a administração." },
      { status: 403 },
    );
  }

  const role = user?.role ?? "STUDENT";
  const mustChangePassword = student?.mustChangePassword ?? false;
  const token = await createSessionToken({
    id: account.id,
    role,
    name: account.name,
    mustChangePassword,
  });
  const response = NextResponse.json({
    user: { id: account.id, name: account.name, role },
    mustChangePassword,
  });
  setSessionCookie(response, token);
  return response;
}
