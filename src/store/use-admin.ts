import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { devtools, persist } from "zustand/middleware";
import { adminApiStr, callApi, paymentApiStr, TMarketPlaceSchema } from "@/lib";
import { toast } from "sonner";

type AdminType = {
  isCreatingCostSetting: boolean;
  actions: {
    createRideCostSettings: (
      costSettings: TMarketPlaceSchema,
    ) => Promise<boolean>;
    getRideCostSettings: () => Promise<void>;
    updateRideCost: (
      costSettings: Partial<TMarketPlaceSchema>,
    ) => Promise<void>;
  };
};

const initialState = { isCreatingCostSetting: false };

export const useAdmin = create<AdminType>()(
  devtools(
    persist(
      (set) => ({
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
              console.log(data);
              set({ isCreatingCostSetting: false });
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
            }
            return true;
          },
          updateRideCost: async (costSetting) => {
            const { data, error } = await callApi(
              adminApiStr("/cost-settings/ride"),
              costSetting,
            );
            if (error) {
              toast.error(error.message ?? "Something went wrong");
              return;
            }
            if (data) {
              console.log(data);
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
            }
          },
          getRideCostSettings: async () => {
            const { data, error } = await callApi(
              paymentApiStr("/cost-settings/ride"),
            );
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              toast.success(
                data.message ?? "Cost settings fetched successfully",
              );
            }
          },
        },
      }),
      {
        name: "use-admin-store",
        partialize: (state) => ({}),
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
