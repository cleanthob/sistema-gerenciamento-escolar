import { z } from "zod";

export const attendanceSchema = z.object({
  studentId: z.string().min(1),
  date: z.coerce.date(),
  subject: z.string().trim().max(100).optional(),
  status: z.enum(["PRESENT", "ABSENT", "LATE", "EXCUSED"]),
  note: z.string().trim().max(500).optional(),
});

const sanctionFields = z.object({
  studentId: z.string().min(1),
  type: z.enum(["WARNING", "SUSPENSION"]),
  reason: z.string().trim().min(5).max(1000),
  startsAt: z.coerce.date(),
  endsAt: z.union([z.coerce.date(), z.null()]).optional(),
  guardianContactRequired: z.boolean(),
  guardianContactStatus: z.enum(["PENDING", "CONTACTED", "NOT_REQUIRED"]),
  notes: z.string().trim().max(1000).optional(),
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
    { message: "Informe ao menos um campo para atualização." },
  );
