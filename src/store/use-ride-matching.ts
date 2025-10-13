import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { callApi, matchingApiStr } from "@/lib";
import { toast } from "sonner";

type useRideMatchingType = {
  user: string;
  actions: {
    matchRide: (data: {
      rideId: string;
      riderId: string;
      rideType: "instant" | "scheduled" | "rush";
    }) => Promise<void>;
    retryMatch: (data: { rideId: string }) => Promise<void>;
    getMatchedByID: (ID: string) => Promise<void>;
    cancelMatch: (ID: string) => Promise<void>;
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
    getMatchStatus: (ID: string) => Promise<void>;
    getMatchHistory: () => Promise<void>;
    getAllMatchesAdmin: () => Promise<void>;
    deleteMatchHistory: (ID: string) => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useRideMatching = create<useRideMatchingType>()(() => ({
  ...initialState,

  actions: {
    matchRide: async (matchRideData) => {
      const path = matchingApiStr("");

      const { data, error } = await callApi(path, matchRideData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    retryMatch: async (retryMatchData) => {
      const path = matchingApiStr("");

      const { data, error } = await callApi(path, retryMatchData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    getMatchedByID: async (ID) => {
      const path = matchingApiStr(`/${ID}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    cancelMatch: async (ID) => {
      const path = matchingApiStr(`/${ID}`);

      const { data, error } = await callApi(path, {}, "DELETE");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    acceptOrRejectMatch: async (acceptOrRejectMatchData) => {
      const path = matchingApiStr("/respond");

      const { data, error } = await callApi(path, acceptOrRejectMatchData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    updateDriverAvailability: async (updateDriverAvailabilityData) => {
      const path = matchingApiStr("/driver/availability");

      const { data, error } = await callApi(path, updateDriverAvailabilityData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    getMatchStatus: async (ID) => {
      const path = matchingApiStr(`/status/${ID}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    getMatchHistory: async () => {
      const path = matchingApiStr("/history");

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    getAllMatchesAdmin: async () => {
      const path = matchingApiStr("/history");

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    deleteMatchHistory: async (ID) => {
      const path = matchingApiStr(`/history/${ID}`);

      const { data, error } = await callApi(path, {}, "DELETE");

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

export const useRideMatchings = <TResult>(
  selector: SelectorFn<useRideMatchingType, TResult>
) => {
  const state = useRideMatching(selector);

  return state;
};
