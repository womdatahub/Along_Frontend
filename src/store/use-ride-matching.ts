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

type UseRideType = {
  user: string;
  actions: {
    matchRide: (data: {
      rideId: string;
      riderId: string;
      rideType: "instant" | "scheduled" | "rush";
    }) => Promise<void>;
    retryMatch: (data: { rideId: string }) => Promise<void>;
    getMatchedByID: () => Promise<void>;
    cancelMatch: () => Promise<void>;
    acceptOrRejectMatch: (data: {
      response: "accept" | "reject";
      reason?: string;
    }) => Promise<void>;
    updateDriverAvailability: (data: {
      available: boolean;
      location: {
        lat: number;
        long: number;
        address: string;
      };
    }) => Promise<void>;
    getMatchStatus: () => Promise<void>;
    getMatchHistory: () => Promise<void>;
    getAllMatchesAdmin: () => Promise<void>;
    deleteMatchHistory: () => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useRideMatching = create<UseRideType>()(() => ({
  ...initialState,

  actions: {},
}));

export const useRideMatchings = <TResult>(
  selector: SelectorFn<UseRideType, TResult>
) => {
  const state = useRideMatching(selector);

  return state;
};
