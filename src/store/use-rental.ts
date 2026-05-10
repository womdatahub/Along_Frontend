import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type {
  PaymentIntentResponse,
  RentalRecord,
  RentAndCreateIntentType,
  SelectorFn,
  VehicleLocation,
} from "@/types";
import {
  callApi,
  createIdempotencyKey,
  rentalApiStr,
  tripHistoryApiStr,
} from "@/lib";
import { toast } from "sonner";
import { useSession } from "./use-session";

type RentalStoreType = {
  isLoading: boolean;
  isCreatingIntent: boolean;
  availableVehicles: VehicleLocation[];
  activeRentals: RentalRecord[];
  rentalHistory: RentalRecord[];
  intent: PaymentIntentResponse | undefined;
  selectedRental: RentalRecord | undefined;
  selectedDriverDetails: VehicleLocation | undefined;
  actions: {
    retrieveAvailableVehicles: (queries: {
      [key: string]: string;
    }) => Promise<void>;
    rentAndCreateIntent: (
      data: RentAndCreateIntentType,
    ) => Promise<PaymentIntentResponse | undefined>;
    listVehicleForRental: (data: {
      vehicleId: string;
      latitude: number;
      longitude: number;
      address: string;
    }) => Promise<string>;
    delistVehicleForRental: (vehicleId: string) => Promise<boolean>;
    setSelectedDriverDetails: (data: VehicleLocation) => void;
    cancelRental: (rentalId: string) => Promise<void>;
    fetchRentals: () => Promise<void>;
    fetchActiveRentals: () => Promise<void>;
    fetchRentalDetails: (rentalId: string) => Promise<void>;
    fetchRentalHistory: (rentalId: string) => Promise<void>;
    beginRental: (rentalId: string) => Promise<boolean>;
    finalizeRental: (rentalId: string) => Promise<boolean>;
    clearIntent: () => void;
  };
};

const initialState = {
  availableVehicles: [],
  activeRentals: [],
  rentalHistory: [],
  isCreatingIntent: false,
  intent: undefined,
  isLoading: false,
  selectedDriverDetails: undefined,
  selectedRental: undefined,
  createdIntent: undefined,
};

