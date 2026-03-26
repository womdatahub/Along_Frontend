import { create } from "zustand";
import type {
  SelectorFn,
  AdminsType,
  DriverProfile,
  SuspendedDriver,
} from "@/types";
import { devtools } from "zustand/middleware";
import { adminApiStr, callApi, TCreateNewAdminSchema } from "@/lib";
import { toast } from "sonner";

type AdminType = {
  allActiveAdmins: AdminsType[];
  allSuspendedAdmins: AdminsType[];
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
    suspendDriver: (suspendDetails: {
      userId: string;
      reason: string;
      suspensionType: "TEMPORARY" | "PERMANENT";
      suspensionDuration?: number;
    }) => Promise<void>;
    getPendingDriversKYC: () => Promise<void>;
    processDriverKYC: (data: {
      userId: string;
      action: "APPROVE" | "REJECT";
      notes: string;
    }) => Promise<void>;
    getAllRiders: () => Promise<void>;
    suspendRider: (suspendDetails: {
      userId: string;
      reason: string;
      suspensionType: "TEMPORARY" | "PERMANENT";
      suspensionDuration?: number;
    }) => Promise<void>;
    getSuspendedRiders: () => Promise<void>;
    getAllActiveAdmins: () => Promise<void>;
    getAllSuspendedAdmins: () => Promise<void>;
    createNewAdmin: (adminData: TCreateNewAdminSchema) => Promise<void>;
    suspendAdmin: (suspendData: {
      adminId: string;
      reason: string;
    }) => Promise<void>;
    restoreAdmin: (restoreData: { adminId: string }) => Promise<void>;
  };
};

const initialState = {
  allActiveAdmins: [],
  allSuspendedAdmins: [],
  isLoading: false,
  pendingDriversKYC: [],
  suspendedDrivers: [],
  suspendedRiders: [],
};

export const useAdmin = create<AdminType>()(
  devtools((set, get) => ({
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
        const path = adminApiStr("/users/drivers");
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
        const path = adminApiStr("/users/drivers/suspended");
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
      suspendDriver: async (suspendDetails) => {
        set({ isLoading: true });
        const path = adminApiStr("/compliance/drivers/suspend");
        const { data, error } = await callApi(path, suspendDetails);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Driver suspended successfully");
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
        const path = adminApiStr("/users/riders");
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
        const path = adminApiStr("/users/riders/suspended");
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
      suspendRider: async (suspendDetails) => {
        set({ isLoading: true });
        const path = adminApiStr("/compliance/users/suspend");
        const { data, error } = await callApi(path, suspendDetails);
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(path, data);
          set({ isLoading: false });
          toast.success(data.message ?? "Rider suspended successfully");
        }
      },
      getAllActiveAdmins: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/admins?status=active&limit=50&offset=0");
        const { data, error } = await callApi<AdminsType[]>(path);
        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ allActiveAdmins: data.data });
          toast.success(data.message ?? "Admins fetched successfully");
        }
        set({ isLoading: false });
      },
      getAllSuspendedAdmins: async () => {
        set({ isLoading: true });
        const path = adminApiStr("/admins?status=suspended&limit=50&offset=0");
        const { data, error } = await callApi<AdminsType[]>(path);
        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ allSuspendedAdmins: data.data });
          toast.success(data.message ?? "Admins fetched successfully");
        }
        set({ isLoading: false });
      },
      createNewAdmin: async (adminData) => {
        set({ isLoading: true });
        const path = adminApiStr("/admins");
        const { data, error } = await callApi(path, adminData);
        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return;
        }
        if (data) {
          toast.success(data.message ?? "Admins created successfully");
          await get().actions.getAllActiveAdmins();
        }
        set({ isLoading: false });
      },
      suspendAdmin: async (suspendDetails) => {
        set({ isLoading: true });
        const path = adminApiStr("/admins/suspend");
        const { data, error } = await callApi(path, suspendDetails, "PATCH");
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          await get().actions.getAllSuspendedAdmins();
          await get().actions.getAllActiveAdmins();
          set({ isLoading: false });
          toast.success(data.message ?? "Admin suspended successfully");
        }
      },
      restoreAdmin: async (restoreData) => {
        set({ isLoading: true });
        const path = adminApiStr("/admins/restore");
        const { data, error } = await callApi(path, restoreData, "PATCH");
        if (error) {
          set({ isLoading: false });
          toast.error(error.message);
          return;
        }
        if (data) {
          await get().actions.getAllActiveAdmins();
          await get().actions.getAllSuspendedAdmins();
          set({ isLoading: false });
          toast.success(data.message ?? "Admin restored successfully");
        }
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
