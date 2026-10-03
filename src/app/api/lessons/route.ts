import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];
const lessonSchema = z
  .object({
    studentId: z.string().min(1),
    subject: z.string().trim().min(1).max(100),
    teacher: z.string().trim().min(1).max(120),
    room: z.string().trim().min(1).max(60),
    startsAt: z.coerce.date(),
    endsAt: z.coerce.date(),
  })
  .refine((lesson) => lesson.endsAt > lesson.startsAt, {
    message: "O término deve ser posterior ao início da aula.",
    path: ["endsAt"],
  });

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const params = new URL(request.url).searchParams;
  const requestedStudent = params.get("studentId");
  if (
    !staffRoles.includes(session.role) &&
    !(session.role === UserRole.STUDENT && requestedStudent === session.id)
  )
    return forbidden();

  const studentId =
    session.role === UserRole.STUDENT
      ? session.id
      : (requestedStudent ?? undefined);
  const day = params.get("date");
  let dateFilter = {};
  if (day) {
    const parsedDate = new Date(day);
    if (Number.isNaN(parsedDate.getTime()))
      return NextResponse.json({ error: "Data inválida." }, { status: 400 });
    const start = new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    );
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    dateFilter = { startsAt: { gte: start, lt: end } };
  }

  const data = await prisma.lesson.findMany({
    where: { ...(studentId ? { studentId } : {}), ...dateFilter },
    include: {
      student: { select: { name: true, registration: true, className: true } },
    },
    orderBy: { startsAt: "asc" },
  });
  return NextResponse.json({ data, total: data.length });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = lessonSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os dados da aula.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  try {
    const data = await prisma.lesson.create({
      data: parsed.data,
      include: {
        student: {
          select: { name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    if (isForeignKeyError(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    throw error;
  }
}

function isForeignKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2003"
  );
}
