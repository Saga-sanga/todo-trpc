import { z } from "zod";

export const userAuthFormSchema = z.object({
  email: z.string().email(),
});

export const settingsFormSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  image: z.string(),
  id: z.string(),
});
