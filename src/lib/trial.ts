import { z } from "zod";
import { SERVICE_OPTIONS } from "./site";

export const TRIAL_SERVICE = "Essai gratuit · 10 jours";
export const trialSchema = z.object({
  name: z.string().trim().min(1, "Indiquez votre nom").max(100),
  email: z.string().trim().email("Indiquez un email valide").max(160).toLowerCase(),
  company: z.string().trim().min(1, "Indiquez votre activité").max(120),
  service: z.enum(SERVICE_OPTIONS),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Veuillez accepter les conditions de l'essai." }),
  }),
});
export type TrialInput = z.infer<typeof trialSchema>;
