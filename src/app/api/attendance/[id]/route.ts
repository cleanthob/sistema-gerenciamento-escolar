import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AttendanceStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

type Context = { params: Promise<{ id: string }> };
const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];
const updateSchema = z
  .object({
    date: z.coerce.date().optional(),
    subject: z.string().trim().max(100).nullable().optional(),
    status: z.nativeEnum(AttendanceStatus).optional(),
    note: z.string().trim().max(500).nullable().optional(),
  })
  .refine(
    (record) => Object.values(record).some((value) => value !== undefined),
    {
      message: "Informe ao menos um campo para atualizar.",
    },
  );

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os dados da presença.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );

  const { id } = await params;
  try {
    const record = await prisma.attendance.update({
      where: { id },
      data: parsed.data,
      include: {
        student: {
          select: { name: true, registration: true, className: true },
        },
      },
    });
    return NextResponse.json({ data: record });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Registro de presença não encontrado." },
        { status: 404 },
      );
    }
    throw error;
  }
}
