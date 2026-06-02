import { create } from "zustand";
import type {
  SelectorFn,
  AdminsType,
  DriverProfile,
  SuspendedDriver,
  AllRiderAccount,
  AllDriversAccount,
  PendingKycType,
  RiderProfile,
} from "@/types";
import { devtools } from "zustand/middleware";
import { requests, TCreateNewAdminSchema } from "@/lib";
import { toast } from "sonner";

type AdminType = {
  allActiveAdmins: AdminsType[];
  allSuspendedAdmins: AdminsType[];
  isLoading: boolean;
  isProcessingKYC: boolean;
  pendingKyc: PendingKycType | null;
  suspendedDrivers: SuspendedDriver[];
  suspendedRiders: AllRiderAccount[];
  allRiders: AllRiderAccount[];
  allDrivers: AllDriversAccount[];
  singleDriverDetails: DriverProfile | null;
  singleRiderDetails: RiderProfile | null;
  sosAlerts: SosAlert[];
  activeRentals: ActiveRental[];
  dashboardMetrics: Record<string, unknown> | null;
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
    suspendDriverOrRider: (
      suspendDetails: {
        userId: string;
        reason: string;
        suspensionType: "TEMPORARY" | "PERMANENT";
        suspensionDuration?: number;
      },
      type: "driver" | "rider",
    ) => Promise<void>;
    reactivateDriverOrRider: (
      reactivateDetails: {
        userId: string;
        reason?: string;
        notes?: string;
      },
      type: "driver" | "rider",
    ) => Promise<void>;
    getpendingKyc: () => Promise<PendingKycType>;
    processDriverKYC: (data: {
      driverId: string;
      action: "APPROVE" | "REJECT";
      notes?: string;
      reason?: string;
      licenseExpiryDate?: string;
    }) => Promise<void>;
    getAllRiders: () => Promise<void>;
    getSuspendedRiders: () => Promise<void>;
    getAllActiveAdmins: () => Promise<void>;
    getAllSuspendedAdmins: () => Promise<void>;
    createNewAdmin: (adminData: TCreateNewAdminSchema) => Promise<void>;
    suspendAdmin: (suspendData: {
      adminId: string;
      reason: string;
    }) => Promise<void>;
    restoreAdmin: (restoreData: { adminId: string }) => Promise<void>;
    getSingleDriverDetails: (driverID: string) => Promise<void>;
    getSingleRiderDetails: (riderId: string) => Promise<void>;
  };
};

export type SosAlert = {
  tripID?: string;
  _id?: string;
  id?: string;
  driver?: string;
  rider?: string;
  status?: string;
  type?: string;
  timeStamp?: string;
  initiator?: string;
  [key: string]: unknown;
};

export type ActiveRental = {
  _id?: string;
  id?: string;
  rentalId?: string;
  driverId?: string;
  riderId?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  pickup?: string;
  dropoff?: string;
  [key: string]: unknown;
};

const initialState = {
  allActiveAdmins: [],
  allSuspendedAdmins: [],
  isLoading: false,
  isProcessingKYC: false,
  pendingKyc: null,
  suspendedDrivers: [],
  suspendedRiders: [],
  allRiders: [],
  allDrivers: [],
  singleDriverDetails: null,
  singleRiderDetails: null,
  sosAlerts: [] as SosAlert[],
  activeRentals: [] as ActiveRental[],
  dashboardMetrics: null as Record<string, unknown> | null,
};

