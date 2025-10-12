import { create } from "zustand";

import type { SelectorFn } from "@/types";
// import { toast } from "sonner";

type MatchedRide = {
  id: string;
  rideId: string;
  riderId: string;
  status: string;
  [key: string]: unknown;
};

type RideMatchingType = {
  user: string;
  isLoading: boolean;
  matchedRide: MatchedRide | null;
  matchHistory: MatchedRide[];
  actions: {
    matchRide: (data: {
      rideId: string;
      riderId: string;
      rideType: "instant" | "scheduled" | "rush";
    }) => Promise<void>;
    retryMatch: (data: {
      rideId: string;
    }) => Promise<void>;
    getMatchedByID: (matchId: string) => Promise<void>;
    cancelMatch: (data: {
      matchId: string;
      reason?: string;
    }) => Promise<void>;
    updateMatch: (data: {
      matchId: string;
      status: string;
    }) => Promise<void>;
    getAllMatches: () => Promise<void>;
    getMatchHistory: () => Promise<void>;
    confirmMatch: (matchId: string) => Promise<void>;
    rejectMatch: (data: {
      matchId: string;
      reason?: string;
    }) => Promise<void>;
    deleteMatchHistory: () => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
  matchedRide: null,
  matchHistory: [],
};

export const useRideMatching = create<RideMatchingType>()((set) => ({
  ...initialState,

  actions: {
    matchRide: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/match`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to match ride');
        }

        const result = await response.json();
        console.log('Ride matched:', result);
        set({ matchedRide: result, isLoading: false });
        // toast.success("Ride matched successfully!");
      } catch (error) {
        console.error('Error matching ride:', error);
        // toast.error("Failed to match ride");
        set({ isLoading: false });
      }
    },

    retryMatch: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/retry`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to retry match');
        }

        const result = await response.json();
        console.log('Match retried:', result);
        set({ matchedRide: result, isLoading: false });
        // toast.success("Retrying match...");
      } catch (error) {
        console.error('Error retrying match:', error);
        // toast.error("Failed to retry match");
        set({ isLoading: false });
      }
    },

    getMatchedByID: async (matchId) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/${matchId}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get matched ride');
        }

        const result = await response.json();
        console.log('Matched ride:', result);
        set({ matchedRide: result, isLoading: false });
      } catch (error) {
        console.error('Error getting matched ride:', error);
        set({ isLoading: false });
      }
    },

    cancelMatch: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/cancel`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to cancel match');
        }

        const result = await response.json();
        console.log('Match cancelled:', result);
        set({ matchedRide: null, isLoading: false });
        // toast.success("Match cancelled successfully!");
      } catch (error) {
        console.error('Error cancelling match:', error);
        // toast.error("Failed to cancel match");
        set({ isLoading: false });
      }
    },

    updateMatch: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/update`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update match');
        }

        const result = await response.json();
        console.log('Match updated:', result);
        set({ matchedRide: result, isLoading: false });
        // toast.success("Match updated successfully!");
      } catch (error) {
        console.error('Error updating match:', error);
        // toast.error("Failed to update match");
        set({ isLoading: false });
      }
    },

    getAllMatches: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/all`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get all matches');
        }

        const result = await response.json();
        console.log('All matches:', result);
        set({ matchHistory: result, isLoading: false });
      } catch (error) {
        console.error('Error getting all matches:', error);
        set({ isLoading: false });
      }
    },

    getMatchHistory: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/history`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get match history');
        }

        const result = await response.json();
        console.log('Match history:', result);
        set({ matchHistory: result, isLoading: false });
      } catch (error) {
        console.error('Error getting match history:', error);
        set({ isLoading: false });
      }
    },

    confirmMatch: async (matchId) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/${matchId}/confirm`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to confirm match');
        }

        const result = await response.json();
        console.log('Match confirmed:', result);
        set({ matchedRide: result, isLoading: false });
        // toast.success("Match confirmed successfully!");
      } catch (error) {
        console.error('Error confirming match:', error);
        // toast.error("Failed to confirm match");
        set({ isLoading: false });
      }
    },

    rejectMatch: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/ride-matching/reject`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to reject match');
        }

        const result = await response.json();
        console.log('Match rejected:', result);
        set({ matchedRide: null, isLoading: false });
        // toast.success("Match rejected");
      } catch (error) {
        console.error('Error rejecting match:', error);
        // toast.error("Failed to reject match");
        set({ isLoading: false });
      }
    },

    deleteMatchHistory: async () => {
      set({ 
        user: "",
        isLoading: false,
        matchedRide: null,
        matchHistory: [],
      });
      console.log('Match history deleted');
    },
  },
}));

export const useRideMatchings = <TResult>(
  selector: SelectorFn<RideMatchingType, TResult>
) => {
  const state = useRideMatching(selector);

  return state;
};