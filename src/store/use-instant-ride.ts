import { create } from "zustand";

import type { SelectorFn } from "@/types";
// import { apiStr, callApi, USER } from "@/lib";
// import { toast } from "sonner";

type CreateRideBase = {
  rideType: "shared"; // [solo, shared, rushed]
  adults: number;
  children: number;
  pickUpLat: number;
  pickUpLong: number;
  pickUpAddress: string;
  dropOffLat: number;
  dropOffLong: number;
  dropOffAddress: string;
  luggage: string;
  pet: string;
};

type InstantRideType = {
  user: string;
  actions: {
    createSoloRide: (
      data: CreateRideBase & {
        class: "luxury";
      }
    ) => Promise<void>;
    createSharedRide: (data: CreateRideBase) => Promise<void>;
    createRushedRide: (data: CreateRideBase) => Promise<void>;
    getRide: () => Promise<void>;
    updateRide: (data: {
      vehicleClass: string;
      initialCost: number;
    }) => Promise<void>;
    getAllRides: () => Promise<void>;
    cancelRide: () => Promise<void>;
    deleteRideData: () => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useRide = create<InstantRideType>()(() => ({
  ...initialState,

  actions: {},
}));

export const useRides = <TResult>(
  selector: SelectorFn<InstantRideType, TResult>
) => {
  const state = useRide(selector);

  return state;
};
