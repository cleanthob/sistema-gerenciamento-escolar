import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { attendanceSchema } from "@/lib/validations/school-records";
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
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId");
  if (
    !staffRoles.includes(session.role) &&
    !(session.role === UserRole.STUDENT && studentId === session.id)
  )
    return forbidden();

  const dateParam = searchParams.get("date");
  const date = dateParam ? new Date(dateParam) : null;
  if (date && Number.isNaN(date.getTime()))
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  const start = date
    ? new Date(date.getFullYear(), date.getMonth(), date.getDate())
    : undefined;
  const end = start
    ? new Date(start.getTime() + 24 * 60 * 60 * 1000)
    : undefined;

  const records = await prisma.attendance.findMany({
    where: {
      ...(studentId ? { studentId } : {}),
      ...(start && end ? { date: { gte: start, lt: end } } : {}),
    },
    include: {
      student: { select: { name: true, registration: true, className: true } },
    },
    orderBy: [{ date: "desc" }, { student: { name: "asc" } }],
  });
  return NextResponse.json({ data: records, total: records.length });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = attendanceSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os campos da presença.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );

  try {
    const record = await prisma.attendance.create({
      data: {
        ...parsed.data,
        subject: parsed.data.subject || null,
        note: parsed.data.note || null,
        recordedBy: session.id,
      },
      include: {
        student: {
          select: { name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data: record }, { status: 201 });
  } catch (error) {
    if (isRecordNotFound(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    if (isUniqueConstraintError(error))
      return NextResponse.json(
        {
          error:
            "A presença desta disciplina já foi registrada para o aluno nessa data.",
        },
        { status: 409 },
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
    error.code === "P2003"
  );
}
