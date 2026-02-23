import * as z from "zod";

export const marketPlaceSchema = z.object({
  baseFare: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  driverToRiderFee: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  waitChargePerMin: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  tax: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  baseHaggle: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  maxHaggle: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  platformFee: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  surgeMultiplier: z
    .string()
    .min(1, "Basic Haggle is required!")
    .regex(/^\d+$/, "Only numbers are allowed!"),
  profileName: z.string().min(1, "Profile name is required!"),
});

export type TMarketPlaceSchema = z.infer<typeof marketPlaceSchema>;
