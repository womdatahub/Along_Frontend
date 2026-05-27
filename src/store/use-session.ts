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
import { clearStoredAuthToken, uploadMediaDirectly, requests } from "@/lib";
import { toast } from "sonner";
import { useRadarMap } from "./use-radar-map";
import { useRental } from "./use-rental";
// import { useRental } from "./use-rental";
// import { useRadarMap } from "./use-radar-map";

type RegisterDriverResponse = {
  userRole: string;
  accessToken?: string;
  stripeAccount: {
    driverId: string;
    accountId: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    accountLink: string;
    linkExpiresAt: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
};
type Session = {
  registeredDriverResponseWithStripeDetails: RegisterDriverResponse | null;
  userRole: string;
  riderProfile: RiderProfile | undefined;
  driverProfile: DriverProfile | undefined;
  adminProfile: AdminProfile | undefined;
  userProfile: UserProfile | undefined;
  isFetchingUserSessionLoading: boolean;
  isLoading: boolean;
  isResendingVerificationOTP: boolean;
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
      type: "email" | "mobile";
    }) => Promise<boolean>;
    verifyEmail: (data: { email: string; otp: string }) => Promise<boolean>;
    login: (data: {
      email?: string;
      mobileNumber?: string;
      password: string;
    }) => Promise<string>;
    logOut: () => Promise<void>;
    verifyOtp: (data?: {
      email?: string;
      mobileNumber?: string;
      otp: string;
    }) => Promise<void>;
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
      services?: string[];
    }) => Promise<boolean>;
    registerVehicle: (data: {
      vehicleMake: string;
      vehicleIdentificationNumber: string;
      vehicleYear: string;
      vehicleModel: string;
      vehicleColor: string;
      vehicleClass?: string;
      rentalModes?: Array<"SELF_DRIVE" | "WITH_DRIVER">;
      vehicleFrontViewImageUri: string;
      vehicleBackViewImageUri: string;
      vehicleSideViewImageUri: string;
      insuranceDocumentUri?: string;
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
      firstName?: string;
      lastName?: string;
      mobileNumber: string;
      gender?: "male" | "female" | "other";
      dateOfBirth?: string;
    }) => Promise<boolean>;
    updateRiderDetails: (data: {
      firstName?: string;
      lastName?: string;
      dateOfBirth: string;
      mobileNumber: string;
      gender?: "male" | "female" | "other";
      profilePictureUri?: string;
    }) => Promise<boolean>;
    submitRiderLicense: (data: {
      licenseNumber: string;
      licenseExpiryDate: string;
      licenseFrontImageUri: string;
      licenseBackImageUri: string;
      licenseSelfieImageUri?: string;
    }) => Promise<boolean>;
    createRideProfile: (data: {
      currentLocation: string;
      longitude: number;
      latitude: number;
      ratePerHour: number;
      luggageCapacity: number;
      passangerCapacity: number;
      allowPets: boolean;
    }) => Promise<void>;
    setDriverAvailability: (data: {
      availableForDriving: boolean;
      latitude?: number;
      longitude?: number;
      address?: string;
    }) => Promise<boolean>;
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
  isResendingVerificationOTP: false,
  services: [],
  routeBeforeRedirect: "",
  riderProfile: undefined,
  driverProfile: undefined,
  adminProfile: undefined,
  userProfile: undefined,
  registeredDriverResponseWithStripeDetails: null,
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
        set({ isLoading: true });
        try {
          if (!d.imageFile) {
            throw new Error("Image file is required");
          }
          return await uploadMediaDirectly(d.imageFile, d.uploadType);
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to upload image",
          );
          return "";
        } finally {
          set({ isLoading: false });
        }
      },

      setServices: (services) => {
        set({ services });
      },
      login: async (loginData) => {
        set({ isLoading: true });
        const { data, error } = await requests.user.login(loginData);

        if (error) {
          set({ isLoading: false, userRole: "" });
          return "";
        }
        if (data) {
          clearStoredAuthToken();
          await get().actions.fetchUserDetails(false);
          set({ isLoading: false, userRole: data.data.userRole });
        }
        return data?.data.userRole as string;
      },
      logOut: async () => {
        set({ isLoading: true });
        const { data, error } = await requests.user.logout();

        if (error) {
          // Clear local state even if server-side logout fails
          set({ isLoading: false });
        }
        if (data) {
          await useRadarMap.persist.clearStorage();
          await useRental.persist.clearStorage();
          clearStoredAuthToken();
          set({
            ...initialState,
            isFetchingUserSessionLoading: false,
          });
        }
      },
      registerUser: async (registerUserData) => {
        set({ isLoading: true });
        const { data, error } = await requests.user.register(registerUserData);

        if (error) {
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
        const { data, error } =
          await requests.user.verifyEmail(verifyEmailData);

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          await get().actions.fetchUserDetails();
          toast.success(data.message ?? "OTP verified successfully");
        }
        set({ isLoading: false });
        return true;
      },
      verifyOtp: async (verifyOtpData) => {
        if (!verifyOtpData) return;
        const { data, error } =
          await requests.user.verifyResetOtp(verifyOtpData);

        if (error) return;
        if (data) {
          await get().actions.fetchUserDetails();
        }
      },
      resendVerificationOTP: async (resendVerificationOTPData) => {
        set({ isResendingVerificationOTP: true });
        const { data, error } = await requests.user.resendVerificationOtp(
          resendVerificationOTPData,
        );

        if (error) {
          set({ isResendingVerificationOTP: false });
          return;
        }
        if (data) {
          toast.success(data.message);
          set({ isResendingVerificationOTP: false });
        }
      },
      registerDriver: async (registerDriverData) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.user.registerDriver(registerDriverData);

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          clearStoredAuthToken();
          set({
            isLoading: false,
            registeredDriverResponseWithStripeDetails: data.data,
          });
          await get().actions.fetchUserDetails(false, false);
          return true;
        }
        return true;
      },
      addVerificationDocumentsAndServices: async (
        addVerificationDocumentsAndServicesData,
      ) => {
        set({ isLoading: true });
        const { data, error } = await requests.user.addDocumentsAndServices({
          ...addVerificationDocumentsAndServicesData,
          services: addVerificationDocumentsAndServicesData.services ??
            get().services ?? ["rental"],
        });

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          await get().actions.fetchUserDetails(false, false);
          toast.success("Documents and services added successfully");
          set({ isLoading: false });
        }

        return true;
      },
      registerVehicle: async (registerVehicleData) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.user.registerVehicle(registerVehicleData);

        if (error) {
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
        const { data, error } =
          await requests.user.registerRider(registerRiderData);

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          clearStoredAuthToken();
          toast.success(data.message);
          await get().actions.fetchUserDetails(false, false);
        }
        set({ isLoading: false, userRole: "rider" });
        return true;
      },
      registerBankAccount: async (registerBankAccountData) => {
        const { data, error } = await requests.user.registerBankAccount(
          registerBankAccountData,
        );

        if (error) return;
        if (data) {
          toast.success(data.message ?? "Bank details saved");
        }
      },
      updateDriverDetails: async (updateDriverDetailsData) => {
        set({ isLoading: true });
        const { data, error } = await requests.user.updateDriver(
          updateDriverDetailsData,
        );

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          toast.success(data.message ?? "Driver details updated");
          await get().actions.fetchUserDetails(false, false);
        }
        set({ isLoading: false });
        return true;
      },
      updateRiderDetails: async (updateRiderDetailsData) => {
        set({ isLoading: true });
        const { data, error } = await requests.user.updateRider(
          updateRiderDetailsData,
        );

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          toast.success(data.message ?? "Rider details updated");
          await get().actions.fetchUserDetails(false, false);
        }
        set({ isLoading: false });
        return true;
      },
      submitRiderLicense: async (licenseData) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.user.submitRiderLicense(licenseData);

        if (error) {
          set({ isLoading: false });
          return false;
        }
        if (data) {
          toast.success(data.message ?? "License submitted for review");
          await get().actions.fetchUserDetails(false, false);
        }
        set({ isLoading: false });
        return true;
      },
      createRideProfile: async (createRideProfileData) => {
        const { data, error } = await requests.user.createRideProfile(
          createRideProfileData,
        );

        if (error) return;
        if (data) {
          toast.success(data.message);
        }
      },
      setDriverAvailability: async (availabilityData) => {
        set({ isLoading: true });
        const { data, error } =
          await requests.user.setDriverAvailability(availabilityData);

        if (error) {
          set({ isLoading: false });
          return false;
        }

        toast.success(data?.message ?? "Availability updated");
        await get().actions.fetchUserDetails(false, false);
        set({ isLoading: false });
        return true;
      },
      fetchUserDetails: async (shouldToast, shouldReload = true) => {
        set({ ...(shouldReload && { isFetchingUserSessionLoading: true }) });
        const { data, error } = await requests.user.getProfile();

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
        const { data, error } =
          await requests.user.getDriverByClass(vehicleClass);
        if (error) return;
        void data;
      },
      fetchVehicleViaDriverID: async (driverID) => {
        const { data, error } =
          await requests.user.getVehicleByDriverId(driverID);
        if (error) return;
        void data;
      },
      fetchVehicleID: async (vehicleID) => {
        const { data, error } = await requests.user.getVehicleById(vehicleID);
        if (error) return;
        void data;
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
