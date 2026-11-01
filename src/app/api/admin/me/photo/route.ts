import { getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profilePhotoSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

async function getActiveStaffUser() {
  const session = await getSession();
  if (!session) return { response: unauthorized() };
  if (session.role === UserRole.STUDENT) {
    return {
      response: NextResponse.json(
        { error: "Somente a equipe escolar pode alterar esta foto." },
        { status: 403 },
      ),
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: { id: true, active: true, photoUrl: true },
  });
  if (!user?.active) return { response: unauthorized() };
  return { user };
}

export async function GET() {
  const result = await getActiveStaffUser();
  if ("response" in result) return result.response;

  const match = result.user.photoUrl?.match(
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

export async function PATCH(request: Request) {
  const result = await getActiveStaffUser();
  if ("response" in result) return result.response;

  const parsed = profilePhotoSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          parsed.error.issues[0]?.message ?? "Envie uma imagem válida.",
      },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: result.user.id },
    data: { photoUrl: parsed.data.photoUrl || null },
  });

  return NextResponse.json({
    photoUrl: parsed.data.photoUrl
      ? `/api/admin/me/photo?v=${Date.now()}`
      : null,
  });
}
