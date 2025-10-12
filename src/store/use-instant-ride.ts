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
  isLoading: boolean;
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

export const useRide = create<InstantRideType>()((set) => ({
  ...initialState,

  actions: {
    createSoloRide: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/solo`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            // Add authorization if needed
            // 'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create solo ride');
        }

        const result = await response.json();
        console.log('Solo ride created:', result);
        // toast.success("Solo ride created successfully!");
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error creating solo ride:', error);
        // toast.error("Failed to create solo ride");
        set({ isLoading: false });
      }
    },

    createSharedRide: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/shared`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create shared ride');
        }

        const result = await response.json();
        console.log('Shared ride created:', result);
        // toast.success("Shared ride created successfully!");
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error creating shared ride:', error);
        // toast.error("Failed to create shared ride");
        set({ isLoading: false });
      }
    },

    createRushedRide: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/rushed`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to create rushed ride');
        }

        const result = await response.json();
        console.log('Rushed ride created:', result);
        // toast.success("Rushed ride created successfully!");
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error creating rushed ride:', error);
        // toast.error("Failed to create rushed ride");
        set({ isLoading: false });
      }
    },

    getRide: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/current`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get ride');
        }

        const result = await response.json();
        console.log('Current ride:', result);
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error getting ride:', error);
        set({ isLoading: false });
      }
    },

    updateRide: async (data) => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/update`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to update ride');
        }

        const result = await response.json();
        console.log('Ride updated:', result);
        // toast.success("Ride updated successfully!");
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error updating ride:', error);
        // toast.error("Failed to update ride");
        set({ isLoading: false });
      }
    },

    getAllRides: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/all`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to get all rides');
        }

        const result = await response.json();
        console.log('All rides:', result);
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error getting all rides:', error);
        set({ isLoading: false });
      }
    },

    cancelRide: async () => {
      set({ isLoading: true });
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/instant-ride/cancel`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to cancel ride');
        }

        const result = await response.json();
        console.log('Ride cancelled:', result);
        // toast.success("Ride cancelled successfully!");
        
        set({ isLoading: false });
      } catch (error) {
        console.error('Error cancelling ride:', error);
        // toast.error("Failed to cancel ride");
        set({ isLoading: false });
      }
    },

    deleteRideData: async () => {
      set({ 
        user: "",
        isLoading: false,
      });
      console.log('Ride data deleted');
    },
  },
}));

export const useRides = <TResult>(
  selector: SelectorFn<InstantRideType, TResult>
) => {
  const state = useRide(selector);

  return state;
};