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
