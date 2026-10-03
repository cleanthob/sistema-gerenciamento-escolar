import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";

const staffRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!staffRoles.includes(session.role)) return forbidden();

  const search = new URL(request.url).searchParams;
  const id = search.get("id");
  if (id) {
    const user = await prisma.user.findFirst({
      where: { id, role: { in: staffRoles } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        phone: true,
        active: true,
      },
    });
    if (!user)
      return NextResponse.json(
        { error: "Conta da equipe não encontrada." },
        { status: 404 },
      );
    return NextResponse.json({ data: user });
  }
  const query = search.get("q")?.trim();
  const matchingRole = staffRoles.find((role) => role === query?.toUpperCase());
  const page = Math.max(1, Number(search.get("page")) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, Number(search.get("perPage")) || 25),
  );
  const sortField = search.get("sort") === "email" ? "email" : "name";
  const sortOrder = search.get("order") === "DESC" ? "desc" : "asc";
  const where = {
    role: { in: [UserRole.ADMIN, UserRole.DIRECTOR, UserRole.TEACHER] },
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { email: { contains: query } },
            { department: { contains: query } },
            ...(matchingRole ? [{ role: { equals: matchingRole } }] : []),
          ],
        }
      : {}),
  };
  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [sortField]: sortOrder },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        phone: true,
        active: true,
      },
    }),
    prisma.user.count({ where }),
  ]);
  return NextResponse.json({ data, total });
}
