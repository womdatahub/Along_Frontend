import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

import type {
  PaymentIntentResponse,
  RentAndCreateIntentType,
  SelectorFn,
  VehicleLocation,
} from "@/types";
import { callApi, rentalApiStr } from "@/lib";
import { toast } from "sonner";
import { useSession } from "./use-session";

type RentalStoreType = {
  isLoading: boolean;
  isCreatingIntent: boolean;
  availableVehicles: VehicleLocation[];
  intent: PaymentIntentResponse | undefined;
  selectedDriverDetails: VehicleLocation | undefined;
  actions: {
    retrieveAvailableVehicles: (queries: {
      [key: string]: string;
    }) => Promise<void>;
    rentAndCreateIntent: (data: RentAndCreateIntentType) => Promise<void>;
    listVehicleForRental: (data: {
      vehicleId: string;
      latitude: number;
      longitude: number;
      address: string;
    }) => Promise<string>;
    setSelectedDriverDetails: (data: VehicleLocation) => void;
    cancelRental: (rentalId: string) => Promise<void>;
  };
};

const initialState = {
  availableVehicles: [],
  isCreatingIntent: false,
  intent: undefined,
  isLoading: false,
  selectedDriverDetails: undefined,
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
              deviceType: "Android",
              deviceOS: "android",
              deviceMake: "Xiaomi",
              deviceModel: "Note 13 Pro",
              ...vehicleInfo,
            };
            const path = rentalApiStr(`/driver/rent`);
            const { data, error } = await callApi(path, d);
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
              console.log(data, path);
              set({ isLoading: false, availableVehicles: data.data.vehicles });
            }
          },
          rentAndCreateIntent: async (data) => {
            set({ isCreatingIntent: true });
            const path = rentalApiStr("/rider/rent");
            const { data: response, error } =
              await callApi<PaymentIntentResponse>(path, data);
            if (error) {
              toast.error(error.message);
              set({ isCreatingIntent: false });
              return;
            }
            if (response) {
              toast.success(response.message);
              set({ intent: response.data, isCreatingIntent: false });
            }
          },
          cancelRental: async (rentalId: string) => {
            set({ isCreatingIntent: true });
            const path = rentalApiStr(`/rider/rent/cancel/${rentalId}`);
            const { data: response, error } = await callApi(path, {}, "DELETE");
            if (error) {
              toast.error(error.message);
              set({ isCreatingIntent: false });
              return;
            }
            if (response) {
              toast.success(response.message);
              // set({ intent: response.data, isCreatingIntent: false });
            }
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
