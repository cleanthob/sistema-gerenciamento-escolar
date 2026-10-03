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
const createPaymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.number().int().positive(),
  dueDate: z.coerce.date(),
  reference: z.string().trim().max(100).optional(),
});
const updatePaymentSchema = z.object({
  status: z.enum(["PENDING", "PAID", "WAIVED"]),
});

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  const requestedStudentId = new URL(request.url).searchParams.get("studentId");
  if (
    !staffRoles.includes(session.role) &&
    !(session.role === UserRole.STUDENT && requestedStudentId === session.id)
  )
    return forbidden();

  const studentId =
    session.role === UserRole.STUDENT
      ? session.id
      : (requestedStudentId ?? undefined);
  const payments = await prisma.payment.findMany({
    where: studentId ? { studentId } : undefined,
    include: {
      student: { select: { name: true, registration: true, className: true } },
    },
    orderBy: { dueDate: "desc" },
  });
  return NextResponse.json({ data: payments, total: payments.length });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (session.role !== UserRole.ADMIN && session.role !== UserRole.DIRECTOR)
    return forbidden();

  const parsed = createPaymentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Revise os dados da mensalidade.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  try {
    const payment = await prisma.payment.create({
      data: { ...parsed.data, reference: parsed.data.reference || null },
      include: { student: { select: { name: true, registration: true } } },
    });
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error) {
    if (isForeignKeyError(error))
      return NextResponse.json(
        { error: "Aluno não encontrado." },
        { status: 404 },
      );
    throw error;
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (session.role !== UserRole.ADMIN && session.role !== UserRole.DIRECTOR)
    return forbidden();

  const paymentId = new URL(request.url).searchParams.get("id");
  if (!paymentId)
    return NextResponse.json(
      { error: "Informe o identificador do pagamento." },
      { status: 400 },
    );
  const parsed = updatePaymentSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      {
        error: "Situação do pagamento inválida.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );

  try {
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: parsed.data.status as PaymentStatus,
        paidAt: parsed.data.status === "PAID" ? new Date() : null,
      },
      include: { student: { select: { name: true, registration: true } } },
    });
    return NextResponse.json({ data: payment });
  } catch (error) {
    if (isNotFoundError(error))
      return NextResponse.json(
        { error: "Pagamento não encontrado." },
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
function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}
