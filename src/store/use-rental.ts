import { create } from "zustand";
import type { SelectorFn, VehicleLocation } from "@/types";
import { callApi, rentalApiStr } from "@/lib";
import { toast } from "sonner";

type RentalStoreType = {
  availableVehicles: VehicleLocation[];
  actions: {
    retrieveAvailableVehicles: (queries: {
      [key: string]: string;
    }) => Promise<void>;
  };
};

const initialState = {
  availableVehicles: [],
};

export const useRental = create<RentalStoreType>()(() => ({
  ...initialState,
  actions: {
    retrieveAvailableVehicles: async (queries) => {
      const params = new URLSearchParams(queries);
      const queryString = params.toString();
      const path = rentalApiStr(
        `/vehicles${queryString ? `?${queryString}` : ""}`
      );
      const { data, error } = await callApi<{ vehicles: VehicleLocation[] }>(
        path
      );
      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
  },
}));

export const useRentals = <TResult>(
  selector: SelectorFn<RentalStoreType, TResult>
) => {
  const state = useRental(selector);

  return state;
};
