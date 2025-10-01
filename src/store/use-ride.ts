import { create } from "zustand";

import type { SelectorFn } from "@/types";
// import { apiStr, callApi, USER } from "@/lib";
// import { toast } from "sonner";

type UseRideType = {
  user: string;
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useRide = create<UseRideType>()(() => ({
  ...initialState,

  actions: {},
}));

export const useRides = <TResult>(
  selector: SelectorFn<UseRideType, TResult>
) => {
  const state = useRide(selector);

  return state;
};
