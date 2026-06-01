import { create } from "zustand";
import type { PromoVoucherType, SelectorFn } from "@/types";
import { devtools } from "zustand/middleware";
import {
  removeFieldsFromObject,
  requests,
  TMarketPlaceSchema,
  TPromoAndVoucherSchema,
} from "@/lib";
import { toast } from "sonner";

type MarketPlaceType = {
  isCreatingCostSetting: boolean;
  rideCostSettings: TMarketPlaceSchema[];
  isLoading: boolean;
  allVouchers: PromoVoucherType[];
  actions: {
    createRideCostSettings: (
      costSettings: TMarketPlaceSchema,
    ) => Promise<boolean>;
    getRideCostSettings: () => Promise<void>;
    updateRideCost: (
      costSettings: Partial<TMarketPlaceSchema>,
    ) => Promise<boolean>;
    activateOrDeactivateCostSetting: (data: {
      costId: string;
      isActive: boolean;
    }) => Promise<void>;
    createVoucher: (
      voucherDetails: TPromoAndVoucherSchema & {
        validFrom: Date;
        validUntil: Date;
      },
    ) => Promise<void>;
    getVouchers: () => Promise<void>;
    updateVoucher: (voucherDetails: {
      status: string;
      voucherId: string;
    }) => Promise<void>;
  };
};

const initialState = {
  isLoading: false,
  isCreatingCostSetting: false,
  rideCostSettings: [],
  allVouchers: [],
};

export const useMarketPlace = create<MarketPlaceType>()(
  devtools((set, get) => ({
    ...initialState,
    actions: {
      createRideCostSettings: async (costSettings) => {
        const {
          baseFare,
          baseHagglePercentage,
          driverToRiderFee,
          maxHagglePercentage,
          platformFeePercentage,
          waitingChargePerMinute,
          taxPercentage,
          surgeMultiplier,
          ...rest
        } = costSettings;
        set({ isCreatingCostSetting: true });
        const { data, error } =
          await requests.marketplace.createRideCostSettings({
            ...rest,
            baseFare: Number(baseFare),
            baseHagglePercentage: Number(baseHagglePercentage),
            driverToRiderFee: Number(driverToRiderFee),
            maxHagglePercentage: Number(maxHagglePercentage),
            platformFeePercentage: Number(platformFeePercentage),
            waitingChargePerMinute: Number(waitingChargePerMinute),
            taxPercentage: Number(taxPercentage),
            surgeMultiplier: Number(surgeMultiplier),
          });
        if (error) {
          set({ isCreatingCostSetting: false });
          return false;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Fare profile created successfully");
          await get().actions.getRideCostSettings();
        }
        return true;
      },
      updateRideCost: async (costSetting) => {
        const {
          baseFare,
          baseHagglePercentage,
          driverToRiderFee,
          maxHagglePercentage,
          platformFeePercentage,
          waitingChargePerMinute,
          taxPercentage,
          surgeMultiplier,
          ...rest
        } = removeFieldsFromObject(costSetting, [
          "createdAt",
          "updatedAt",
          "isActive",
          "id",
        ]);
        set({ isCreatingCostSetting: true });
        const { data, error } =
          await requests.marketplace.updateRideCostSettings({
            ...rest,
            baseFare: Number(baseFare),
            baseHagglePercentage: Number(baseHagglePercentage),
            driverToRiderFee: Number(driverToRiderFee),
            maxHagglePercentage: Number(maxHagglePercentage),
            platformFeePercentage: Number(platformFeePercentage),
            waitingChargePerMinute: Number(waitingChargePerMinute),
            taxPercentage: Number(taxPercentage),
            surgeMultiplier: Number(surgeMultiplier),
            costId: costSetting.id,
          });
        if (error) {
          set({ isCreatingCostSetting: false });
          return false;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Fare profile updated successfully");
          await get().actions.getRideCostSettings();
        }
        return true;
      },
      activateOrDeactivateCostSetting: async (costSetting) => {
        set({ isCreatingCostSetting: true });
        const { data, error } =
          await requests.marketplace.updateRideCostSettings(
            costSetting as Record<string, unknown>,
          );
        if (error) {
          set({ isCreatingCostSetting: false });
          return;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Fare profile status updated");
          await get().actions.getRideCostSettings();
        }
      },

      getRideCostSettings: async () => {
        const { data, error } =
          await requests.marketplace.getRideCostSettings();
        if (error) return;
        if (data) {
          set({ rideCostSettings: data.data });
        }
      },
      createVoucher: async (voucherDetails) => {
        const { data, error } = await requests.marketplace.createVoucher({
          ...voucherDetails,
          discountValue: Number(voucherDetails.discountValue),
          minOrderAmount: Number(voucherDetails.minOrderAmount),
          maxDiscountAmount: Number(voucherDetails.maxDiscountAmount),
          maxUsagePerUser: Number(voucherDetails.maxUsagePerUser),
          maxTotalUsage: Number(voucherDetails.maxTotalUsage),
          discountType: voucherDetails.discountType.toUpperCase(),
        });
        if (error) return;
        if (data) {
          await get().actions.getVouchers();
          toast.success(data.message ?? "Voucher created successfully");
        }
      },
      getVouchers: async () => {
        const { data, error } = await requests.marketplace.getVouchers();
        if (error) return;
        if (data) {
          set({ allVouchers: data.data });
        }
      },
      updateVoucher: async (voucherDetails) => {
        const { data, error } =
          await requests.marketplace.updateVoucher(voucherDetails);
        if (error) return;
        if (data) {
          await get().actions.getVouchers();
          toast.success(data.message ?? "Voucher updated successfully");
        }
      },
    },
  })),
);

export const useMarketPlaces = <TResult>(
  selector: SelectorFn<MarketPlaceType, TResult>,
) => {
  const state = useMarketPlace(selector);

  return state;
};
