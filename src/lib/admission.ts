import { StudentStatus } from "@prisma/client";

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

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function evaluateAdmission({
  status,
  payments,
  suspensions,
  checkedAt = new Date(),
}: AdmissionInput) {
  const today = startOfDay(checkedAt);
  const overduePayments = payments.filter(
    (payment) => startOfDay(payment.dueDate) < today,
  );
  const activeSuspensions = suspensions.filter(
    (suspension) =>
      startOfDay(suspension.startsAt) <= today &&
      (suspension.endsAt === null || startOfDay(suspension.endsAt) >= today),
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
