import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  AttendanceStatus,
  GuardianContactStatus,
  PaymentStatus,
  StudentStatus,
  UserRole,
} from "@prisma/client";
import { NextResponse } from "next/server";

const allowedRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!allowedRoles.includes(session.role)) return forbidden();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
  const schoolYearStart = new Date(now.getFullYear(), 0, 1);

  const [
    activeStudents,
    totalStudents,
    activeStaff,
    totalStaff,
    attendanceRows,
    gradeRows,
    pendingGuardianCalls,
    absentToday,
    overduePayments,
    lessonsToday,
  ] = await Promise.all([
    prisma.student.count({ where: { status: StudentStatus.ACTIVE } }),
    prisma.student.count(),
    prisma.user.count({
      where: {
        active: true,
        role: { in: [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER] },
      },
    }),
    prisma.user.count({
      where: {
        role: { in: [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER] },
      },
    }),
    prisma.attendance.findMany({
      where: { date: { gte: schoolYearStart } },
      select: { date: true, status: true },
    }),
    prisma.grade.findMany({ select: { score: true, maxScore: true } }),
    prisma.sanction.count({
      where: {
        guardianContactRequired: true,
        guardianContactStatus: GuardianContactStatus.PENDING,
      },
    }),
    prisma.attendance.count({
      where: {
        date: { gte: todayStart, lt: tomorrow },
        status: AttendanceStatus.ABSENT,
      },
    }),
    prisma.payment.count({
      where: { dueDate: { lt: todayStart }, status: PaymentStatus.PENDING },
    }),
    prisma.lesson.findMany({
      where: { startsAt: { gte: todayStart, lt: tomorrow } },
      include: { student: { select: { name: true, className: true } } },
      orderBy: { startsAt: "asc" },
    }),
  ]);

  const countedAttendance = attendanceRows.filter(
    (record) => record.status !== AttendanceStatus.EXCUSED,
  );
  const attended = countedAttendance.filter(
    (record) =>
      record.status === AttendanceStatus.PRESENT ||
      record.status === AttendanceStatus.LATE,
  ).length;
  const attendanceRate = countedAttendance.length
    ? Math.round((attended / countedAttendance.length) * 1000) / 10
    : null;
  const averageGrade = gradeRows.length
    ? gradeRows.reduce(
        (sum, grade) => sum + (grade.score / grade.maxScore) * 10,
        0,
      ) / gradeRows.length
    : null;
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const rows = attendanceRows.filter(
      (record) =>
        record.date.getFullYear() === date.getFullYear() &&
        record.date.getMonth() === date.getMonth() &&
        record.status !== AttendanceStatus.EXCUSED,
    );
    const present = rows.filter(
      (record) =>
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.LATE,
    ).length;
    return {
      month: new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date),
      value: rows.length ? Math.round((present / rows.length) * 100) : null,
    };
  });

  return NextResponse.json({
    data: {
      activeStudents,
      totalStudents,
      activeStaff,
      totalStaff,
      attendanceRate,
      attendanceCount: countedAttendance.length,
      averageGrade,
      pendingGuardianCalls,
      absentToday,
      overduePayments,
      months,
      lessonsToday: lessonsToday.map((lesson) => ({
        id: lesson.id,
        subject: lesson.subject,
        teacher: lesson.teacher,
        room: lesson.room,
        startsAt: lesson.startsAt,
        studentName: lesson.student.name,
        className: lesson.student.className,
      })),
      checkedAt: now.toISOString(),
    },
  });
}
