import {
  createSessionToken,
  getSession,
  setSessionCookie,
  unauthorized,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (session.role !== UserRole.STUDENT) {
    return NextResponse.json(
      { error: "Somente alunos podem alterar a senha por esta rota." },
      { status: 403 },
    );
  }

  const parsed = changePasswordSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revise os campos informados.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
  });
  if (!student || student.status !== "ACTIVE") return unauthorized();
  if (!(await compare(parsed.data.currentPassword, student.passwordHash))) {
    return NextResponse.json(
      { error: "Senha atual incorreta." },
      { status: 400 },
    );
  }

  const updatedStudent = await prisma.student.update({
    where: { id: student.id },
    data: {
      passwordHash: await hash(parsed.data.newPassword, 12),
      mustChangePassword: false,
    },
    select: { id: true, name: true },
  });
  const token = await createSessionToken({
    id: updatedStudent.id,
    role: UserRole.STUDENT,
    name: updatedStudent.name,
    mustChangePassword: false,
  });
  const response = NextResponse.json({
    success: true,
    mustChangePassword: false,
  });
  setSessionCookie(response, token);
  return response;
}
