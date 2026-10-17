import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.ADMIN_NAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !name || !password || password.length < 12) {
    throw new Error(
      "Defina ADMIN_EMAIL, ADMIN_NAME e ADMIN_PASSWORD (mínimo 12 caracteres) no ambiente.",
    );
  }

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash: await hash(password, 12),
      role: UserRole.ADMIN,
      active: true,
    },
    create: {
      email,
      name,
      passwordHash: await hash(password, 12),
      role: UserRole.ADMIN,
    },
  });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
