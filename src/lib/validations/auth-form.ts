import { z } from "zod";

export const loginFields = z.object({
  identifier: z.string().trim().min(1, "Informe sua matrícula ou e-mail."),
  password: z.string().min(1, "Informe sua senha."),
});

export const loginFormSchema = loginFields.extend({
  audience: z.enum(["STUDENT", "STAFF"], {
    message: "Selecione um tipo de acesso válido.",
  }),
});

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe sua senha atual."),
    newPassword: z
      .string()
      .min(12, "Use pelo menos 12 caracteres.")
      .max(128, "A nova senha deve ter no máximo 128 caracteres."),
    confirmation: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((values) => values.newPassword === values.confirmation, {
    message: "As senhas não coincidem.",
    path: ["confirmation"],
  });

export type LoginFields = z.infer<typeof loginFormSchema>;
export type ChangePasswordFields = z.infer<typeof passwordChangeSchema>;
