import { z } from "zod";

export const placementSubmitSchema = z.object({
  studentName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").max(120),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(8, "Telefone inválido").max(20),
  age: z.number().int().min(5).max(100).optional(),
  objective: z.string().max(200).optional(),
  selfDeclaredLevel: z.string().max(100).optional(),
  consentAccepted: z
    .boolean()
    .refine((v) => v === true, { message: "É necessário aceitar os termos de consentimento" }),
  responsibleConsent: z.boolean().optional(),
  objectiveAnswers: z.record(z.string(), z.string()),
  writingAnswer: z.string().max(2000).optional(),
});

export type PlacementSubmitInput = z.infer<typeof placementSubmitSchema>;
