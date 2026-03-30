import * as z from "zod";

export const marketPlaceSchema = z.object({
  title: z.string({ message: "Cost settings title is required." }),
  isActive: z.boolean().default(false).optional(),
  baseFare: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  driverToRiderFee: z
    .string()
    .min(1, "Driver to rider fee is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  waitingChargePerMinute: z
    .string()
    .min(1, "Wait charge per min is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  taxPercentage: z
    .string()
    .min(1, "Tax percentage is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  baseHagglePercentage: z
    .string()
    .min(1, "Base Haggle percentage is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  maxHagglePercentage: z
    .string()
    .min(1, "Max Haggle percentage is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  platformFeePercentage: z
    .string()
    .min(1, "Platform fee percentage is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  surgeMultiplier: z
    .string()
    .min(1, "Surge multiplier is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  currency: z.string().min(1, "Currency is required!"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  id: z.string().optional(),
});

export const createNewAdminSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  firstName: z.string().min(3, {
    message: "First name is required",
  }),
  lastName: z.string().min(3, {
    message: "Last name is required",
  }),
  mobileNumber: z.string({ message: "Invalid mobile number" }).min(10, {
    message: "Phone number must be at least 10 digits long",
  }),
  role: z.string().min(1, {
    message: "Role is required",
  }),
});
export const suspensionSchema = z.object({
  reason: z.string().optional(),
  suspensionDuration: z.string().optional(),
  suspensionType: z.string().optional(),
});

const DiscountType = z.enum(["PERCENTAGE", "FIXED"]);
const ApplicableFor = z.enum(["both", "delivery", "pickup"]);

export const promoAndVoucherSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Z0-9_-]+$/, "Invalid code format")
    .transform((v) => v.toUpperCase()),
  discountType: DiscountType,
  discountValue: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),

  maxDiscountAmount: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),

  minOrderAmount: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),

  maxUsagePerUser: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),

  maxTotalUsage: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),

  validFrom: z.string(),
  validUntil: z.string(),
  applicableFor: ApplicableFor,
  description: z.string().max(255).optional(),
});

export type TMarketPlaceSchema = z.infer<typeof marketPlaceSchema>;
export type TCreateNewAdminSchema = z.infer<typeof createNewAdminSchema>;
export type TSuspensionSchema = z.infer<typeof suspensionSchema>;
export type TPromoAndVoucherSchema = z.infer<typeof promoAndVoucherSchema>;
