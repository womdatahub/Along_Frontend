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
});

export type TMarketPlaceSchema = z.infer<typeof marketPlaceSchema>;
