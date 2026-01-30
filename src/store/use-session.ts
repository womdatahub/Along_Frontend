import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type {
  AdminProfile,
  DriverProfile,
  ImageType,
  RiderProfile,
  SelectorFn,
  UserProfile,
} from "@/types";
import { callApi, userApiStr } from "@/lib";
import { toast } from "sonner";

type Session = {
  userRole: string;
  riderProfile: RiderProfile | undefined;
  driverProfile: DriverProfile | undefined;
  adminProfile: AdminProfile | undefined;
  userProfile: UserProfile | undefined;
  isFetchingUserSessionLoading: boolean;
  isLoading: boolean;
  services: string[];
  routeBeforeRedirect: string;
  actions: {
    setIsFetchingUserSessionLoading: (val: boolean) => void;
    setRouteBeforeRedirect: (route: string) => void;
    uploadImages: (data: {
      uploadType: "profile" | "vehicle" | "verification_document";
      imageFile: ImageType["imageFile"];
    }) => Promise<string>;
    setServices: (services: string[]) => void;
    registerUser: (data: {
      email: string;
      password: string;
      mobileNumber: string;
      type: "email" | "phone";
    }) => Promise<boolean>;
    verifyEmail: (data: { email: string; otp: string }) => Promise<boolean>;
    login: (data: { email: string; password: string }) => Promise<string>;
    logOut: () => Promise<void>;
    verifyOtp: () => Promise<void>;
    resendVerificationOTP: (data: { email: string }) => Promise<void>;
    registerDriver: (data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female" | "other";
      firstEmergencyContact: string;
      secondEmergencyContact: string;
    }) => Promise<boolean>;
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
    fetchUserDetails: (
      shouldToast?: boolean,
      shouldReload?: boolean,
    ) => Promise<void>;
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
  userProfile: undefined,
};

export const useSession = create<Session>()(
  devtools((set, get) => ({
    ...initialState,

    actions: {
      setIsFetchingUserSessionLoading: (val) => {
        set({ isFetchingUserSessionLoading: val });
      },
      setRouteBeforeRedirect: (route) => {
        set({ routeBeforeRedirect: route });
      },
      uploadImages: async (d) => {
        if (!d.imageFile) {
          throw new Error("Image file is required");
        }
        const formData = new FormData();
        formData.append("uploadType", d.uploadType);
        formData.append("image", d.imageFile as Blob);

        const { data, error } = await callApi<{ url: string }>(
          userApiStr("/user/upload"),
          formData,
        );

        if (error) {
          toast.error(error.message ?? "Failed to upload image");
          return "";
        }
        if (data) {
          console.log(data, "userApiStr('/user/upload')");
          return data.data.url;
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
          loginData,
        );

        if (error) {
          toast.error(error.message);
          set({ isLoading: false, userRole: "" });
          return "";
        }
        if (data) {
          await get().actions.fetchUserDetails(false);
          set({ isLoading: false, userRole: data.data.userRole });
          // toast.success(data.message);
        }
        return data?.data.userRole as string;
      },
      logOut: async () => {
        set({ isLoading: true });
        const path = userApiStr("/user/logout");

        const { data, error } = await callApi(path, {});

        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
        }
        if (data) {
          toast.success(data.message);
          set({ isLoading: false });
        }
      },
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
          await get().actions.fetchUserDetails();
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
          await get().actions.fetchUserDetails();
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
        set({ isLoading: true });
        const path = userApiStr("/user/driver");

        const { data, error } = await callApi(path, registerDriverData);

        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return false;
        }
        if (data) {
          set({ isLoading: false });
          await get().actions.fetchUserDetails(false, false);

          return true;
        }
        return true;
      }, //POST
      addVerificationDocumentsAndServices: async (
        addVerificationDocumentsAndServicesData,
      ) => {
        set({ isLoading: true });
        const path = userApiStr("/user/documents-services");
        const { data, error } = await callApi(
          path,
          {
            ...addVerificationDocumentsAndServicesData,
            services: get().services,
          },
          "PATCH",
        );

        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return false;
        }
        if (data) {
          await get().actions.fetchUserDetails(false, false);
          toast.success("Documents and services added successfully");
          set({ isLoading: false });
          console.log(data, path);
        }

        return true;
      }, // PATCH
      registerVehicle: async (registerVehicleData) => {
        set({ isLoading: true });
        const path = userApiStr("/user/vehicle");

        const { data, error } = await callApi(
          path,
          registerVehicleData,
          "PATCH",
        );

        if (error) {
          toast.error(error.message);
          set({ isLoading: false });
          return false;
        }
        if (data) {
          await get().actions.fetchUserDetails(false, false);
          toast.success("Vehicle information added successfully");
          set({ isLoading: false });
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
          toast.success(data.message);
          await get().actions.fetchUserDetails(false, false);
        }
        set({ isLoading: false, userRole: "rider" });
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
          "PATCH",
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
          "PATCH",
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
          "PATCH",
        );

        if (error) {
          toast.error(error.message);
          return;
        }
        if (data) {
          console.log(data, path);
        }
      },
      fetchUserDetails: async (shouldToast, shouldReload = true) => {
        set({ ...(shouldReload && { isFetchingUserSessionLoading: true }) });
        const path = userApiStr("/user/profile");

        const { data, error } = await callApi<
          RiderProfile | DriverProfile | AdminProfile | UserProfile
        >(path);

        if (error) {
          set({ userRole: "", isFetchingUserSessionLoading: false });
          if (shouldToast) toast.error(error.message);
          return;
        }

        if (data) {
          if (shouldToast) toast.success(data.message);
          switch (data.data.role) {
            case "admin":
              {
                set({
                  adminProfile: data.data as AdminProfile,
                  userRole: "admin",
                  isFetchingUserSessionLoading: false,
                });
              }
              break;
            case "rider":
              set({
                riderProfile: data.data as RiderProfile,
                userRole: "rider",
                isFetchingUserSessionLoading: false,
              });
              break;
            case "driver":
              set({
                driverProfile: data.data as DriverProfile,
                userRole: "driver",
                isFetchingUserSessionLoading: false,
              });
              break;
            case "user":
              set({
                userProfile: data.data as UserProfile,
                userRole: "user",
                isFetchingUserSessionLoading: false,
              });
              break;
            default:
              set({
                userProfile: undefined,
                driverProfile: undefined,
                adminProfile: undefined,
                riderProfile: undefined,
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
  })),
);

export const useSessions = <TResult>(
  selector: SelectorFn<Session, TResult>,
) => {
  const state = useSession(selector);

  return state;
};
