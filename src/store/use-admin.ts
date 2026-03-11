import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { devtools, persist } from "zustand/middleware";
import {
  adminApiStr,
  callApi,
  removeFieldsFromObject,
  TMarketPlaceSchema,
} from "@/lib";
import { toast } from "sonner";

type AdminType = {
  isCreatingCostSetting: boolean;
  rideCostSettings: TMarketPlaceSchema[];
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
  };
};

const initialState = { isCreatingCostSetting: false, rideCostSettings: [] };

export const useAdmin = create<AdminType>()(
  devtools(
    persist(
      (set, get) => ({
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
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
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
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
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
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
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
                toast.success(
                  data.message ?? "Cost settings fetched successfully",
                );
            }
          },
        },
      }),
      {
        name: "use-admin-store",
        partialize: (state) => ({
          isCreatingCostSetting: state.isCreatingCostSetting,
        }),
      },
    ),
  ),
);

export const useAdmins = <TResult>(
  selector: SelectorFn<AdminType, TResult>,
) => {
  const state = useAdmin(selector);

  return state;
};
