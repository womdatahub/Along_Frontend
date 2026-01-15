import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

import type { DriverProfile, RiderProfile, SelectorFn } from "@/types";
import { callApi, userApiStr } from "@/lib";
import { toast } from "sonner";
// import { callApi } from "@/lib";

type Session = {
  userRole: string;
  riderProfile: RiderProfile | undefined;
  driverProfile: DriverProfile | undefined;
  adminProfile: RiderProfile | undefined;
  isFetchingUserSessionLoading: boolean;
  isLoading: boolean;
  services: string[];
  routeBeforeRedirect: string;
  actions: {
    setRouteBeforeRedirect: (route: string) => void;
    uploadImages: (data: {
      uploadType: "profile" | "vehicle" | "verification_document";
      imageFile: string | ArrayBuffer | File | null;
    }) => Promise<string>;
    setServices: (services: string[]) => void;
    registerUser: (data: {
      email: string;
      password: string;
      mobileNumber: string;
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
    }) => Promise<boolean>;
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
    }) => Promise<boolean>;
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
    fetchVehicleViaClass: (vehicleClass: string) => Promise<void>;
    fetchVehicleViaDriverID: (driverID: string) => Promise<void>;
    fetchVehicleID: (vehicleID: string) => Promise<void>;
  };
};

const initialState = {
  userRole: "",
  isFetchingUserSessionLoading: true,
  isLoading: false,
  services: [],
  routeBeforeRedirect: "",
  riderProfile: undefined,
  driverProfile: undefined,
  adminProfile: undefined,
};

export const useSession = create<Session>()((set, get) => ({
  ...initialState,

  actions: {
    setRouteBeforeRedirect: (route) => {
      set({ routeBeforeRedirect: route });
    },
    uploadImages: async (d) => {
      if (!d.imageFile) {
        throw new Error("Image file is required");
      }
      const formData = new FormData();
      formData.append("uploadType", d.uploadType);
      if (d.imageFile instanceof ArrayBuffer) {
        formData.append("image", new Blob([d.imageFile]));
      } else {
        formData.append("image", d.imageFile);
      }

      const { data, error } = await callApi(
        userApiStr("/user/upload"), // "/api/v1/user/uploads",
        formData
        // "PATCH"
        // userApiStr("/user/uploads"),
        // {
        //   image: d.imageFile,
        //   uploadType: d.uploadType,
        // },
        // "PATCH"
      );

      if (error) {
        toast.error(error.message ?? "Failed to upload image");
        return "";
      }
      if (data) {
        console.log(data, "userApiStr('/user/upload')");
      }
      return "";
    },

    setServices: (services) => {
      set({ services });
    },
    login: async (loginData) => {
      set({ isLoading: true });
      const path = userApiStr("/user/login");
      const { data, error } = await callApi<{ userRole: string }>(
        path,
        loginData
      );

      if (error) {
        toast.error(error.message);
        set({ isLoading: false, userRole: "" });
        return false;
      }
      if (data) {
        await get().actions.fetchUserDetails();
        set({ isLoading: false, userRole: data.data.userRole });
        // toast.success(data.message);
      }
      return true;
    },
    logOut: async () => {},
    registerUser: async (registerUserData) => {
      // console.log("this ran reisteruser");
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
        {
          ...addVerificationDocumentsAndServicesData,
          services: get().services,
        },
        "PATCH"
      );

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (data) {
        toast.success("Documents and services added successfully");
        console.log(data, path);
      }

      return true;
    }, // PATCH
    registerVehicle: async (registerVehicleData) => {
      const path = userApiStr("/user/documents-services");

      const { data, error } = await callApi(path, registerVehicleData, "PATCH");

      if (error) {
        toast.error(error.message);
        return false;
      }
      if (data) {
        toast.success("Vehicle information added successfully");
        console.log(data, path);
      }
      return true;
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
      const path = userApiStr("/user/driver/profile/create");

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
      set({ isFetchingUserSessionLoading: true });
      const path = userApiStr("/user/profile");

      const { data, error } = await callApi<RiderProfile | DriverProfile>(path);

      if (error) {
        set({ userRole: "", isFetchingUserSessionLoading: false });
        toast.error(error.message);
        return;
      }

      if (data) {
        toast.success(data.message);
        if (data.data.role === "rider") {
          set({
            riderProfile: data.data as RiderProfile,
            userRole: "rider",
            isFetchingUserSessionLoading: false,
          });
        }
        if (data.data.role === "driver") {
          set({
            driverProfile: data.data as DriverProfile,
            userRole: "driver",
            isFetchingUserSessionLoading: false,
          });
        }
      }
    },
    fetchVehicleViaClass: async (vehicleClass) => {
      const path = userApiStr(`/vehicle/class?vehicleClass=${vehicleClass}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchVehicleViaDriverID: async (driverID) => {
      const path = userApiStr(`/vehicle/driver/${driverID}`);

      const { data, error } = await callApi(path);

      if (error) {
        toast.error(error.message);
        return;
      }
      if (data) {
        console.log(data, path);
      }
    },
    fetchVehicleID: async (vehicleID) => {
      const path = userApiStr(`/vehicle/${vehicleID}`);

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
