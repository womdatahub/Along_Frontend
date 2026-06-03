import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { comingSoonMessage } from "@/lib";
import { toast } from "sonner";

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
  class: string;
};

type InstantRideType = {
  user: string;
  isLoading: boolean;
  actions: {
    createSoloRide: (data: CreateRideBase) => Promise<void>;
    createSharedRide: (data: Omit<CreateRideBase, "class">) => Promise<void>;
    createRushedRide: (data: Omit<CreateRideBase, "class">) => Promise<void>;
    getRide: (rideID: string) => Promise<void>;
    updateRide: (
      data: {
        vehicleClass: string;
        initialCost: number;
      },
      rideID: string
    ) => Promise<void>;
    getAllRides: (status: string) => Promise<void>;
    cancelRide: (rideID: string) => Promise<void>;
    deleteRideData: (rideID: string) => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

const showRideComingSoon = async (..._args: unknown[]) => {
  void _args;
  toast.info(comingSoonMessage);
};

export const useInstantRide = create<InstantRideType>()(() => ({
  ...initialState,
  actions: {
    createSoloRide: showRideComingSoon,
    createSharedRide: showRideComingSoon,
    createRushedRide: showRideComingSoon,
    getRide: showRideComingSoon,
    updateRide: showRideComingSoon,
    getAllRides: showRideComingSoon,
    cancelRide: showRideComingSoon,
    deleteRideData: showRideComingSoon,
  },
}));

export const useInstantRides = <TResult>(
  selector: SelectorFn<InstantRideType, TResult>
) => {
  const state = useInstantRide(selector);

  return state;
};
