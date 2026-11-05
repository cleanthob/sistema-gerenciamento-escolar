import { z } from "zod";

const optionalEmail = z
  .union([z.literal(""), z.string().trim().email("Informe um e-mail válido.")])
  .optional()
  .transform((value) => (value ? value.trim().toLowerCase() : value));

const phoneSchema = z
  .string()
  .trim()
  .min(10, "Informe um telefone com DDD.")
  .max(20, "O telefone deve ter no máximo 20 caracteres.");

const photoDataSchema = z.union([
  z.literal(""),
  z
    .string()
    .max(1_333_359, "A foto deve ter no máximo 1 MB.")
    .regex(
      /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/,
      "Envie uma imagem PNG, JPG ou WebP válida.",
    ),
]);

const optionalPhoto = photoDataSchema.nullable().optional();

export const profilePhotoSchema = z.object({
  photoUrl: photoDataSchema,
});

export const createStudentSchema = z.object({
  registration: z
    .string()
    .trim()
    .min(1, "Matrícula obrigatória.")
    .max(30, "A matrícula deve ter no máximo 30 caracteres.")
    .transform((value) => value.toUpperCase()),

  name: z
    .string()
    .trim()
    .min(3, "Informe o nome completo.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  photoUrl: optionalPhoto,

  email: optionalEmail,

  grade: z
    .string()
    .trim()
    .min(1, "Ano escolar obrigatório.")
    .max(30, "O ano escolar deve ter no máximo 30 caracteres."),

  className: z
    .string()
    .trim()
    .min(1, "Turma obrigatória.")
    .max(30, "A turma deve ter no máximo 30 caracteres."),

  guardianName: z
    .string()
    .trim()
    .min(3, "Informe o nome do responsável.")
    .max(120, "O nome do responsável deve ter no máximo 120 caracteres."),

  guardianPhone: phoneSchema,

  guardianEmail: optionalEmail,

  initialPassword: z
    .string()
    .min(10, "A senha inicial deve ter ao menos 10 caracteres.")
    .max(128, "A senha inicial deve ter no máximo 128 caracteres."),
});

export const updateStudentSchema = z
  .object({
    registration: z
      .string()
      .trim()
      .min(1, "A matrícula não pode ficar vazia.")
      .max(30, "A matrícula deve ter no máximo 30 caracteres.")
      .transform((value) => value.toUpperCase())
      .optional(),

    name: z
      .string()
      .trim()
      .min(3, "O nome deve ter ao menos 3 caracteres.")
      .max(120, "O nome deve ter no máximo 120 caracteres.")
      .optional(),

    photoUrl: optionalPhoto,

    email: optionalEmail,

    grade: z
      .string()
      .trim()
      .min(1, "O ano escolar não pode ficar vazio.")
      .max(30, "O ano escolar deve ter no máximo 30 caracteres.")
      .optional(),

    className: z
      .string()
      .trim()
      .min(1, "A turma não pode ficar vazia.")
      .max(30, "A turma deve ter no máximo 30 caracteres.")
      .optional(),

    status: z
      .enum(["ACTIVE", "INACTIVE"], {
        message: "Selecione um status válido.",
      })
      .optional(),

    createdAt: z.coerce
      .date({
        message: "Informe uma data de criação válida.",
      })
      .optional(),

    guardianName: z
      .string()
      .trim()
      .min(3, "O nome do responsável deve ter ao menos 3 caracteres.")
      .max(120, "O nome do responsável deve ter no máximo 120 caracteres.")
      .optional(),

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
    .max(128, "A senha temporária deve ter no máximo 128 caracteres.")
    .optional(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual obrigatória."),

    newPassword: z
      .string()
      .min(12, "A nova senha deve ter ao menos 12 caracteres.")
      .max(128, "A nova senha deve ter no máximo 128 caracteres."),
  })
  .refine((value) => value.currentPassword !== value.newPassword, {
    message: "A nova senha deve ser diferente da senha atual.",
    path: ["newPassword"],
  });

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Matrícula ou e-mail obrigatório."),

  password: z.string().min(1, "Senha obrigatória."),

  audience: z.enum(["STUDENT", "STAFF"], {
    message: "Selecione um tipo de acesso válido.",
  }),
});
