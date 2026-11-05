import { z } from "zod";

export const attendanceSchema = z.object({
  studentId: z.string().min(1, "Selecione um aluno."),

  date: z.coerce.date({
    message: "Informe uma data válida.",
  }),

  subject: z
    .string()
    .trim()
    .max(100, "A disciplina deve ter no máximo 100 caracteres.")
    .optional(),

  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"], {
    message: "Selecione um status de frequência válido.",
  }),

  note: z
    .string()
    .trim()
    .max(500, "A observação deve ter no máximo 500 caracteres.")
    .optional(),
});

const sanctionFields = z.object({
  studentId: z.string().min(1, "Selecione um aluno."),

  type: z.enum(["WARNING", "SUSPENSION"], {
    message: "Selecione um tipo de medida disciplinar válido.",
  }),

  reason: z
    .string()
    .trim()
    .min(5, "O motivo deve ter ao menos 5 caracteres.")
    .max(1000, "O motivo deve ter no máximo 1000 caracteres."),

  startsAt: z.coerce.date({
    message: "Informe uma data inicial válida.",
  }),

  endsAt: z
    .union([
      z.coerce.date({
        message: "Informe uma data final válida.",
      }),
      z.null(),
    ])
    .optional(),

  guardianContactRequired: z.boolean({
    message: "Informe se o contato com o responsável é obrigatório.",
  }),

  guardianContactStatus: z.enum(["PENDING", "CONTACTED", "NOT_REQUIRED"], {
    message: "Selecione um status de contato válido.",
  }),

  notes: z
    .string()
    .trim()
    .max(1000, "As observações devem ter no máximo 1000 caracteres.")
    .optional(),
});

export const sanctionSchema = sanctionFields.refine(
  (record) =>
    record.type !== "SUSPENSION" ||
    !record.endsAt ||
    record.endsAt >= record.startsAt,
  {
    message:
      "A data final da suspensão deve ser igual ou posterior à data inicial.",
    path: ["endsAt"],
  },
);

export const updateSanctionSchema = sanctionFields
  .omit({ studentId: true })
  .partial()
  .refine(
    (record) => Object.values(record).some((value) => value !== undefined),
    {
      message: "Informe ao menos um campo para atualização.",
    },
  );
