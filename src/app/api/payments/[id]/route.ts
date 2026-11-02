import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

const updatePaymentSchema = z
  .object({
    studentId: z.string().min(1).optional(),
    amount: z.number().int().positive().optional(),
    dueDate: z.coerce.date().optional(),
    status: z.enum(["PENDING", "PAID", "WAIVED"]).optional(),
    reference: z.string().trim().max(100).nullable().optional(),
  })
  .refine((record) => Object.values(record).some((value) => value !== undefined), {
    message: "Informe ao menos um campo para atualizar.",
  });

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      student: { select: { id: true, name: true, registration: true, className: true } },
    },
  });

  if (!payment) {
    return NextResponse.json(
      { error: "Mensalidade não encontrada." },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: payment });
}

export async function PATCH(request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const { id } = await params;
  const parsed = updatePaymentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Revise os dados da mensalidade.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    const data = {
      ...parsed.data,
      ...(parsed.data.reference !== undefined
        ? { reference: parsed.data.reference || null }
        : {}),
      ...(parsed.data.status !== undefined
        ? { status: parsed.data.status as PaymentStatus }
        : {}),
      ...(parsed.data.status !== undefined
        ? { paidAt: parsed.data.status === "PAID" ? new Date() : null }
        : {}),
    };

    const payment = await prisma.payment.update({
      where: { id },
      data,
      include: { student: { select: { name: true, registration: true } } },
    });

    return NextResponse.json({ data: payment });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Mensalidade não encontrada." },
        { status: 404 },
      );
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
    await prisma.payment.delete({ where: { id } });
    return NextResponse.json({ message: "Mensalidade excluída com sucesso." });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json(
        { error: "Mensalidade não encontrada." },
        { status: 404 },
      );
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
