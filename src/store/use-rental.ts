import { create } from "zustand";
import type {
  RentAndCreateIntentResponseType,
  RentAndCreateIntentType,
  SelectorFn,
  VehicleLocation,
} from "@/types";
import { callApi, rentalApiStr } from "@/lib";
import { toast } from "sonner";

type RentalStoreType = {
  isLoading: boolean;
  availableVehicles: VehicleLocation[];
  intent: RentAndCreateIntentResponseType | undefined;
  actions: {
    retrieveAvailableVehicles: (queries: {
      [key: string]: string;
    }) => Promise<void>;
    rentAndCreateIntent: (data: RentAndCreateIntentType) => Promise<void>;
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
    retrieveAvailableVehicles: async (queries) => {
      set({ isLoading: true });
      const params = new URLSearchParams(queries);
      const queryString = params.toString();
      const path = rentalApiStr(
        `/vehicles${queryString ? `?${queryString}` : ""}`,
      );
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
