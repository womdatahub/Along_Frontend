import { create } from "zustand";
import type { AddressResult, SelectorFn } from "@/types";
import { devtools, persist } from "zustand/middleware";

type RadarMapType = {
  autoCompleteAddress: AddressResult | undefined;
  toAutoCompleteAddress: AddressResult | undefined;
  actions: {
    setAutoCompleteAddress: (address: AddressResult) => void;
    setToAutoCompleteAddress: (address: AddressResult) => void;
  };
};

const initialState = {
  autoCompleteAddress: undefined,
  toAutoCompleteAddress: undefined,
};

export const useRadarMap = create<RadarMapType>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        actions: {
          setAutoCompleteAddress: (autoCompleteAddress: AddressResult) => {
            set({ autoCompleteAddress });
          },
          setToAutoCompleteAddress: (toAutoCompleteAddress: AddressResult) => {
            set({ toAutoCompleteAddress });
          },
        },
      }),
      {
        name: "radar-map-store",
        partialize: (state) => ({
          autoCompleteAddress: state.autoCompleteAddress,
          toAutoCompleteAddress: state.toAutoCompleteAddress,
        }),
      },
    ),
  ),
);

export const useRadarMaps = <TResult>(
  selector: SelectorFn<RadarMapType, TResult>,
) => {
  const state = useRadarMap(selector);

  return state;
};
