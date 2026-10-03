import { evaluateAdmission } from "@/lib/admission";
import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AttendanceStatus,
  PaymentStatus,
  SanctionType,
  UserRole,
} from "@prisma/client";
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

  const { id } = await params;
  const isOwnAccount = session.role === UserRole.STUDENT && session.id === id;
  if (!isOwnAccount && !staffRoles.includes(session.role)) return forbidden();

  const student = await prisma.student.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      registration: true,
      className: true,
      status: true,
      payments: {
        where: { status: PaymentStatus.PENDING },
        select: { amount: true, dueDate: true, status: true },
        orderBy: { dueDate: "asc" },
      },
      sanctions: {
        where: { type: SanctionType.SUSPENSION },
        select: { reason: true, startsAt: true, endsAt: true },
        orderBy: { startsAt: "desc" },
      },
      attendances: {
        select: { date: true, status: true },
        orderBy: { date: "desc" },
        take: 30,
      },
    },
  });

  if (!student)
    return NextResponse.json(
      { error: "Aluno não encontrado." },
      { status: 404 },
    );

  const now = new Date();
  const admission = evaluateAdmission({
    status: student.status,
    payments: student.payments,
    suspensions: student.sanctions,
    checkedAt: now,
  });

  const attendanceCounted = student.attendances.filter(
    (record) =>
      record.status === AttendanceStatus.PRESENT ||
      record.status === AttendanceStatus.ABSENT ||
      record.status === AttendanceStatus.LATE ||
      record.status === AttendanceStatus.EXCUSED,
  );
  const presentCount = attendanceCounted.filter(
    (record) =>
      record.status === AttendanceStatus.PRESENT ||
      record.status === AttendanceStatus.LATE,
  ).length;

  return NextResponse.json({
    student: {
      id: student.id,
      name: student.name,
      registration: student.registration,
      className: student.className,
    },
    canEnter: admission.canEnter,
    reasons: admission.reasons,
    overduePayments: admission.overduePayments.map(({ amount, dueDate }) => ({
      amount,
      dueDate,
    })),
    activeSuspensions: admission.activeSuspensions,
    attendance: {
      recordedDays: attendanceCounted.length,
      presentDays: presentCount,
      absentDays: attendanceCounted.filter(
        (record) => record.status === AttendanceStatus.ABSENT,
      ).length,
    },
    checkedAt: now.toISOString(),
  });
}
