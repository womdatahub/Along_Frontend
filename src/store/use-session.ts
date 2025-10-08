import { create } from "zustand";

import type { SelectorFn } from "@/types";
import { callApi, userApiStr } from "@/lib";
import { toast } from "sonner";
// import { callApi } from "@/lib";

type Session = {
  user: string;
  isLoading: boolean;
  actions: {
    registerUser: (data: {
      email: string;
      password: string;
      type: "email" | "phone";
    }) => Promise<boolean>;
    verifyEmail: (data: { email: string; otp: string }) => Promise<boolean>;
    login: (data: { email: string; password: string }) => Promise<boolean>;
    logOut: () => Promise<void>;
    verifyOtp: () => Promise<void>;
    resendVerificationOTP: (data: { email: string }) => Promise<void>;
    registerDriver: (data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female";
      firstEmergencyContact: string;
      secondEmergencyContact: string;
    }) => Promise<void>;
    addVerificationDocumentsAndServices: (data: {
      driverSocialSecurityNumber: string;
      driverProfilePictureUri: string;
      driverLincenseFrontViewUri: string;
      driverLincenseBackViewUri: string;
      advancedVerificationUri: string;
      services: string[];
    }) => Promise<void>;
    registerVehicle: (data: {
      vehicleMake: string;
      vehicleIdentificationNumber: string;
      vehicleYear: string;
      vehicleModel: string;
      vehicleColor: string;
      vehicleFrontViewImageUri: string;
      vehicleBackViewImageUri: string;
      vehicleSideViewImageUri: string;
      insuranceDocumentUri: string;
    }) => Promise<void>;
    registerRider: (data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female";
      mobileNumber: string;
    }) => Promise<boolean>;
    registerBankAccount: (data: {
      bankName: string;
      routingNumber: string;
      accountNumber: string;
    }) => Promise<void>;
    updateDriverDetails: (data: {
      firstname: string;
      lastname: string;
      mobileNumber: string;
      gender: "male" | "female";
    }) => Promise<void>;
    updateRiderDetails: (data: {
      firstname: string;
      lastname: string;
      dateOfBirth: string;
      gender: "male" | "female";
      profilePicture: string;
    }) => Promise<void>;
    createRideProfile: (data: {
      currentLocation: string;
      longitude: number;
      latitude: number;
      ratePerHour: number;
      luggageCapacity: number;
      passangerCapacity: number;
      allowPets: boolean;
    }) => Promise<void>;
    fetchUserDetails: () => Promise<void>;
    fetchVehicleViaClass: () => Promise<void>;
    fetchVehicleViaDriverID: () => Promise<void>;
    fetchVehicleID: () => Promise<void>;
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useSession = create<Session>()((set) => ({
  ...initialState,

  actions: {
    login: async (loginData) => {
      set({ isLoading: true });
      const path = userApiStr("/user/login");
      const { data, error } = await callApi(path, loginData);

      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return false;
      }
      if (data) {
        console.log(data, path);
        toast.success(data.message);
      }
      set({ isLoading: false });
      return true;
    },
    logOut: async () => {},
    registerUser: async (registerUserData) => {
      set({ isLoading: true });
      const path = userApiStr("/user/register");

      const { data, error } = await callApi(path, registerUserData);

      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return false;
      }
      if (data) {
        toast.success(data.message);
      }

      set({ isLoading: false });
      return true;
    },
    verifyEmail: async (verifyEmailData) => {
      set({ isLoading: true });
      const path = userApiStr("/user/verify-email");

      const { data, error } = await callApi(path, verifyEmailData, "PATCH");

      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return false;
      }
      if (data) {
        toast.success(data.message);
        console.log(data, path);
      }
      set({ isLoading: false });
      return true;
    },
    verifyOtp: async () => {
      const path = userApiStr("/user/verify-otp");

      const { data, error } = await callApi(path, {});

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    resendVerificationOTP: async (resendVerificationOTPData) => {
      const path = userApiStr("/user/resend-verification-otp");

      const { data, error } = await callApi(path, resendVerificationOTPData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        toast.success(data.message);
        console.log(data, path);
      }
    },
    registerDriver: async (registerDriverData) => {
      const path = userApiStr("/user/driver");

      const { data, error } = await callApi(path, registerDriverData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    }, //POST
    addVerificationDocumentsAndServices: async (
      addVerificationDocumentsAndServicesData
    ) => {
      const path = userApiStr("/user/documents-services");

      const { data, error } = await callApi(
        path,
        addVerificationDocumentsAndServicesData,
        "PATCH"
      );

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    }, // PATCH
    registerVehicle: async (registerVehicleData) => {
      const path = userApiStr("/user/documents-services");

      const { data, error } = await callApi(path, registerVehicleData, "PATCH");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    registerRider: async (registerRiderData) => {
      set({ isLoading: true });
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(path, registerRiderData);

      if (error) {
        toast.error(error.message);
        set({ isLoading: false });
        return false;
      }
      if (data) {
        console.log(data, path);
        toast.success(data.message);
      }
      set({ isLoading: false });
      return true;
    },
    registerBankAccount: async (registerBankAccountData) => {
      const path = "/user/api/v1/user/bank-details";
      const { data, error } = await callApi(path, registerBankAccountData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    updateDriverDetails: async (updateDriverDetailsData) => {
      const path = userApiStr("/user/driver");

      const { data, error } = await callApi(
        path,
        updateDriverDetailsData,
        "PATCH"
      );

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    updateRiderDetails: async (updateRiderDetailsData) => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(
        path,
        updateRiderDetailsData,
        "PATCH"
      );

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    createRideProfile: async (createRideProfileData) => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(
        path,
        createRideProfileData,
        "PATCH"
      );

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchUserDetails: async () => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchVehicleViaClass: async () => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchVehicleViaDriverID: async () => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchVehicleID: async () => {
      const path = userApiStr("/user/rider");

      const { data, error } = await callApi(path);

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

export const useSessions = <TResult>(
  selector: SelectorFn<Session, TResult>
) => {
  const state = useSession(selector);

  return state;
};
