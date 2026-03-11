import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { devtools, persist } from "zustand/middleware";
import { callApi, paymentApiStr, TMarketPlaceSchema } from "@/lib";
import { toast } from "sonner";

type AdminType = {
  actions: {
    createRideCostSettings: (costSettings: TMarketPlaceSchema) => Promise<void>;
    getRideCostSettings: () => Promise<void>;
  };
};

const initialState = {};

export const useAdmin = create<AdminType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          createRideCostSettings: async (costSettings) => {
            const { data, error } = await callApi(
              paymentApiStr("/cost/settings"),
              costSettings,
            );
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              toast.success(
                data.message ?? "Cost settings created successfully",
              );
            }
          },
          getRideCostSettings: async () => {
            const { data, error } = await callApi(
              paymentApiStr("/cost/settings"),
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
