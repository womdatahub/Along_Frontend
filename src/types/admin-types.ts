import { TPromoAndVoucherSchema } from "@/lib";

export type CostSettingsType = {
  title: string;
  baseFare?: number;
  driverToRiderFee: number;
  waitingChargePerMinute: number;
  taxPercentage: number;
  baseHagglePercentage: number;
  maxHagglePercentage: number;
  platformFeePercentage: number;
  surgeMultiplier: number;
  currency?: string;
  isActive?: boolean;
};

export type AdminsType = {
  id: string;
  adminId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "SUPER_ADMIN";
  status: string;
  createdAt: string;
  updatedAt: string;
};

type PromoAndVoucherExtras = {
  totalUsageCount: number;
  validFrom: Date;
  validUntil: Date;
  status: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
};

export type PromoVoucherType = TPromoAndVoucherSchema & PromoAndVoucherExtras;
