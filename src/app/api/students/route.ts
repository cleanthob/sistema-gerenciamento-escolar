import { forbidden, getSession, unauthorized } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createStudentSchema } from "@/lib/validations/student";
import { UserRole } from "@prisma/client";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

const managementRoles: UserRole[] = [
  UserRole.ADMIN,
  UserRole.DIRECTOR,
  UserRole.TEACHER,
];

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!managementRoles.includes(session.role)) return forbidden();

  const searchParams = new URL(request.url).searchParams;
  const query = searchParams.get("q")?.trim();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const perPage = Math.min(
    100,
    Math.max(1, Number(searchParams.get("perPage")) || 25),
  );
  const requestedSort = searchParams.get("sort") ?? "name";
  const sortField = [
    "name",
    "registration",
    "grade",
    "className",
    "createdAt",
  ].includes(requestedSort)
    ? requestedSort
    : "name";
  const order = searchParams.get("order") === "DESC" ? "desc" : "asc";
  const where = query
    ? {
        OR: [
          { name: { contains: query } },
          { registration: { contains: query } },
          { guardianName: { contains: query } },
        ],
      }
    : {};
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { [sortField]: order },
      select: {
        id: true,
        registration: true,
        name: true,
        email: true,
        grade: true,
        className: true,
        status: true,
        guardianName: true,
        guardianPhone: true,
        guardianEmail: true,
        createdAt: true,
      },
    }),
    prisma.student.count({ where }),
  ]);
  return NextResponse.json({ data: students, total });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return unauthorized();
  if (!managementRoles.includes(session.role)) return forbidden();

  const parsed = createStudentSchema.safeParse(
    await request.json().catch(() => null),
  );

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    const messages = Object.entries(fieldErrors).flatMap(([field, errors]) =>
      (errors ?? []).map((message) => `${message}`),
    );

    return NextResponse.json(
      {
        error:
          messages.length > 0
            ? messages.join(" ")
            : "Revise os campos informados.",
        details: fieldErrors,
      },
      { status: 400 },
    );
  }

  const { initialPassword, ...studentData } = parsed.data;
  try {
    const student = await prisma.student.create({
      data: {
        ...studentData,
        email: studentData.email || null,
        guardianEmail: studentData.guardianEmail || null,
        passwordHash: await hash(initialPassword, 12),
        mustChangePassword: true,
      },
      select: {
        id: true,
        registration: true,
        name: true,
        email: true,
        grade: true,
        className: true,
        status: true,
        guardianName: true,
        guardianPhone: true,
        guardianEmail: true,
        mustChangePassword: true,
      },
    });
    return NextResponse.json({ data: student }, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json(
        { error: "Matrícula ou e-mail já está cadastrado." },
        { status: 409 },
      );
    }
    throw error;
  }
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}
