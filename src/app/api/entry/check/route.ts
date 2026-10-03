import { evaluateAdmission } from "@/lib/admission";
import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PaymentStatus, SanctionType, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];
const requestSchema = z.object({
  registration: z.string().trim().min(1, "Informe a matrícula.").max(30),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const parsed = requestSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Matrícula obrigatória.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const student = await prisma.student.findUnique({
    where: { registration: parsed.data.registration },
    select: {
      id: true,
      name: true,
      registration: true,
      className: true,
      status: true,
      payments: {
        where: { status: PaymentStatus.PENDING },
        select: { amount: true, dueDate: true },
      },
      sanctions: {
        where: { type: SanctionType.SUSPENSION },
        select: { reason: true, startsAt: true, endsAt: true },
      },
    },
  });
  if (!student)
    return NextResponse.json(
      { error: "Matrícula não encontrada." },
      { status: 404 },
    );

  const now = new Date();
  const admission = evaluateAdmission({
    status: student.status,
    payments: student.payments,
    suspensions: student.sanctions,
    checkedAt: now,
  });

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      registration: student.registration,
      className: student.className,
    },
    canEnter: admission.canEnter,
    decision: admission.canEnter ? "LIBERADO" : "BLOQUEADO",
    reasons: admission.reasons,
    overduePayments: admission.overduePayments.map(({ amount, dueDate }) => ({
      amount,
      dueDate,
    })),
    activeSuspensions: admission.activeSuspensions,
    checkedAt: now.toISOString(),
  });
}
