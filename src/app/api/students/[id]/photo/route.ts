import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const managementRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { id } = await params;
  if (
    !managementRoles.includes(session.role) &&
    (session.role !== UserRole.STUDENT || session.id !== id)
  ) {
    return forbidden();
  }

  const student = await prisma.student.findUnique({
    where: { id },
    select: { photoUrl: true, status: true },
  });
  if (session.role === UserRole.STUDENT && student?.status !== "ACTIVE")
    return unauthorized();
  const match = student?.photoUrl?.match(
    /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/]+={0,2})$/,
  );
  if (!match) {
    return NextResponse.json({ error: "Foto não encontrada." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(Buffer.from(match[2], "base64")), {
    headers: {
      "Cache-Control": "private, no-store",
      "Content-Type": `image/${match[1]}`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
