import { z } from "zod";

const optionalEmail = z
  .union([z.literal(""), z.string().email("Informe um e-mail válido.")])
  .optional();
const phoneSchema = z
  .string()
  .trim()
  .min(10, "Informe um telefone com DDD.")
  .max(20);

export const createStudentSchema = z.object({
  registration: z.string().trim().min(1, "Matrícula obrigatória.").max(30),
  name: z.string().trim().min(3, "Informe o nome completo.").max(120),
  email: optionalEmail,
  grade: z.string().trim().min(1, "Ano escolar obrigatório.").max(30),
  className: z.string().trim().min(1, "Turma obrigatória.").max(30),
  guardianName: z
    .string()
    .trim()
    .min(3, "Informe o nome do responsável.")
    .max(120),
  guardianPhone: phoneSchema,
  guardianEmail: optionalEmail,
  initialPassword: z
    .string()
    .min(10, "A senha inicial deve ter ao menos 10 caracteres.")
    .max(128),
});

export const updateStudentSchema = z
  .object({
    registration: z.string().trim().min(1).max(30).optional(),
    name: z.string().trim().min(3).max(120).optional(),
    email: optionalEmail,
    grade: z.string().trim().min(1).max(30).optional(),
    className: z.string().trim().min(1).max(30).optional(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
    guardianName: z.string().trim().min(3).max(120).optional(),
    guardianPhone: phoneSchema.optional(),
    guardianEmail: optionalEmail,
  })
  .refine(
    (value) => Object.values(value).some((field) => field !== undefined),
    {
      message: "Informe ao menos um campo para atualizar.",
    },
  );

export const resetPasswordSchema = z.object({
  temporaryPassword: z
    .string()
    .min(10, "A senha temporária deve ter ao menos 10 caracteres.")
    .max(128)
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual obrigatória."),
    newPassword: z
      .string()
      .min(12, "A nova senha deve ter ao menos 12 caracteres.")
      .max(128),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "A nova senha deve ser diferente da senha atual.",
    path: ["newPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Matrícula ou e-mail obrigatório."),
  password: z.string().min(1, "Senha obrigatória."),
  audience: z.enum(["STUDENT", "STAFF"]),
});
