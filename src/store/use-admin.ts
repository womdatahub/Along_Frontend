import { create } from "zustand";
import type {
  SelectorFn,
  AdminsType,
  DriverProfile,
  SuspendedDriver,
} from "@/types";
import { devtools } from "zustand/middleware";
import { adminApiStr, callApi } from "@/lib";
import { toast } from "sonner";

type AdminType = {
  allAdmins: AdminsType[];
  isLoading: boolean;
  pendingDriversKYC: DriverProfile[];
  suspendedDrivers: SuspendedDriver[];
  suspendedRiders: SuspendedDriver[];
  actions: {
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
    getSuspendedDrivers: () => Promise<void>;
    getPendingDriversKYC: () => Promise<void>;
    processDriverKYC: (data: {
      userId: string;
      action: "APPROVE" | "REJECT";
      notes: string;
    }) => Promise<void>;
    getAllRiders: () => Promise<void>;
    getSuspendedRiders: () => Promise<void>;
    getAllAdmins: () => Promise<void>;
  };
};

const initialState = {
  allAdmins: [],
  isLoading: false,
  pendingDriversKYC: [],
  suspendedDrivers: [],
  suspendedRiders: [],
};

export const useAdmin = create<AdminType>()(
  devtools((set) => ({
    ...initialState,
    actions: {
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
      getSuspendedDrivers: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/drivers/suspended");
        const { data, error } = await callApi<SuspendedDriver[]>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ suspendedDrivers: data.data, isLoading: false });
          toast.success(
            data.message ?? "Suspended drivers fetched successfully",
          );
        }
      },
      getPendingDriversKYC: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/compliance/kyc/pending");
        const { data, error } = await callApi<DriverProfile[]>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          toast.success(data.message ?? "Pending KYC fetched successfully");
          set({ isLoading: false, pendingDriversKYC: data.data });
        }
      },
      processDriverKYC: async (driverKYCData) => {
        set({ isLoading: true });
        const path = adminApiStr("/compliance/kyc");
        const { data, error } = await callApi(path, driverKYCData);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          toast.success(data.message ?? "KYC processed successfully");
          set({ isLoading: false });
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
      getSuspendedRiders: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/riders/suspended");
        const { data, error } = await callApi<SuspendedDriver[]>(path);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ suspendedDrivers: data.data, isLoading: false });
          toast.success(
            data.message ?? "Suspended riders fetched successfully",
          );
        }
      },
      getAllAdmins: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/admins?status=active&limit=50&offset=0");
        const { data, error } = await callApi<AdminsType[]>(path);
        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ allAdmins: data.data });
          toast.success(data.message ?? "Admins fetched successfully");
        }
        set({ isLoading: false });
      },
    },
  })),
);

export const useAdmins = <TResult>(
  selector: SelectorFn<AdminType, TResult>,
) => {
  const state = useAdmin(selector);

  return state;
};
