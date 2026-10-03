import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export async function requireStudent() {
  const session = await getSession();
  if (!session) redirect("/unauthorized");
  if (session.role !== UserRole.STUDENT) redirect("/unauthorized");

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      registration: true,
      email: true,
      grade: true,
      className: true,
      status: true,
      mustChangePassword: true,
    },
  });

  if (!student || student.status !== "ACTIVE") redirect("/unauthorized");
  if (student.mustChangePassword || session.mustChangePassword)
    redirect("/login/change-password");
  return student;
}
