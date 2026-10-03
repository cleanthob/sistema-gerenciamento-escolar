import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateStudentSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const managementRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!managementRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      registration: true,
      name: true,
      email: true,
      grade: true,
      className: true,
      status: true,
      guardianName: true,
      guardianPhone: true,
      guardianEmail: true,
      mustChangePassword: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!student)
    return NextResponse.json(
      { error: "Aluno não encontrado." },
      { status: 404 },
    );
  return NextResponse.json({ data: student });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!managementRoles.includes(session.role)) return forbidden();

  const parsed = updateStudentSchema.safeParse(
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

  const { id } = await params;
  const input = parsed.data;
  const data = {
    ...input,
    ...(input.email !== undefined ? { email: input.email || null } : {}),
    ...(input.guardianEmail !== undefined
      ? { guardianEmail: input.guardianEmail || null }
      : {}),
  };
  try {
    const student = await prisma.student.update({
      where: { id },
      data,
      select: {
        id: true,
        registration: true,
        name: true,
        email: true,
        grade: true,
        className: true,
        status: true,
        guardianName: true,
        guardianPhone: true,
        guardianEmail: true,
        mustChangePassword: true,
      },
    });
    return NextResponse.json({ data: student });
  } catch (error) {
    if (isRecordNotFound(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    if (isUniqueConstraintError(error))
      return NextResponse.json(
        { error: "Matrícula ou e-mail já está cadastrado." },
        { status: 409 },
      );
    throw error;
  }
}

export async function PUT(request: Request, context: Context) {
  return PATCH(request, context);
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!managementRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  try {
    const student = await prisma.student.update({
      where: { id },
      data: { status: "INACTIVE" },
      select: { id: true, registration: true, name: true, status: true },
    });
    return NextResponse.json({ data: student, archived: true });
  } catch (error) {
    if (isRecordNotFound(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    throw error;
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

function isRecordNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
