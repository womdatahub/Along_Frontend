import { create } from "zustand";

import type { SelectorFn } from "@/types";
import { callApi } from "@/lib";
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
    }) => Promise<void>;
    verifyEmail: (data: { email: string; otp: string }) => Promise<void>;
    login: (data: { email: string; password: string }) => Promise<void>;
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
    }) => Promise<void>;
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
  };
};

const initialState = {
  user: "",
  isLoading: false,
};

export const useSession = create<Session>()(() => ({
  ...initialState,

  actions: {
    login: async (loginData) => {
      const path = "/user/login";
      const { data, error } = await callApi(path, loginData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    logOut: async () => {},
    registerUser: async (registerUserData) => {
      const path = "/user/register";
      const { data, error } = await callApi(path, registerUserData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    verifyEmail: async (verifyEmailData) => {
      const path = "/user/verify-email";
      const { data, error } = await callApi(path, verifyEmailData, "PATCH");

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    verifyOtp: async () => {
      const path = "";
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
      const path = "/user/resend-verification-otp";
      const { data, error } = await callApi(path, resendVerificationOTPData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    registerDriver: async (registerDriverData) => {
      const path = "/user/driver";
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
      const path = "/user/documents-services";
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
      const path = "/user/documents-services";
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
      const path = "/user/rider";
      const { data, error } = await callApi(path, registerRiderData);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    registerBankAccount: async (registerBankAccountData) => {
      const path = "/user/bank-details";
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
      const path = "/user/driver";
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
      const path = "/user/rider";
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
  },
}));

export const useSessions = <TResult>(
  selector: SelectorFn<Session, TResult>
) => {
  const state = useSession(selector);

  return state;
};
