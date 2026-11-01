import { getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { studentPhotoSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (session.role !== UserRole.STUDENT) {
    return NextResponse.json(
      { error: "Somente alunos podem alterar a própria foto." },
      { status: 403 },
    );
  }

  const parsed = studentPhotoSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message;
    return NextResponse.json(
      { error: message ?? "Envie uma foto válida." },
      { status: 400 },
    );
  }

  const student = await prisma.student.findUnique({
    where: { id: session.id },
    select: { id: true, status: true },
  });
  if (!student || student.status !== "ACTIVE") return unauthorized();

  await prisma.student.update({
    where: { id: student.id },
    data: { photoUrl: parsed.data.photoUrl || null },
  });

  return NextResponse.json({
    photoUrl: parsed.data.photoUrl
      ? `/api/students/${encodeURIComponent(student.id)}/photo?v=${Date.now()}`
      : null,
  });
}
