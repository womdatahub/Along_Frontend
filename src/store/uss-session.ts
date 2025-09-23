import { create } from "zustand";

import type { SelectorFn } from "@/types";
// import { callApi } from "@/lib";

type Session = {
  user: string;
};

const initialState = {
  user: "",
};

export const useSession = create<Session>()(() => ({
  ...initialState,

  actions: {},
}));

export const useSessions = <TResult>(
  selector: SelectorFn<Session, TResult>
) => {
  const state = useSession(selector);

  return state;
};
