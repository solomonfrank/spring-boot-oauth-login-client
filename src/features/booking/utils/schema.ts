import { z } from "zod";

export const bookSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  name: z.string().trim().min(1, { message: "Full name is required." }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, { message: "Phone number is required." }),
});
