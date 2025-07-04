import { z } from "zod";
import { DEFAULT_PET_IMAGE } from "./constants";

export const petIdSchema = z.string().uuid();

export const petFormSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required").max(100),
    ownerName: z.string().trim().min(1, "Owner name is required").max(100),
    imageUrl: z.union([
      z.literal(""),
      z.string().trim().url("Invalid image URL"),
    ]),
    age: z.coerce.number().int().positive().max(9999),
    notes: z.string().trim().max(1000),
  })
  .transform((data) => ({
    ...data,
    imageUrl: data.imageUrl || DEFAULT_PET_IMAGE,
  }));

export type TPetForm = z.infer<typeof petFormSchema>;

export const authSchema = z.object({
  email: z.string().email().max(100),
  password: z.string().max(100),
});

export type TAuth = z.infer<typeof authSchema>;
