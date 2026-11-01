import { getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  if (session.role === "STUDENT") {
    const student = await prisma.student.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        registration: true,
        grade: true,
        className: true,
        mustChangePassword: true,
        status: true,
      },
    });
    if (!student || student.status !== "ACTIVE") return unauthorized();
    return NextResponse.json({
      user: {
        ...student,
        photoUrl: student.photoUrl
          ? `/api/students/${encodeURIComponent(student.id)}/photo`
          : null,
        role: "STUDENT",
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      photoUrl: true,
      role: true,
      active: true,
    },
  });
  if (!user || !user.active) return unauthorized();
  return NextResponse.json({
    user: {
      ...user,
      photoUrl: user.photoUrl
        ? `/api/admin/me/photo?v=${Date.now()}`
        : null,
    },
  });
}
