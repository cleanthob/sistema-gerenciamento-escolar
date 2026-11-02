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

const updateLessonSchema = z
  .object({
    studentId: z.string().min(1).optional(),
    subject: z.string().trim().min(1).max(100).optional(),
    teacher: z.string().trim().min(1).max(120).optional(),
    room: z.string().trim().min(1).max(60).optional(),
    startsAt: z.coerce.date().optional(),
    endsAt: z.coerce.date().optional(),
  })
  .refine((record) => Object.values(record).some((value) => value !== undefined), {
    message: "Informe ao menos um campo para atualizar.",
  })
  .refine(
    (record) =>
      record.startsAt === undefined ||
      record.endsAt === undefined ||
      record.endsAt > record.startsAt,
    {
      message: "O término deve ser posterior ao início da aula.",
      path: ["endsAt"],
    },
  );

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          registration: true,
          className: true,
        },
      },
    },
  });

  if (!lesson) {
    return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
  }

  return NextResponse.json({ data: lesson });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const parsed = updateLessonSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revise os dados da aula.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const lesson = await prisma.lesson.update({
      where: { id },
      data: parsed.data,
      include: {
        student: {
          select: { id: true, name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data: lesson });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
    }
    if (isForeignKeyError(error)) {
      return NextResponse.json(
        { error: "Aluno(a) não encontrado(a)." },
        { status: 404 },
      );
    }
    throw error;
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;

  try {
    await prisma.lesson.delete({ where: { id } });
    return NextResponse.json({ message: "Aula excluída com sucesso." });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ error: "Aula não encontrada." }, { status: 404 });
    }
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

function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
