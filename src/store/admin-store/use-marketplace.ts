import { create } from "zustand";
import type { PromoVoucherType, SelectorFn } from "@/types";
import { devtools } from "zustand/middleware";
import {
  adminApiStr,
  callApi,
  removeFieldsFromObject,
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
    getRideCostSettings: (hideToast?: boolean) => Promise<void>;
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
        const { data, error } = await callApi(
          adminApiStr("/cost-settings/ride"),
          {
            ...rest,
            baseFare: Number(baseFare),
            baseHagglePercentage: Number(baseHagglePercentage),
            driverToRiderFee: Number(driverToRiderFee),
            maxHagglePercentage: Number(maxHagglePercentage),
            platformFeePercentage: Number(platformFeePercentage),
            waitingChargePerMinute: Number(waitingChargePerMinute),
            taxPercentage: Number(taxPercentage),
            surgeMultiplier: Number(surgeMultiplier),
          },
        );
        if (error) {
          console.log(error);
          toast.error(error.message ?? "Something went wrong");
          set({ isCreatingCostSetting: false });
          return false;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Cost settings created successfully");
          await get().actions.getRideCostSettings(true);
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
        const { data, error } = await callApi(
          adminApiStr("/cost-settings/ride"),
          {
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
          },
          "PATCH",
        );
        if (error) {
          console.log(error);
          toast.error(error.message ?? "Something went wrong");
          set({ isCreatingCostSetting: false });
          return false;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Cost settings created successfully");
          await get().actions.getRideCostSettings(true);
        }
        return true;
      },
      activateOrDeactivateCostSetting: async (costSetting) => {
        set({ isCreatingCostSetting: true });
        const { data, error } = await callApi(
          adminApiStr("/cost-settings/ride"),
          costSetting,
          "PATCH",
        );
        if (error) {
          console.log(error);
          toast.error(error.message ?? "Something went wrong");
          set({ isCreatingCostSetting: false });
          return;
        }
        if (data) {
          set({ isCreatingCostSetting: false });
          toast.success(data.message ?? "Cost settings created successfully");
          await get().actions.getRideCostSettings(true);
        }
        return;
      },

      getRideCostSettings: async (hideToast) => {
        const { data, error } = await callApi<TMarketPlaceSchema[]>(
          adminApiStr("/cost-settings/ride"),
        );
        if (error) {
          if (!hideToast) toast.error(error.message);
          return;
        }
        if (data) {
          set({ rideCostSettings: data.data });
          if (!hideToast)
            toast.success(data.message ?? "Cost settings fetched successfully");
        }
      },
      createVoucher: async (voucherDetails) => {
        const { data, error } = await callApi(adminApiStr("/vouchers"), {
          ...voucherDetails,
          discountValue: Number(voucherDetails.discountValue),
          minOrderAmount: Number(voucherDetails.minOrderAmount),
          maxDiscountAmount: Number(voucherDetails.maxDiscountAmount),
          maxUsagePerUser: Number(voucherDetails.maxUsagePerUser),
          maxTotalUsage: Number(voucherDetails.maxTotalUsage),
          discountType: voucherDetails.discountType.toUpperCase(),
        });
        if (error) {
          toast.error(error.message);
          return;
        }
        if (data) {
          await get().actions.getVouchers();
          toast.success(data.message ?? "Voucher created successfully");
        }
      },
      getVouchers: async () => {
        const { data, error } = await callApi<PromoVoucherType[]>(
          adminApiStr("/vouchers"),
        );
        if (error) {
          toast.error(error.message);
          return;
        }
        if (data) {
          set({ allVouchers: data.data });
          toast.success(data.message ?? "Vouchers fetched successfully");
        }
      },
      updateVoucher: async (voucherDetails) => {
        const { data, error } = await callApi(
          adminApiStr("/vouchers"),
          voucherDetails,
          "PATCH",
        );
        if (error) {
          toast.error(error.message);
          return;
        }
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
