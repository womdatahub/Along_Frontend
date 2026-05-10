import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { comingSoonMessage } from "@/lib";
import { toast } from "sonner";

type useRideMatchingType = {
  user: string;
  isLoading: boolean;
  // matchedRide: MatchedRide | null;
  // matchHistory: MatchedRide[];

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
  // matchedRide: null,
  // matchHistory: [],
};

const showRideComingSoon = async (..._args: unknown[]) => {
  void _args;
  toast.info(comingSoonMessage);
};

export const useRideMatching = create<useRideMatchingType>()(() => ({
  ...initialState,

  actions: {
    matchRide: showRideComingSoon,
    retryMatch: showRideComingSoon,
    getMatchedByID: showRideComingSoon,
    cancelMatch: showRideComingSoon,
    acceptOrRejectMatch: showRideComingSoon,
    updateDriverAvailability: showRideComingSoon,
    getMatchStatus: showRideComingSoon,
    getMatchHistory: showRideComingSoon,
    getAllMatchesAdmin: showRideComingSoon,
    deleteMatchHistory: showRideComingSoon,
  },
}));

export const useRideMatchings = <TResult>(
  selector: SelectorFn<useRideMatchingType, TResult>
) => {
  const state = useRideMatching(selector);

  return state;
};
