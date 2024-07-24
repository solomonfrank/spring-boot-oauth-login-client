import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().trim().min(1, { message: "Password is required." }),
  email: z.string().trim().email({ message: "Invalid email address" }),
});

export const signupSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: "Email address is required " })
      .email({ message: "Invalid email address" }),
    password: z.string().trim().min(1, { message: "Password is required " }),
    confirmPassword: z
      .string()
      .trim()
      .min(1, { message: "Confirm password is required " }),
    name: z.string().trim().min(1, { message: "Full name is required " }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password.trim() !== confirmPassword.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The passwords did not match",
        path: ["confirmPassword"],
      });
    }
  });

export const createEventSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  duration: z.string().trim().min(1, { message: "Duration is required" }),
  description: z.string().trim(),
  price: z.string().trim(),
});
