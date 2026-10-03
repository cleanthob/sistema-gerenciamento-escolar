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
const gradeSchema = z.object({
  studentId: z.string().min(1),
  subject: z.string().trim().min(1).max(100),
  activity: z.string().trim().min(1).max(160),
  score: z.number().min(0),
  maxScore: z.number().positive().default(10),
  term: z.string().trim().min(1).max(40),
});

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const requestedId = new URL(request.url).searchParams.get("studentId");
  if (
    !staffRoles.includes(session.role) &&
    !(session.role === UserRole.STUDENT && requestedId === session.id)
  )
    return forbidden();

  const studentId =
    session.role === UserRole.STUDENT ? session.id : (requestedId ?? undefined);
  const grades = await prisma.grade.findMany({
    where: studentId ? { studentId } : undefined,
    include: {
      student: { select: { name: true, registration: true, className: true } },
    },
    orderBy: [{ recordedAt: "desc" }],
  });
  return NextResponse.json({ data: grades, total: grades.length });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = gradeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os dados da nota.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  if (parsed.data.score > parsed.data.maxScore)
    return NextResponse.json(
      { error: "A nota não pode ultrapassar o valor máximo." },
      { status: 400 },
    );
  try {
    const grade = await prisma.grade.create({
      data: parsed.data,
      include: {
        student: {
          select: { name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data: grade }, { status: 201 });
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
