import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findDuplicateStudentIdentifiers } from "@/lib/student-identifiers";
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
      photoUrl: true,
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
      { error: "Aluno(a) não encontrado(a)." },
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
        error:
          "Não foi possível atualizar o cadastro do(a) aluno(a). Confira os campos obrigatórios e os formatos informados.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { id } = await params;
  const input = parsed.data;
  const errors = await findDuplicateStudentIdentifiers(
    {
      registration: input.registration,
      email: input.email || undefined,
    },
    id,
  );
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      {
        error:
          "A matrícula ou o e-mail informado pertence a outro(a) aluno(a). Altere os campos destacados.",
        errors,
      },
      { status: 409 },
    );
  }

  const data = {
    ...input,
    ...(input.photoUrl !== undefined
      ? { photoUrl: input.photoUrl || null }
      : {}),
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
        photoUrl: true,
        email: true,
        grade: true,
        className: true,
        status: true,
        guardianName: true,
        guardianPhone: true,
        guardianEmail: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ data: student });
  } catch (error) {
    if (isRecordNotFound(error))
      return NextResponse.json(
        { error: "Aluno(a) não encontrado(a)." },
        { status: 404 },
      );
    if (isUniqueConstraintError(error))
      return uniqueConstraintResponse(error);
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
        { error: "Aluno(a) não encontrado(a)." },
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

function uniqueConstraintResponse(error: unknown) {
  const field = getUniqueConstraintField(error);
  if (!field) {
    return NextResponse.json(
      { error: "Matrícula ou e-mail já está cadastrado." },
      { status: 409 },
    );
  }
  const label = field === "registration" ? "matrícula" : "e-mail";
  return NextResponse.json(
    {
      error: `Este ${label} já está cadastrado.`,
      errors: { [field]: `Este ${label} já está cadastrado.` },
    },
    { status: 409 },
  );
}

function getUniqueConstraintField(
  error: unknown,
): "registration" | "email" | undefined {
  if (typeof error !== "object" || error === null || !("meta" in error))
    return undefined;
  const meta = error.meta as { target?: unknown } | undefined;
  const target = meta?.target;
  const fields = Array.isArray(target) ? target : [target];
  if (fields.some((field) => String(field).includes("registration")))
    return "registration";
  if (fields.some((field) => String(field).includes("email"))) return "email";
  return undefined;
}

function isRecordNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
