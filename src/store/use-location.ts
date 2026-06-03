import { create } from "zustand";
import type { SelectorFn } from "@/types";
import { callApi, locationApiStr } from "@/lib";

type LocationMetric = {
  distance?: number;
  eta?: number;
  unit?: string;
  duration?: number;
};

type LocationStoreType = {
  isLoading: boolean;
  distance: LocationMetric | undefined;
  eta: LocationMetric | undefined;
  actions: {
    calculateDistance: (data: {
      pickUpLat: number;
      pickUpLong: number;
      dropOffLat: number;
      dropOffLong: number;
    }) => Promise<void>;
    estimateEta: (data: {
      pickUpLat: number;
      pickUpLong: number;
      dropOffLat: number;
      dropOffLong: number;
    }) => Promise<void>;
    clearLocationMetrics: () => void;
  };
};

export const useLocation = create<LocationStoreType>()((set) => ({
  isLoading: false,
  distance: undefined,
  eta: undefined,
  actions: {
    calculateDistance: async (payload) => {
      set({ isLoading: true });
      const { data, error } = await callApi<LocationMetric>(
        locationApiStr("/distance"),
        payload,
        "POST",
        { skipToast: true },
      );
      if (error) {
        set({ isLoading: false });
        return;
      }
      set({ isLoading: false, distance: data?.data });
    },
    estimateEta: async (payload) => {
      set({ isLoading: true });
      const { data, error } = await callApi<LocationMetric>(
        locationApiStr("/eta"),
        payload,
        "POST",
        { skipToast: true },
      );
      if (error) {
        set({ isLoading: false });
        return;
      }
      set({ isLoading: false, eta: data?.data });
    },
    clearLocationMetrics: () => set({ distance: undefined, eta: undefined }),
  },
}));

export const useLocations = <TResult>(
  selector: SelectorFn<LocationStoreType, TResult>,
) => useLocation(selector);
