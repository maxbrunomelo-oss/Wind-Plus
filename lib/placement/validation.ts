import { z } from "zod";

export const placementSubmitSchema = z.object({
  studentName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(1).max(30).refine(
    (v) => v.replace(/\D/g, "").length >= 8,
    { message: "Telefone inválido" }
  ),
  age: z.number().int().min(5).max(100).optional(),
  objective: z.string().max(200).optional(),
  selfDeclaredLevel: z.string().max(100).optional(),
  consentAccepted: z
    .boolean()
    .refine((v) => v === true, { message: "É necessário aceitar os termos de consentimento" }),
  responsibleConsent: z.boolean().optional(),
  objectiveAnswers: z.record(z.string(), z.string()),
  writingAnswer: z.string().max(2000).optional(),
  durationSeconds: z.number().int().min(0).max(86400).optional(), // max 24h
  questionTimings: z.record(z.string(), z.number()).optional(),
});

export type PlacementSubmitInput = z.infer<typeof placementSubmitSchema>;
