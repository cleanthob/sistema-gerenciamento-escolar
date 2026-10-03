import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanctionSchema } from "@/lib/validations/school-records";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const studentId =
    new URL(request.url).searchParams.get("studentId") ?? undefined;
  const records = await prisma.sanction.findMany({
    where: studentId ? { studentId } : undefined,
    include: {
      student: {
        select: {
          name: true,
          registration: true,
          className: true,
          guardianName: true,
          guardianPhone: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ data: records, total: records.length });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = sanctionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os dados da ocorrência.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  if (
    parsed.data.guardianContactRequired &&
    parsed.data.guardianContactStatus === "NOT_REQUIRED"
  ) {
    return NextResponse.json(
      {
        error:
          "Não é possível marcar contato dispensado enquanto ele for obrigatório.",
      },
      { status: 400 },
    );
  }

  try {
    const record = await prisma.sanction.create({
      data: {
        ...parsed.data,
        endsAt: parsed.data.endsAt ?? null,
        notes: parsed.data.notes || null,
        createdBy: session.id,
        guardianContactedAt:
          parsed.data.guardianContactStatus === "CONTACTED" ? new Date() : null,
      },
      include: {
        student: {
          select: {
            name: true,
            registration: true,
            className: true,
            guardianName: true,
            guardianPhone: true,
          },
        },
      },
    });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    if (isForeignKeyError(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    throw error;
  }
}

function isForeignKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2003"
  );
}
