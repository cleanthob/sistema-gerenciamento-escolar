import { prisma } from "@/lib/prisma";

export async function isBeforeStudentEnrollment(
  studentId: string,
  date: Date,
): Promise<boolean | null> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { createdAt: true },
  });
  if (!student) return null;

  const dateOnly = (value: Date) =>
    Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate());

  return dateOnly(date) < dateOnly(student.createdAt);
}
