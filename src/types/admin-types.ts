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
