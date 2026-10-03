import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.BOOTSTRAP_ADMIN_NAME?.trim();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !name || !password || password.length < 12) {
    throw new Error(
      "Defina BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_NAME e BOOTSTRAP_ADMIN_PASSWORD (mínimo 12 caracteres) no ambiente.",
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
