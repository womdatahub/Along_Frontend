import * as z from "zod";

export const marketPlaceSchema = z.object({
  baseFare: z
    .string()
    .min(1, "Base Fare is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  driverToRiderFee: z
    .string()
    .min(1, "Driver to rider fee is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  waitChargePerMin: z
    .string()
    .min(1, "Wait charge per min is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  tax: z
    .string()
    .min(1, "Tax is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  baseHaggle: z
    .string()
    .min(1, "Base Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  maxHaggle: z
    .string()
    .min(1, "Max Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  platformFee: z
    .string()
    .min(1, "Platform fee is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  surgeMultiplier: z
    .string()
    .min(1, "Surge multiplier is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  profileName: z.string().min(1, "Profile name is required!"),
  currency: z.string().min(1, "Currency is required!"),
});

export type TMarketPlaceSchema = z.infer<typeof marketPlaceSchema>;
