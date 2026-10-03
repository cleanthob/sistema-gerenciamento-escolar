import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSanctionSchema } from "@/lib/validations/school-records";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };
const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const data = await prisma.sanction.findUnique({
    where: { id },
    include: {
      student: {
        select: { name: true, registration: true, className: true },
      },
    },
  });
  if (!data)
    return NextResponse.json(
      { error: "Ocorrência não encontrada." },
      { status: 404 },
    );
  return NextResponse.json({ data });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = updateSanctionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os campos da ocorrência.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  if (
    parsed.data.guardianContactRequired &&
    parsed.data.guardianContactStatus === "NOT_REQUIRED"
  ) {
    return NextResponse.json(
      { error: "Contato obrigatório não pode ser marcado como dispensado." },
      { status: 400 },
    );
  }

  const { id } = await params;
  const data = {
    ...parsed.data,
    ...(parsed.data.notes !== undefined
      ? { notes: parsed.data.notes || null }
      : {}),
    ...(parsed.data.guardianContactStatus === "CONTACTED"
      ? { guardianContactedAt: new Date() }
      : {}),
  };
  try {
    const record = await prisma.sanction.update({
      where: { id },
      data,
      include: {
        student: {
          select: { name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data: record });
  } catch (error) {
    if (isNotFoundError(error))
      return NextResponse.json(
        { error: "Ocorrência não encontrada." },
        { status: 404 },
      );
    throw error;
  }
}

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
