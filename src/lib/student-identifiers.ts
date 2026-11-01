import { prisma } from "@/lib/prisma";

type DuplicateStudentIdentifiers = {
  registration?: string;
  email?: string;
};

export async function findDuplicateStudentIdentifiers(
  identifiers: { registration?: string; email?: string },
  excludeStudentId?: string,
): Promise<DuplicateStudentIdentifiers> {
  const [registrationMatch, emailMatch] = await Promise.all([
    identifiers.registration
      ? prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id"
          FROM "Student"
          WHERE LOWER(TRIM("registration")) = LOWER(TRIM(${identifiers.registration}))
            AND (${excludeStudentId ?? null} IS NULL OR "id" != ${excludeStudentId ?? ""})
          LIMIT 1
        `
      : Promise.resolve([]),
    identifiers.email
      ? prisma.$queryRaw<Array<{ id: string }>>`
          SELECT "id"
          FROM "Student"
          WHERE "email" IS NOT NULL
            AND LOWER(TRIM("email")) = LOWER(TRIM(${identifiers.email}))
            AND (${excludeStudentId ?? null} IS NULL OR "id" != ${excludeStudentId ?? ""})
          LIMIT 1
        `
      : Promise.resolve([]),
  ]);

  return {
    ...(registrationMatch.length
      ? { registration: "Esta matrícula já está cadastrada." }
      : {}),
    ...(emailMatch.length
      ? { email: "Este e-mail já está cadastrado." }
      : {}),
  };
}
