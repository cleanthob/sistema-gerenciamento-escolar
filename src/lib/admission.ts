import { StudentStatus } from "@prisma/client";
import { getSchoolDateParts } from "@/lib/date-format";

type AdmissionPayment = { amount: number; dueDate: Date };
type AdmissionSuspension = {
  reason: string;
  startsAt: Date;
  endsAt: Date | null;
};

type AdmissionInput = {
  status: StudentStatus;
  payments: AdmissionPayment[];
  suspensions: AdmissionSuspension[];
  checkedAt?: Date;
};

function calendarDay(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function evaluateAdmission({
  status,
  payments,
  suspensions,
  checkedAt = new Date(),
}: AdmissionInput) {
  const { year, month, day } = getSchoolDateParts(checkedAt);
  const today = Date.UTC(year, month - 1, day);
  const overduePayments = payments.filter(
    (payment) => calendarDay(payment.dueDate) < today,
  );
  const activeSuspensions = suspensions.filter(
    (suspension) =>
      calendarDay(suspension.startsAt) <= today &&
      (suspension.endsAt === null || calendarDay(suspension.endsAt) >= today),
  );
  const reasons: string[] = [];

  if (status !== StudentStatus.ACTIVE) reasons.push("Matrícula inativa.");
  if (activeSuspensions.length > 0) reasons.push("Suspensão ativa.");
  if (overduePayments.length > 0)
    reasons.push("Mensalidade vencida e não paga.");

  return {
    canEnter: reasons.length === 0,
    reasons,
    overduePayments,
    activeSuspensions,
  };
}
