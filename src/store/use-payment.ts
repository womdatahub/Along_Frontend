import { create } from "zustand";
import type {
  RentalCostEstimate,
  RentalPaymentStatus,
  SelectorFn,
  WalletDetails,
} from "@/types";
import { callApi, paymentApiStr, userApiStr } from "@/lib";
import { toast } from "sonner";

type PaymentStoreType = {
  isLoading: boolean;
  rentalPaymentStatus: RentalPaymentStatus | undefined;
  rentalCostEstimate: RentalCostEstimate | undefined;
  walletDetails: WalletDetails | undefined;
  actions: {
    fetchWalletDetails: () => Promise<void>;
    fetchRentalPaymentStatus: (rentalId: string) => Promise<void>;
    calculateRentalCost: (data: {
      vehicleId: string;
      duration: number;
      pickUpLat?: number;
      pickUpLong?: number;
      bookingType?: "SELF_DRIVE" | "WITH_DRIVER";
    }) => Promise<RentalCostEstimate | undefined>;
    clearPaymentState: () => void;
  };
};

const initialState = {
  isLoading: false,
  rentalPaymentStatus: undefined,
  rentalCostEstimate: undefined,
  walletDetails: undefined,
};

export const usePayment = create<PaymentStoreType>()((set) => ({
  ...initialState,
  actions: {
    fetchWalletDetails: async () => {
      set({ isLoading: true });
      const { data, error } = await callApi<WalletDetails>(
        userApiStr("/user/wallet"),
        undefined,
        undefined,
        { skipToast: true },
      );
      if (error) {
        set({ isLoading: false, walletDetails: undefined });
        return;
      }
      set({ isLoading: false, walletDetails: data?.data });
    },
    fetchRentalPaymentStatus: async (rentalId) => {
      if (!rentalId) return;
      set({ isLoading: true });
      const { data, error } = await callApi<RentalPaymentStatus>(
        paymentApiStr(`/status/rental/${rentalId}`),
        undefined,
        undefined,
        { skipToast: true },
      );
      if (error) {
        set({ isLoading: false, rentalPaymentStatus: undefined });
        return;
      }
      set({ isLoading: false, rentalPaymentStatus: data?.data });
    },
    calculateRentalCost: async (payload) => {
      set({ isLoading: true });
      const { data, error } = await callApi<RentalCostEstimate>(
        paymentApiStr("/cost/rental"),
        payload,
        "POST",
        { skipToast: true },
      );
      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return undefined;
      }
      set({ isLoading: false, rentalCostEstimate: data?.data });
      return data?.data;
    },
    clearPaymentState: () => set(initialState),
  },
}));

export const usePayments = <TResult>(
  selector: SelectorFn<PaymentStoreType, TResult>,
) => usePayment(selector);
