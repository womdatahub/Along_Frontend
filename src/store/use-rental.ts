import { create } from "zustand";
import type {
  RentAndCreateIntentResponseType,
  RentAndCreateIntentType,
  SelectorFn,
  VehicleLocation,
} from "@/types";
import { callApi, rentalApiStr } from "@/lib";
import { toast } from "sonner";
import { useSession } from "./use-session";

type RentalStoreType = {
  isLoading: boolean;
  availableVehicles: VehicleLocation[];
  intent: RentAndCreateIntentResponseType | undefined;
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
    }) => Promise<void>;
  };
};

const initialState = {
  availableVehicles: [],
  intent: undefined,
  isLoading: false,
};

export const useRental = create<RentalStoreType>()((set) => ({
  ...initialState,
  actions: {
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
        return;
      }
      if (data) {
        console.log(data, path);
        toast.success(
          data.message ?? "Vehicle listed for rentals successfully!",
        );
        set({ isLoading: false });
      }
    },
    retrieveAvailableVehicles: async (queries) => {
      set({ isLoading: true });
      const path = rentalApiStr(`/vehicles`, queries);
      const { data, error } = await callApi<{ vehicles: VehicleLocation[] }>(
        path,
      );
      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return;
      }
      if (data) {
        console.log(data, path);
        set({ isLoading: false, availableVehicles: data.data.vehicles });
      }
    },
    rentAndCreateIntent: async (data) => {
      const path = rentalApiStr("/rider/rent");
      const { data: response, error } =
        await callApi<RentAndCreateIntentResponseType>(path, data);
      if (error) {
        toast.error(error.message);
        return;
      }
      if (response) {
        toast.success(response.message);
        set({ intent: response.data });
        console.log(response, path);
      }
    },
  },
}));

export const useRentals = <TResult>(
  selector: SelectorFn<RentalStoreType, TResult>,
) => {
  const state = useRental(selector);

  return state;
};
