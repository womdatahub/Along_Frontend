import { create } from "zustand";
import type { AddressResult, SelectorFn } from "@/types";

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

export const useRadarMap = create<RadarMapType>()((set) => ({
  ...initialState,
  actions: {
    setAutoCompleteAddress: (autoCompleteAddress: AddressResult) => {
      set({ autoCompleteAddress });
    },
    setToAutoCompleteAddress: (toAutoCompleteAddress: AddressResult) => {
      set({ toAutoCompleteAddress });
    },
  },
}));

export const useRadarMaps = <TResult>(
  selector: SelectorFn<RadarMapType, TResult>
) => {
  const state = useRadarMap(selector);

  return state;
};