export const useRental = create<RentalStoreType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setSelectedDriverDetails: (
            selectedDriverDetails: VehicleLocation,
          ) => {
            set({ selectedDriverDetails });
          },
          listVehicleForRental: async (vehicleInfo) => {
            set({ isLoading: true });
            await useSession.getState().actions.createRideProfile({
              allowPets: true,
              luggageCapacity: 20,
              passangerCapacity: 4,
              ratePerHour: 30,
              currentLocation: vehicleInfo.address,
              latitude: vehicleInfo.latitude,
              longitude: vehicleInfo.longitude,
            });
            const d = {
              accuracy: 20,
              capacity: 3,
              deviceId: "EAB",
              deviceType: "Android" as const,
              deviceOS: "Android",
              deviceMake: "Xiaomi",
              deviceModel: "Note 13 Pro",
              ...vehicleInfo,
            };
            const path = rentalApiStr(`/driver/rent`);
            const { data, error } = await callApi(path, d, undefined, {
              idempotencyKey: createIdempotencyKey("list-vehicle"),
            });
            if (error) {
              toast.error(error.message);
              set({ isLoading: false });

              return error.accountLink ?? "";
            }
            if (data) {
              toast.success(
                data.message ?? "Vehicle listed for rentals successfully!",
              );
              set({ isLoading: false });
            }
            return "";
          },
          retrieveAvailableVehicles: async (queries) => {
            set({ isLoading: true });
            const path = rentalApiStr(`/vehicles`, queries);
            const { data, error } = await callApi<{
              vehicles: VehicleLocation[];
            }>(path);
            if (error) {
              toast.error(
                error.message ??
                  (error.error as string) ??
                  "There was an error retrieving available vehicles",
              );
              set({ isLoading: false });
              return;
            }
            if (data) {
              set({ isLoading: false, availableVehicles: data.data.vehicles });
            }
          },
          rentAndCreateIntent: async (data) => {
            set({ isCreatingIntent: true });
            const path = rentalApiStr("/rider/rent");
            const { data: response, error } =
              await callApi<PaymentIntentResponse>(path, data, undefined, {
                idempotencyKey: createIdempotencyKey("rental"),
              });
            if (error) {
              toast.error(error.message);
              set({ isCreatingIntent: false });
              return undefined;
            }
            if (response) {
              toast.success(response.message);
              set({ intent: response.data, isCreatingIntent: false });
              return response.data;
            }
            set({ isCreatingIntent: false });
            return undefined;
          },
          cancelRental: async (rentalId: string) => {
            set({ isCreatingIntent: true });
            const path = rentalApiStr(`/rider/rent/cancel/${rentalId}`);
            const { data: response, error } = await callApi(
              path,
              undefined,
              "DELETE",
            );
            if (error) {
              toast.error(error.message);
              set({ isCreatingIntent: false });
              return;
            }
            if (response) {
              toast.success(response.message);
              set({ intent: undefined, isCreatingIntent: false });
            }
          },
          fetchRentals: async () => {
            set({ isLoading: true });
            const { data, error } = await callApi<RentalRecord[]>(
              rentalApiStr("/rentals"),
            );
            if (error) {
              toast.error(error.message);
              set({ isLoading: false });
              return;
            }
            set({ rentalHistory: data?.data ?? [], isLoading: false });
          },
          fetchActiveRentals: async () => {
            set({ isLoading: true });
            const { data, error } = await callApi<RentalRecord[]>(
              rentalApiStr("/rentals/active"),
              undefined,
              undefined,
              { skipToast: true },
            );
            if (error) {
              set({ activeRentals: [], isLoading: false });
              return;
            }
            set({ activeRentals: data?.data ?? [], isLoading: false });
          },
          fetchRentalDetails: async (rentalId) => {
            set({ isLoading: true });
            const { data, error } = await callApi<RentalRecord>(
              rentalApiStr(`/${rentalId}`),
            );
            if (error) {
              toast.error(error.message);
              set({ isLoading: false });
              return;
            }
            set({ selectedRental: data?.data, isLoading: false });
          },
          fetchRentalHistory: async (rentalId) => {
            set({ isLoading: true });
            const { data, error } = await callApi<RentalRecord[]>(
              tripHistoryApiStr(`/history/${rentalId}`),
            );
            if (error) {
              toast.error(error.message);
              set({ isLoading: false });
              return;
            }
            set({ rentalHistory: data?.data ?? [], isLoading: false });
          },
          beginRental: async (rentalId) => {
            const { data, error } = await callApi(
              rentalApiStr(`/${rentalId}/begin`),
              undefined,
              "POST",
              { idempotencyKey: createIdempotencyKey("begin-rental") },
            );
            if (error) {
              toast.error(error.message);
              return false;
            }
            toast.success(data?.message ?? "Rental started");
            await useRental.getState().actions.fetchRentalDetails(rentalId);
            return true;
          },
          finalizeRental: async (rentalId) => {
            const { data, error } = await callApi(
              rentalApiStr(`/${rentalId}/finalize`),
              undefined,
              "POST",
              { idempotencyKey: createIdempotencyKey("finalize-rental") },
            );
            if (error) {
              toast.error(error.message);
              return false;
            }
            toast.success(data?.message ?? "Rental finalized");
            await useRental.getState().actions.fetchRentalDetails(rentalId);
            return true;
          },
          clearIntent: () => set({ intent: undefined }),
          delistVehicleForRental: async (vehicleId) => {
            if (!vehicleId) return false;
            set({ isLoading: true });
            const { data, error } = await callApi(
              rentalApiStr(`/driver/rent/delist/${vehicleId}`),
              undefined,
              "DELETE",
              { idempotencyKey: createIdempotencyKey("delist-vehicle") },
            );
            if (error) {
              toast.error(error.message);
              set({ isLoading: false });
              return false;
            }
            toast.success(data?.message ?? "Vehicle removed from rentals");
            set({ isLoading: false });
            await useRental.getState().actions.fetchRentals();
            return true;
          },
        },
      }),
      {
        name: "rental-store",
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          selectedDriverDetails: state.selectedDriverDetails,
          intent: state.intent,
        }),
      },
    ),
  ),
);

export const useRentals = <TResult>(
  selector: SelectorFn<RentalStoreType, TResult>,
) => {
  const state = useRental(selector);

  return state;
};
