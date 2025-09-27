import * as z from "zod";

// signIn schema
export const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});
export const onboardingSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters!")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message:
        "Password must include letters, numbers, and special characters (!@#$%^&*)",
    }),
});

// create account
export const createAccountSchema = z
  .object({
    firstName: z.string().min(3, {
      message: "First name is required",
    }),
    lastName: z.string().min(3, {
      message: "Last name is required",
    }),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters!")
      .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
        message:
          "Password must include letters, numbers, and special characters (!@#$%^&*)",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type TSignInValidator = z.infer<typeof signInSchema>;
export type TOnboardingValidator = z.infer<typeof onboardingSchema>;
export type TCreateAccountValidator = z.infer<typeof createAccountSchema>;
