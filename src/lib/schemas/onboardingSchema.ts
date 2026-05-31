import * as z from "zod";

// Still used by signInSchema inline below.
const usPhoneRegex = /^(\+1[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}$/;

/**
 * Returns the number of bare US digits in any phone string.
 * Strips non-digits, then removes a leading country-code 1 (no US area code
 * starts with 1 per NANP), so "+1 (555) 412 3456", "5554123456", and
 * "+15554123456" all yield 10.
 */
const countUSPhoneDigits = (v: string): number => {
  const digits = v.replace(/\D/g, "");
  return (digits.startsWith("1") ? digits.slice(1) : digits).length;
};

export const usPhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .refine(
    (v) => countUSPhoneDigits(v.trim()) === 10,
    "Enter a valid US phone number",
  );

// signIn schema
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) =>
        z.string().email().safeParse(value).success ||
        usPhoneRegex.test(value.trim()),
      "Enter a valid email address or US phone number",
    ),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters!")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message:
        "Password must include letters, numbers, and special characters (!@#$%^&*)",
    }),
});

// onboarding schema
export const onboardingSchema = z.object({
  referralCode: z.string().optional(),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, "Password must have at least 8 characters!")
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message:
        "Password must include letters, numbers, and special characters (!@#$%^&*)",
    }),
  mobileNumber: usPhoneSchema,
});

export const driverBasicInfoSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["male", "female", "other"], {
      message: "Please select a valid gender",
    }),
    firstEmergencyContact: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(/^[0-9+\-() ]+$/, "Please enter a valid phone number"),
    secondEmergencyContact: z
      .string()
      .min(10, "Please enter a valid phone number")
      .regex(/^[0-9+\-() ]+$/, "Please enter a valid phone number"),
  })
  .superRefine((data, ctx) => {
    const normalize = (v: string) => v.replace(/[\s\-()]/g, "");

    if (
      normalize(data.firstEmergencyContact) ===
      normalize(data.secondEmergencyContact)
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["secondEmergencyContact"], // attach error to second field
        message: "Emergency contact numbers must be different",
      });
    }
  });

export const socialSecurityNumberSchema = z.object({
  socialSecurityNumber: z
    .string()
    .min(1, "Social Security Number is required")
    .regex(
      /^\d{3}-\d{2}-\d{4}$/,
      "Enter a valid SSN in the format XXX-XX-XXXX (e.g., 123-45-6789)",
    ),
});
export const vehicleRegistrationSchema = z.object({
  vehicleMake: z.string().min(1, "Car make is required!"),
  vehicleModel: z.string().min(1, "Car model is required!"),
  vehicleColor: z.string().min(1, "Car color is required!"),
  vehicleYear: z.string().min(4, "Invalid year!").max(4, "Invalid year!"),
  vehicleIdentificationNumber: z
    .string()
    .min(1, "Car ID Number is required!")
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "VIN must be exactly 17 characters (A–Z, 0–9), excluding I, O, and Q",
    ),
});
export const vehicleInsuranceSchema = z.object({
  vehicleMake: z.string().min(1, "Car make is required!"),
  vehicleModel: z.string().min(1, "Car model is required!"),
  vehicleColor: z.string().min(1, "Car color is required!"),
  vehicleYear: z.string().min(4, "Invalid year!").max(4, "Invalid year!"),
  vehicleIdentificationNumber: z
    .string()
    .min(1, "Car ID Number is required!")
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "VIN must be exactly 17 characters (A–Z, 0–9), excluding I, O, and Q",
    ),
});

export const hearFromYouSchema = z.object({
  fullName: z.string(),
  email: z.email({ message: "Invalid email address" }),
  mobileNumber: usPhoneSchema,
  yourMessage: z.string().min(1, { message: "Message cannot be empty" }),
});

export const registerRiderSchema = z.object({
  firstName: z.string({ message: "Invalid first Name" }).min(1, {
    message: "First name is required",
  }),
  lastName: z.string({ message: "Invalid last Name" }).min(1, {
    message: "Last name is required",
  }),
  mobileNumber: usPhoneSchema,
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

export const updateMobileNumberSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  mobileNumber: usPhoneSchema,
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
});

export type TSignInValidator = z.infer<typeof signInSchema>;
export type TOnboardingValidator = z.infer<typeof onboardingSchema>;
export type TRegisterRiderValidator = z.infer<typeof registerRiderSchema>;
export type THearFromYouValidator = z.infer<typeof hearFromYouSchema>;
export type TCreateAccountValidator = z.infer<typeof createAccountSchema>;
export type TSocialSecurityNumberSchemaValidator = z.infer<
  typeof socialSecurityNumberSchema
>;
export type TVehicleRegistrationSchemaValidator = z.infer<
  typeof vehicleRegistrationSchema
>;
export type TUpdateMobileNumberSchemaValidator = z.infer<
  typeof updateMobileNumberSchema
>;
export type TDriverBasicInfoSchema = z.infer<typeof driverBasicInfoSchema>;
