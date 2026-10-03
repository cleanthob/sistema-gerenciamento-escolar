import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";

type Context = { params: Promise<{ id: string }> };
const resetRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function POST(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!resetRoles.includes(session.role)) return forbidden();

  const body = await request.json().catch(() => ({}));
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Senha temporária inválida.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { id } = await params;
  const temporaryPassword =
    parsed.data.temporaryPassword ?? randomBytes(12).toString("base64url");
  try {
    await prisma.student.update({
      where: { id },
      data: {
        passwordHash: await hash(temporaryPassword, 12),
        mustChangePassword: true,
      },
    });
  } catch (error) {
    if (isRecordNotFound(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    throw error;
  }

  return NextResponse.json({
    message:
      "Senha redefinida. Entregue a senha temporária ao aluno por um canal seguro.",
    temporaryPassword,
    mustChangePassword: true,
  });
}

function isRecordNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
