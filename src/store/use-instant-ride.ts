import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { callApi, instantApiStr } from "@/lib";
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

export const useInstantRide = create<InstantRideType>()(() => ({
  ...initialState,

  actions: {
    createSoloRide: async (soloRideData) => {
      const path = instantApiStr("");

      const { data, error } = await callApi(path, soloRideData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    createSharedRide: async (sharedRideData) => {
      const path = instantApiStr("");

      const { data, error } = await callApi(path, sharedRideData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    createRushedRide: async (rushedRideData) => {
      const path = instantApiStr("");

      const { data, error } = await callApi(path, rushedRideData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    getRide: async (rideID) => {
      const path = instantApiStr(`/${rideID}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    updateRide: async (updateRideData, rideID) => {
      const path = instantApiStr(`/${rideID}`);

      const { data, error } = await callApi(path, updateRideData, "PATCH");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },

    getAllRides: async (status) => {
      const path = instantApiStr(`?status=${status}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    cancelRide: async (rideID) => {
      const path = instantApiStr(`/${rideID}`);
      const { data, error } = await callApi(path, {}, "DELETE");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    deleteRideData: async (rideID) => {
      const path = instantApiStr(`/${rideID}/delete`);
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

export const useInstantRides = <TResult>(
  selector: SelectorFn<InstantRideType, TResult>
) => {
  const state = useInstantRide(selector);

  return state;
};
