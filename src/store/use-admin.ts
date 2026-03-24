import { create } from "zustand";
import type { SelectorFn, AdminsType } from "@/types";
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
  allAdmins: AdminsType[];
  isLoading: boolean;
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
    getAdminDashboardDetails: () => Promise<void>;
    getActiveRides: () => Promise<void>;
    getPendingRequests: () => Promise<void>;
    getActiveRentals: () => Promise<void>;
    getDriverAvailability: () => Promise<void>;
    getRideRoutePlayback: () => Promise<void>;
    getSOSAlerts: () => Promise<void>;
    resolveSOSAlert: (alert: {
      alertId: string;
      resolution: string;
    }) => Promise<void>;
    getAllDrivers: () => Promise<void>;
    getAllRiders: () => Promise<void>;
    getAllAdmins: () => Promise<void>;
  };
};

const initialState = {
  isCreatingCostSetting: false,
  rideCostSettings: [],
  allAdmins: [],
  isLoading: false,
};

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
          getAdminDashboardDetails: async () => {
            const path = adminApiStr("/operations/dashboard");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getActiveRides: async () => {
            const path = adminApiStr("/operations/rides/active");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getPendingRequests: async () => {
            const path = adminApiStr("/operations/rides/pending");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getActiveRentals: async () => {
            const path = adminApiStr("/operations/rentals/active");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getDriverAvailability: async () => {
            const path = adminApiStr("/operations/driver/availability");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getRideRoutePlayback: async () => {
            const path = adminApiStr("/operations/rides/playback");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(
                data.message ?? "Dashboard details fetched successfully",
              );
            }
          },
          getSOSAlerts: async () => {
            const path = adminApiStr("/sos/alerts");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(data.message ?? "SOS alerts fetched successfully");
            }
          },
          resolveSOSAlert: async (alert) => {
            const path = adminApiStr("/sos/alerts/resolve");
            const { data, error } = await callApi(path, alert);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(data.message ?? "SOS resolved successfully");
            }
          },
          getAllDrivers: async () => {
            const path = adminApiStr("/drivers");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(data.message ?? "Drivers fetched successfully");
            }
          },
          getAllRiders: async () => {
            const path = adminApiStr("/riders");
            const { data, error } = await callApi(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              console.log(path, data);
              toast.success(data.message ?? "Riders fetched successfully");
            }
          },
          getAllAdmins: async () => {
            const path = adminApiStr("/admins?status=active&limit=50&offset=0");
            const { data, error } = await callApi<AdminsType[]>(path);
            if (error) {
              toast.error(error.message);
              return;
            }
            if (data) {
              set({ allAdmins: data.data });
              toast.success(data.message ?? "Admins fetched successfully");
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
