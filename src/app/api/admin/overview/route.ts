import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  getSchoolCalendarDateStart,
  getSchoolDayRange,
  getSchoolDateParts,
  getSchoolYearStart,
} from "@/lib/date-format";
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
  const todayDateStart = getSchoolCalendarDateStart(now);
  const tomorrowDateStart = new Date(
    todayDateStart.getTime() + 24 * 60 * 60 * 1000,
  );
  const { start: todayStart, end: tomorrow } = getSchoolDayRange(now);
  const schoolYearStart = getSchoolYearStart(now);
  const { year: currentYear } = getSchoolDateParts(now);

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
      where: { date: { gte: schoolYearStart, lt: tomorrowDateStart } },
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
        date: { gte: todayDateStart, lt: tomorrowDateStart },
        status: AttendanceStatus.ABSENT,
      },
    }),
    prisma.payment.count({
      where: { dueDate: { lt: todayDateStart }, status: PaymentStatus.PENDING },
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
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(Date.UTC(currentYear, index, 1));
    const rows = attendanceRows.filter(
      (record) =>
        record.date.getUTCFullYear() === date.getUTCFullYear() &&
        record.date.getUTCMonth() === date.getUTCMonth() &&
        record.status !== AttendanceStatus.EXCUSED,
    );
    const present = rows.filter(
      (record) =>
        record.status === AttendanceStatus.PRESENT ||
        record.status === AttendanceStatus.LATE,
    ).length;
    return {
      month: new Intl.DateTimeFormat("pt-BR", {
        month: "short",
        timeZone: "UTC",
      }).format(date),
      value: rows.length ? Math.round((present / rows.length) * 100) : null,
      records: rows.length,
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