export const useAdmin = create<AdminType>()(
  devtools((set, get) => ({
    ...initialState,
    actions: {
      getAdminDashboardDetails: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getMetrics();
        set({ isLoading: false });
        if (error) return;
        if (data?.data) {
          set({ dashboardMetrics: data.data as Record<string, unknown> });
        }
      },
      getActiveRides: async () => {
        await requests.admin.getActiveRides();
      },
      getPendingRequests: async () => {
        await requests.admin.getPendingRequests();
      },
      getActiveRentals: async () => {
        const { data } = await requests.admin.getActiveRentals();
        if (!data) return;
        const raw = data as unknown;
        const list: ActiveRental[] = Array.isArray(raw)
          ? (raw as ActiveRental[])
          : Array.isArray((raw as Record<string, unknown>)?.data)
            ? ((raw as Record<string, unknown>).data as ActiveRental[])
            : [];
        set({ activeRentals: list });
      },
      getDriverAvailability: async () => {
        await requests.admin.getDriverAvailability();
      },
      getRideRoutePlayback: async () => {
        await requests.admin.getRideRoutePlayback();
      },
      getSOSAlerts: async () => {
        const { data } = await requests.admin.getSOSAlerts();
        if (!data) return;
        const raw = data as unknown;
        const list: SosAlert[] = Array.isArray(raw)
          ? (raw as SosAlert[])
          : Array.isArray((raw as Record<string, unknown>)?.data)
            ? ((raw as Record<string, unknown>).data as SosAlert[])
            : [];
        set({ sosAlerts: list });
      },
      resolveSOSAlert: async (alert) => {
        const { data, error } = await requests.admin.resolveSOSAlert(alert);
        if (error) return;
        if (data) {
          toast.success(data.message ?? "SOS alert resolved");
          // Refresh alert list after resolution
          await get().actions.getSOSAlerts();
        }
      },
      getAllDrivers: async () => {
        set({ isLoading: false });
        const { data, error } = await requests.admin.getAllDrivers();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({
            isLoading: false,
            allDrivers: data.data.filter(
              (driver) => driver.isSuspended !== true,
            ),
          });
        }
      },
      getSuspendedDrivers: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getSuspendedDrivers();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ suspendedDrivers: data.data, isLoading: false });
        }
      },
      suspendDriverOrRider: async (suspendDetails, type) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.admin.suspendUser(suspendDetails);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
          if (type === "driver") {
            await get().actions.getAllDrivers();
            await get().actions.getSuspendedDrivers();
          } else if (type === "rider") {
            await get().actions.getAllRiders();
            await get().actions.getSuspendedRiders();
          }
          toast.success(data.message ?? "User suspended successfully");
        }
      },
      reactivateDriverOrRider: async (reactivateDetails, type) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.admin.reactivateUser(reactivateDetails);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false });
          if (type === "driver") {
            await get().actions.getAllDrivers();
            await get().actions.getSuspendedDrivers();
          } else if (type === "rider") {
            await get().actions.getAllRiders();
            await get().actions.getSuspendedRiders();
          }
          toast.success(data.message ?? "User reactivated successfully");
        }
      },
      getpendingKyc: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getPendingKyc();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, pendingKyc: data.data });
        }
      },
      processDriverKYC: async (driverKYCData) => {
        set({ isProcessingKYC: true });
        const { data, error } =
          await requests.admin.processDriverKyc(driverKYCData);
        if (error) {
          set({ isProcessingKYC: false });
          return;
        }
        if (data) {
          await get().actions.getpendingKyc();
          toast.success(data.message ?? "KYC processed successfully");
          set({ isProcessingKYC: false });
        }
      },
      getAllRiders: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getAllRiders();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({
            isLoading: false,
            allRiders: data.data.filter((r) => r.isSuspended !== true),
          });
        }
      },
      getSuspendedRiders: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getSuspendedRiders();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ suspendedRiders: data.data, isLoading: false });
        }
      },

      getAllActiveAdmins: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getActiveAdmins();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ allActiveAdmins: data.data });
        }
        set({ isLoading: false });
      },
      getAllSuspendedAdmins: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.getSuspendedAdmins();
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ allSuspendedAdmins: data.data });
        }
        set({ isLoading: false });
      },
      createNewAdmin: async (adminData) => {
        set({ isLoading: true });
        const { data, error } = await requests.admin.createAdmin(adminData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          toast.success(data.message ?? "Admin created successfully");
          await get().actions.getAllActiveAdmins();
        }
        set({ isLoading: false });
      },
      suspendAdmin: async (suspendDetails) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.admin.suspendAdmin(suspendDetails);
        if (error) {
          set({ isLoading: false });
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
        const { data, error } = await requests.admin.restoreAdmin(restoreData);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          await get().actions.getAllActiveAdmins();
          await get().actions.getAllSuspendedAdmins();
          set({ isLoading: false });
          toast.success(data.message ?? "Admin restored successfully");
        }
      },
      getSingleDriverDetails: async (driverID) => {
        set({ isLoading: true, singleDriverDetails: null });
        const { data, error } = await requests.admin.getDriverById(driverID);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, singleDriverDetails: data.data });
        }
      },
      getSingleRiderDetails: async (riderId) => {
        set({ isLoading: true, singleRiderDetails: null });
        const { data, error } = await requests.admin.getRiderById(riderId);
        if (error) {
          set({ isLoading: false });
          return;
        }
        if (data) {
          set({ isLoading: false, singleRiderDetails: data.data });
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
