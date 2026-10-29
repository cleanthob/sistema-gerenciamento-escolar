type Overview = {
  activeStudents: number;
  totalStudents: number;
  activeStaff: number;
  totalStaff: number;
  attendanceRate: number | null;
  attendanceCount: number;
  averageGrade: number | null;
  pendingGuardianCalls: number;
  absentToday: number;
  overduePayments: number;
  months: { month: string; value: number | null }[];
  lessonsToday: {
    id: string;
    subject: string;
    teacher: string;
    room: string;
    startsAt: string;
    studentName: string;
    className: string;
  }[];
};

type AccountProfile = { name: string; role: string };
