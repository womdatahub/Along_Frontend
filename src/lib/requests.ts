import { callApi } from "./call-api";
import type {
  AdminProfile,
  AdminsType,
  AllDriversAccount,
  AllRiderAccount,
  DriverProfile,
  Endpoint,
  EndpointPermission,
  PaymentRecord,
  PendingKycType,
  PromoVoucherType,
  RiderProfile,
  RolePermission,
  SuspendedDriver,
  UserProfile,
  WalletDetails,
} from "@/types";
import type { ApiResponse } from "@/types";
import type { ApiError } from "./call-api";
import type { TCreateNewAdminSchema, TMarketPlaceSchema } from "./schemas";

type R<T> = Promise<{ data?: ApiResponse<T>; error?: ApiError }>;

//Base paths (gateway prefix + service api version)
const BASE_USER = "/user/api/v1";
const BASE_ADMIN = "/admin/api/v1";
const BASE_RENTAL = "/rental/api/v1";
const BASE_PAY = "/payment/api/v1";
const BASE_NOTIFY = "/notify/api/v1";
const BASE_LOC = "/location/api/v1";
const BASE_TRIP = "/trip-history/api/v1";
const BASE_COMM = "/communication/api/v1";

//Shared helper
const qs = (params?: Record<string, string | number | undefined>) => {
  if (!params) return "";
  const p = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => [k, String(v)]),
  );
  const s = p.toString();
  return s ? `?${s}` : "";
};

//Domain types
type LoginData = { email?: string; mobileNumber?: string; password: string };
type LoginResponse = {
  userRole: string;
  accessToken?: string;
  refreshToken?: string;
};

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

//requests
export const requests = {
  // USER SERVICE/user/api/v1/...

  user: {
    // Auth
    login: (data: LoginData): R<LoginResponse> =>
      callApi(`${BASE_USER}/user/login`, data as Record<string, unknown>),

    logout: (): R<unknown> => callApi(`${BASE_USER}/user/logout`, {}),

    register: (data: {
      email: string;
      password: string;
      mobileNumber: string;
      type: "email" | "mobile";
    }): R<unknown> =>
      callApi(`${BASE_USER}/user/register`, data as Record<string, unknown>),

    verifyEmail: (data: { email: string; otp: string }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/verify-email`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    verifyResetOtp: (data: {
      email?: string;
      mobileNumber?: string;
      otp: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/verify-reset-otp`,
        data as Record<string, unknown>,
      ),

    resendVerificationOtp: (data: { email: string }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/resend-verification-otp`,
        data as Record<string, unknown>,
      ),

    changePassword: (data: {
      oldPassword: string;
      newPassword: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/change-password`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    requestPasswordReset: (data: {
      email?: string;
      mobileNumber?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/request-reset-password`,
        data as Record<string, unknown>,
      ),

    resetPassword: (data: {
      email?: string;
      mobileNumber?: string;
      resetToken: string;
      newPassword: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/reset-password`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    googleSignin: (data: { googleToken: string }): R<LoginResponse> =>
      callApi(
        `${BASE_USER}/user/google-signin`,
        data as Record<string, unknown>,
      ),

    updatePushToken: (data: { pushToken: string }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/push-token`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    // Profile
    getProfile: (): R<
      RiderProfile | DriverProfile | AdminProfile | UserProfile
    > => callApi(`${BASE_USER}/user/profile`),

    getUserFullProfile: (userId: string): R<unknown> =>
      callApi(`${BASE_USER}/user/profile/${userId}`),

    // Wallet
    getWallet: (): R<WalletDetails> => callApi(`${BASE_USER}/user/wallet`),

    // Upload
    signUploadRequest: (data: {
      filename: string;
      contentType: string;
    }): R<{ uploadUrl: string; fileUrl: string }> =>
      callApi(`${BASE_USER}/user/upload`, data as Record<string, unknown>),

    // Driver
    registerDriver: (data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female" | "other";
      firstEmergencyContact: string;
      secondEmergencyContact: string;
    }): R<RegisterDriverResponse> =>
      callApi(`${BASE_USER}/user/driver`, data as Record<string, unknown>),

    updateDriver: (data: {
      firstName?: string;
      lastName?: string;
      mobileNumber: string;
      gender?: "male" | "female" | "other";
      dateOfBirth?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/driver`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    getDriverByDriverId: (driverId: string): R<DriverProfile> =>
      callApi(`${BASE_USER}/user/driver/${driverId}`),

    addDocumentsAndServices: (data: {
      driverSocialSecurityNumber: string;
      profilePictureUri?: string;
      driverLincenseFrontViewUri: string;
      driverLincenseBackViewUri: string;
      advancedVerificationUri: string;
      licenseNumber?: string;
      licenseExpiryDate?: string;
      services?: string[];
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/documents-services`,
        data as Record<string, unknown>,
        "PATCH",
      ),

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
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/vehicle`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    registerBankAccount: (data: {
      bankName: string;
      routingNumber: string;
      accountNumber: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/driver/bank-details`,
        data as Record<string, unknown>,
      ),

    createRideProfile: (data: {
      currentLocation: string;
      longitude: number;
      latitude: number;
      ratePerHour: number;
      luggageCapacity: number;
      allowPets: boolean;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/driver/profile/create`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    setDriverAvailability: (data: {
      availableForDriving: boolean;
      latitude?: number;
      longitude?: number;
      address?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/driver/availability`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    // Rider
    registerRider: (data: {
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: "male" | "female";
      mobileNumber: string;
    }): R<{ accessToken?: string }> =>
      callApi(`${BASE_USER}/user/rider`, data as Record<string, unknown>),

    updateRider: (data: {
      firstName?: string;
      lastName?: string;
      dateOfBirth: string;
      mobileNumber: string;
      gender?: "male" | "female" | "other";
      profilePictureUri?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/rider`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    getRiderDetails: (riderId: string): R<RiderProfile> =>
      callApi(`${BASE_USER}/user/rider/${riderId}`),

    submitRiderLicense: (data: {
      licenseNumber: string;
      licenseExpiryDate: string;
      licenseFrontImageUri: string;
      licenseBackImageUri: string;
      licenseSelfieImageUri?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_USER}/user/rider/license`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    // Vehicle
    getVehiclesByClass: (vehicleClass: string): R<unknown> =>
      callApi(`${BASE_USER}/vehicle/class?vehicleClass=${vehicleClass}`),

    getVehicleById: (vehicleId: string): R<unknown> =>
      callApi(`${BASE_USER}/vehicle/${vehicleId}`),

    getVehicleByDriverId: (driverId: string): R<unknown> =>
      callApi(`${BASE_USER}/vehicle/driver/${driverId}`),

    updateVehicle: (
      vehicleId: string,
      data: Record<string, unknown>,
    ): R<unknown> =>
      callApi(`${BASE_USER}/vehicle/${vehicleId}`, data, "PATCH"),

    // User-service driver/rider list endpoints (verifyToken — not admin-only)
    getAllDrivers: (): R<AllDriversAccount[]> =>
      callApi(`${BASE_USER}/user/drivers`),

    getAllRiders: (): R<AllRiderAccount[]> =>
      callApi(`${BASE_USER}/user/riders`),
  },

  // ADMIN SERVICE/admin/api/v1/...
  admin: {
    //Operations
    getMetrics: (): R<unknown> => callApi(`${BASE_ADMIN}/operations/metrics`),

    getActiveRides: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/rides/active`),

    getPendingRequests: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/rides/pending`),

    getScheduledTrips: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/rides/scheduled`),

    getActiveRentals: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/rentals/active`),

    getDriverAvailability: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/drivers/availability`),

    getRideRoutePlayback: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/rides/playback`),

    //SOS
    getSOSAlerts: (): R<unknown> => callApi(`${BASE_ADMIN}/sos/alerts`),

    resolveSOSAlert: (data: {
      alertId: string;
      resolution: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/sos/alerts/resolve`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    //Users (drivers & riders)
    getAllDrivers: (): R<AllDriversAccount[]> =>
      callApi(`${BASE_ADMIN}/users/drivers`),

    getSuspendedDrivers: (): R<SuspendedDriver[]> =>
      callApi(`${BASE_ADMIN}/users/drivers/suspended`),

    getAllRiders: (): R<AllRiderAccount[]> =>
      callApi(`${BASE_ADMIN}/users/riders`),

    getSuspendedRiders: (): R<AllRiderAccount[]> =>
      callApi(`${BASE_ADMIN}/users/riders/suspended`),

    //Compliance
    getPendingKyc: (): R<PendingKycType> =>
      callApi(`${BASE_ADMIN}/compliance/kyc/pending`),

    /**
     * Process driver KYC/onboarding approval.
     * On APPROVE, admin confirms/corrects the licence expiry date originally
     * entered by the driver during onboarding if not correct.
     */
    processDriverKyc: (data: {
      driverId: string;
      action: "APPROVE" | "REJECT" | "REQUEST_RESUBMISSION";
      notes?: string;
      reason?: string;
      documentsRequired?: string[];
      /** Required when action === "APPROVE" — sets the canonical licence expiry. */
      licenseExpiryDate?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/drivers/approval`,
        data as Record<string, unknown>,
      ),

    /** Process rider KYC */
    processRiderKyc: (data: {
      riderId: string;
      action: "APPROVE" | "REJECT";
      notes?: string;
      reason?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/riders/kyc`,
        data as Record<string, unknown>,
      ),

    /**
     * Process rider driving licence.
     * On APPROVE, admin must confirm/correct the expiry date originally entered
     * by the rider so the licence's validity window is authoritative.
     */
    processRiderLicense: (data: {
      riderId: string;
      action: "APPROVE" | "REJECT";
      notes?: string;
      reason?: string;
      /** Required when action === "APPROVE" — sets the canonical licence expiry. */
      licenseExpiryDate?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/riders/license`,
        data as Record<string, unknown>,
      ),

    /** Approve / reject / suspend a vehicle */
    processVehicleVerification: (data: {
      vehicleId: string;
      action: "APPROVE" | "REJECT" | "SUSPEND";
      notes?: string;
      reason?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/vehicles/verification`,
        data as Record<string, unknown>,
      ),

    suspendUser: (data: {
      userId: string;
      reason: string;
      suspensionType: "TEMPORARY" | "PERMANENT";
      suspensionDuration?: number;
      notes?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/users/suspend`,
        data as Record<string, unknown>,
      ),

    reactivateUser: (data: {
      userId: string;
      reason?: string;
      notes?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/compliance/users/reactivate`,
        data as Record<string, unknown>,
      ),

    //Admins
    getActiveAdmins: (limit = 50, offset = 0): R<AdminsType[]> =>
      callApi(
        `${BASE_ADMIN}/admins?status=active&limit=${limit}&offset=${offset}`,
      ),

    getSuspendedAdmins: (limit = 50, offset = 0): R<AdminsType[]> =>
      callApi(
        `${BASE_ADMIN}/admins?status=suspended&limit=${limit}&offset=${offset}`,
      ),

    createAdmin: (data: TCreateNewAdminSchema): R<unknown> =>
      callApi(`${BASE_ADMIN}/admins`, data as Record<string, unknown>),

    suspendAdmin: (data: { adminId: string; reason: string }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/admins/suspend`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    restoreAdmin: (data: { adminId: string }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/admins/restore`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    updateAdminRole: (data: { adminId: string; role: string }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/admins/role`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    //Cost Settings
    /** GET current ride cost settings */
    getRideCostSettings: (): R<TMarketPlaceSchema[]> =>
      callApi(`${BASE_ADMIN}/cost-settings/ride`),

    /** POST create new ride cost settings (SUPER_ADMIN only) */
    createRideCostSettings: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_ADMIN}/cost-settings/ride`, data),

    /** PATCH update ride cost settings */
    updateRideCostSettings: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_ADMIN}/cost-settings/ride`, data, "PATCH"),

    /** GET rental cost settings */
    getRentalCostSettings: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/cost-settings/rental`),

    /** PATCH update rental cost settings */
    updateRentalCostSettings: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_ADMIN}/cost-settings/rental`, data, "PATCH"),

    //Vouchers
    getVouchers: (params?: {
      status?: "ACTIVE" | "DISABLED" | "EXPIRED";
      applicableFor?: "ride" | "rental" | "both";
      limit?: number;
      offset?: number;
    }): R<PromoVoucherType[]> =>
      callApi(`${BASE_ADMIN}/vouchers${qs(params as Record<string, string>)}`),

    createVoucher: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_ADMIN}/vouchers`, data),

    updateVoucher: (data: {
      voucherId: string;
      status?: "ACTIVE" | "DISABLED" | "EXPIRED";
      discountType?: "PERCENTAGE" | "FIXED";
      discountValue?: number;
      maxDiscountAmount?: number;
      minOrderAmount?: number;
      maxUsagePerUser?: number;
      maxTotalUsage?: number;
      validFrom?: string;
      validUntil?: string;
      description?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/vouchers`,
        data as Record<string, unknown>,
        "PATCH",
      ),

    getVoucherUsage: (
      voucherId: string,
      params?: {
        limit?: number;
        offset?: number;
      },
    ): R<unknown> => {
      const q: Record<string, string> = { voucherId };
      if (params?.limit != null) q.limit = String(params.limit);
      if (params?.offset != null) q.offset = String(params.offset);
      return callApi(`${BASE_ADMIN}/vouchers/usage${qs(q)}`);
    },

    getAnalytics: (): R<unknown> =>
      callApi(`${BASE_ADMIN}/operations/analytics`),

    //Activity / Audit Logs
    getAuditLogs: (params?: {
      limit?: number;
      offset?: number;
      pageSize?: number;
      page?: number;
      action?: string;
      adminId?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/activities/recent${qs(params as Record<string, string>)}`,
      ),

    //Disputes
    getDisputes: (params?: {
      limit?: number;
      offset?: number;
      pageSize?: number;
      page?: number;
      status?: string;
    }): R<unknown> =>
      callApi(`${BASE_ADMIN}/disputes${qs(params as Record<string, string>)}`),

    resolveDispute: (data: {
      disputeId: string;
      resolution: string;
      outcome: "REFUND" | "NO_REFUND" | "PARTIAL_REFUND";
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/disputes/resolve`,
        data as Record<string, unknown>,
      ),
    getPaymentRecords: (params?: {
      limit?: number;
      offset?: number;
      pageSize?: number;
      page?: number;
      status?: string;
      paymentFor?: string;
      paymentType?: string;
    }): R<PaymentRecord[]> =>
      callApi(`${BASE_ADMIN}/cost-settings/deposits${qs(params as Record<string, string>)}`),

    getDriverById: (driverId: string): R<DriverProfile> =>
      callApi(`${BASE_ADMIN}/users/drivers/details/?driverId=${driverId}`),

    getRiderById: (riderId: string): R<RiderProfile> =>
      callApi(`${BASE_ADMIN}/users/riders/details/?riderId=${riderId}`),
  },

  // PERMISSIONS/admin/api/v1/permissions/...
  permissions: {
    getAllEndpoints: (): R<Endpoint[]> =>
      callApi(`${BASE_ADMIN}/permissions/endpoints`),

    getEndpointPermissions: (endpointId: string): R<EndpointPermission> =>
      callApi(
        `${BASE_ADMIN}/permissions/endpoints/permissions?endpointId=${endpointId}`,
      ),

    getAllRolePermissions: (): R<RolePermission> =>
      callApi(`${BASE_ADMIN}/permissions/roles`),

    getRolePermissions: (role: string): R<{ endpoints: Endpoint[] }> =>
      callApi(`${BASE_ADMIN}/permissions/roles/permissions?role=${role}`),

    grantRolePermission: (data: {
      role: string;
      endpointIds: string[];
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/permissions/roles/grant`,
        data as Record<string, unknown>,
      ),

    revokeRolePermission: (data: {
      role: string;
      endpointIds: string[];
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/permissions/roles/revoke`,
        data as Record<string, unknown>,
      ),

    getAdminPermissions: (
      adminId: string,
    ): R<{ rolePermissions: Endpoint[] }> =>
      callApi(`${BASE_ADMIN}/permissions/users/permissions?adminId=${adminId}`),

    getAdminDirectPermissions: (
      adminId: string,
    ): R<{ endpoints: Endpoint[] }> =>
      callApi(
        `${BASE_ADMIN}/permissions/users/direct-permissions?adminId=${adminId}`,
      ),

    grantAdminPermission: (data: {
      adminId: string;
      endpointIds: string[];
      expiresAt?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/permissions/users/grant`,
        data as Record<string, unknown>,
      ),

    revokeAdminPermission: (data: {
      adminId: string;
      endpointIds: string[];
    }): R<unknown> =>
      callApi(
        `${BASE_ADMIN}/permissions/users/revoke`,
        data as Record<string, unknown>,
      ),
  },

  // RENTAL SERVICE/rental/api/v1/...
  rental: {
    /** GET available vehicles for rent with optional filter queries */
    getAvailableVehicles: (queries?: Record<string, string>): R<unknown> => {
      const params = queries ? new URLSearchParams(queries).toString() : "";
      return callApi(`${BASE_RENTAL}/vehicles${params ? `?${params}` : ""}`);
    },

    /** POST rider books/rents a vehicle */
    rentVehicle: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_RENTAL}/rider/rent`, data, undefined, {
        idempotencyKey: `rental-${Date.now()}`,
      }),

    /** POST driver lists a vehicle for rent */
    listVehicle: (data: {
      vehicleId: string;
      latitude: number;
      longitude: number;
      address: string;
    }): R<unknown> =>
      callApi(`${BASE_RENTAL}/driver/rent`, data as Record<string, unknown>),

    /** DELETE driver delists a vehicle */
    delistVehicle: (vehicleId: string): R<unknown> =>
      callApi(
        `${BASE_RENTAL}/driver/rent/delist/${vehicleId}`,
        undefined,
        "DELETE",
      ),

    /** DELETE rider cancels a rental */
    cancelRental: (rentalId: string): R<unknown> =>
      callApi(
        `${BASE_RENTAL}/rider/rent/cancel/${rentalId}`,
        undefined,
        "DELETE",
      ),

    /** GET all rentals for the current user */
    getRentals: (): R<unknown> => callApi(`${BASE_RENTAL}/rentals`),

    /** GET all rentals for a specific user (admin view) */
    getRentalsByUser: (userId: string): R<unknown> =>
      callApi(`${BASE_RENTAL}/rentals/${userId}`),

    /** GET active rentals for current user */
    getActiveRentals: (): R<unknown> =>
      callApi(`${BASE_RENTAL}/rentals/active`),

    /** GET details of a single rental */
    getRentalDetails: (rentalId: string): R<unknown> =>
      callApi(`${BASE_RENTAL}/${rentalId}`),

    /** POST mark rental as begun (driver confirms start) */
    beginRental: (rentalId: string): R<unknown> =>
      callApi(`${BASE_RENTAL}/${rentalId}/begin`, {}),

    /** POST finalize / complete a rental */
    finalizeRental: (rentalId: string): R<unknown> =>
      callApi(`${BASE_RENTAL}/${rentalId}/finalize`, {}),
  },

  // PAYMENT SERVICE/payment/api/v1/...
  payment: {
    //Wallet & Deposits
    /** GET current user's wallet balance */
    getWallet: (): R<WalletDetails> => callApi(`${BASE_USER}/user/wallet`),

    /** POST initiate a wallet top-up / deposit */
    initiateDeposit: (data: {
      amount: number;
      currency?: string;
      paymentMethod?: string;
    }): R<unknown> =>
      callApi(`${BASE_PAY}/initiate`, data as Record<string, unknown>),

    /** POST verify a deposit after payment gateway callback */
    verifyDeposit: (data: {
      reference: string;
      [key: string]: unknown;
    }): R<unknown> =>
      callApi(`${BASE_PAY}/verify`, data as Record<string, unknown>),

    /** GET current user's deposit history */
    getDepositHistory: (): R<unknown> => callApi(`${BASE_PAY}/history`),

    /** GET a single payment / deposit record */
    getPayment: (paymentId: string): R<unknown> =>
      callApi(`${BASE_PAY}/deposit/${paymentId}`),

    /** POST withdraw from wallet */
    withdrawDeposit: (data: {
      amount: number;
      [key: string]: unknown;
    }): R<unknown> =>
      callApi(`${BASE_PAY}/withdraw`, data as Record<string, unknown>),

    //Payment Intent & Cost
    /** POST estimate ride cost + create Stripe payment intent */
    createPaymentIntent: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_PAY}/intent`, data),

    /** POST calculate ride cost */
    calculateRideCost: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_PAY}/cost/ride`, data),

    /** POST calculate rental cost estimate */
    calculateRentalCost: (data: {
      vehicleId: string;
      duration: number;
      pickUpLat?: number;
      pickUpLong?: number;
      bookingType?: "SELF_DRIVE" | "WITH_DRIVER";
    }): R<unknown> =>
      callApi(`${BASE_PAY}/cost/rental`, data as Record<string, unknown>),

    /** POST charge rider for a completed ride */
    chargeRider: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_PAY}/charge`, data),

    //Payment Method
    /** POST set preferred payment method */
    setPaymentMethod: (data: { method: "wallet" | "card" }): R<unknown> =>
      callApi(`${BASE_PAY}/method/set`, data as Record<string, unknown>),

    /** GET current user's payment method */
    getPaymentMethod: (riderId: string): R<unknown> =>
      callApi(`${BASE_PAY}/method/${riderId}`),

    //Vehicle Classes (payment service)
    /** GET all vehicle classes */
    getVehicleClasses: (): R<unknown> => callApi(`${BASE_PAY}/vehicle/classes`),

    /** GET a single vehicle class */
    getVehicleClass: (id: string): R<unknown> =>
      callApi(`${BASE_PAY}/vehicle/class/${id}`),

    /** POST select a vehicle class for a ride */
    selectVehicleClass: (data: { vehicleClassId: string }): R<unknown> =>
      callApi(`${BASE_PAY}/vehicle/select`, data as Record<string, unknown>),

    //Cost Settings (payment service)
    /** GET active cost settings (available to authenticated users) */
    getActiveCostSettings: (): R<unknown> =>
      callApi(`${BASE_PAY}/cost/settings/active`),

    /** GET a single cost settings record */
    getSingleCostSettings: (id: string): R<unknown> =>
      callApi(`${BASE_PAY}/cost/settings/${id}`),

    //Haggle
    /** POST haggle / counteroffer for a ride fare */
    haggleRide: (rideId: string, data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_PAY}/haggle/${rideId}`, data),

    //Receipt & Status
    /** GET payment receipt */
    getPaymentReceipt: (paymentId: string): R<unknown> =>
      callApi(`${BASE_PAY}/receipt/${paymentId}`),

    /** GET payment status for a rental */
    getRentalPaymentStatus: (rentalId: string): R<unknown> =>
      callApi(`${BASE_PAY}/status/rental/${rentalId}`),

    //Stripe Account
    /** POST create a Stripe payout account for a driver */
    createStripePayoutAccount: (data?: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_PAY}/account/stripe/create`, data ?? {}),

    /** GET driver's connected Stripe payout account */
    getPayoutAccount: (): R<unknown> => callApi(`${BASE_PAY}/account/stripe`),

    /** GET Stripe Express dashboard link */
    loadStripeDashboard: (): R<unknown> =>
      callApi(`${BASE_PAY}/account/stripe/dashboard`),

    /** POST finalize a rental and credit the driver's wallet */
    finalizeRentalPayment: (rentalId: string): R<unknown> =>
      callApi(`${BASE_PAY}/rental/finalize/${rentalId}`, {}),

    //Vouchers (rider-facing)
    /** POST validate and apply a voucher code before checkout */
    applyVoucher: (data: {
      code: string;
      orderAmount: number;
      service: "ride" | "rental" | "both";
    }): R<unknown> =>
      callApi(`${BASE_PAY}/vouchers/apply`, data as Record<string, unknown>),
  },

  // LOCATION SERVICE/location/api/v1/...
  location: {
    /** POST update driver's current location (called every few seconds) */
    trackLocation: (data: {
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    }): R<unknown> =>
      callApi(`${BASE_LOC}/track`, data as Record<string, unknown>),

    /** GET last known location of a specific driver */
    getDriverLocation: (driverId: string): R<unknown> =>
      callApi(`${BASE_LOC}/driver/${driverId}/location`),

    /** GET available drivers (online and accepting rides) */
    getAvailableDrivers: (): R<unknown> =>
      callApi(`${BASE_LOC}/drivers/availability`),

    /** GET drivers near given coordinates */
    getNearbyDrivers: (params: {
      lat: number;
      lng: number;
      radius?: number;
    }): R<unknown> =>
      callApi(
        `${BASE_LOC}/drivers/nearby${qs(params as unknown as Record<string, string>)}`,
      ),

    /** POST calculate distance between two coordinates */
    calculateDistance: (data: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
    }): R<unknown> =>
      callApi(`${BASE_LOC}/distance`, data as Record<string, unknown>),

    /** POST estimate ETA between two coordinates */
    estimateETA: (data: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
    }): R<unknown> =>
      callApi(`${BASE_LOC}/eta`, data as Record<string, unknown>),

    /** GET location/route history for a ride */
    getRideLocationHistory: (rideId: string): R<unknown> =>
      callApi(`${BASE_LOC}/history/${rideId}`),
  },

  // NOTIFICATION SERVICE/notify/api/v1/...
  notification: {
    getNotifications: (): R<unknown> => callApi(`${BASE_NOTIFY}/notifications`),

    markAsRead: (notificationId: string): R<unknown> =>
      callApi(
        `${BASE_NOTIFY}/notifications/${notificationId}/read`,
        {},
        "PATCH",
      ),

    updatePreferences: (data: Record<string, unknown>): R<unknown> =>
      callApi(`${BASE_NOTIFY}/notifications/preferences`, data, "PATCH"),

    getPreferences: (): R<unknown> =>
      callApi(`${BASE_NOTIFY}/notifications/preferences`),
  },

  // TRIP HISTORY SERVICE/trip-history/api/v1/...
  tripHistory: {
    getRentalHistory: (rentalId: string): R<unknown> =>
      callApi(`${BASE_TRIP}/trip-history/rental/${rentalId}`),
  },

  // COMMUNICATION SERVICE/communication/api/v1/...
  // Source: POST /conversation/start, GET /conversation/:id,
  //         GET /conversation/message/:messageId,
  //         GET /conversations/user/:userId,
  //         POST /call/initiate, GET /call/:callId,
  //         GET /calls, DELETE /call/:callId
  communication: {
    /**
     * POST /communication/api/v1/conversation/start
     * Start or retrieve an existing conversation between a rider and driver.
     */
    startConversation: (data: {
      driverId: string;
      riderId: string;
    }): R<unknown> =>
      callApi(
        `${BASE_COMM}/conversation/start`,
        data as Record<string, unknown>,
      ),

    /** GET /communication/api/v1/conversation/:conversationId */
    getConversationById: (conversationId: string): R<unknown> =>
      callApi(`${BASE_COMM}/conversation/${conversationId}`),

    /** GET /communication/api/v1/conversation/message/:messageId */
    getMessage: (messageId: string): R<unknown> =>
      callApi(`${BASE_COMM}/conversation/message/${messageId}`),

    /** GET /communication/api/v1/conversations/user/:userId */
    getUserConversations: (userId: string): R<unknown> =>
      callApi(`${BASE_COMM}/conversations/user/${userId}`),

    /**
     * POST /communication/api/v1/conversation/:conversationId/message
     * Send a message to an existing conversation.
     * Note: real-time delivery may be handled via WebSocket; this REST endpoint
     * persists the message and returns the updated conversation.
     */
    sendMessage: (data: {
      conversationId: string;
      body: string;
      senderId?: string;
    }): R<unknown> =>
      callApi(
        `${BASE_COMM}/conversation/${data.conversationId}/message`,
        { body: data.body, senderId: data.senderId } as Record<string, unknown>,
        "POST",
      ),

    /** POST /communication/api/v1/call/initiate */
    startCall: (data: {
      conversationId: string;
      [key: string]: unknown;
    }): R<unknown> =>
      callApi(`${BASE_COMM}/call/initiate`, data as Record<string, unknown>),

    /** GET /communication/api/v1/call/:callId */
    getCallById: (callId: string): R<unknown> =>
      callApi(`${BASE_COMM}/call/${callId}`),

    /** GET /communication/api/v1/calls */
    getCalls: (): R<unknown> => callApi(`${BASE_COMM}/calls`),

    /** DELETE /communication/api/v1/call/:callId */
    deleteCall: (callId: string): R<unknown> =>
      callApi(`${BASE_COMM}/call/${callId}`, undefined, "DELETE"),
  },

  // MAP SERVICE/map/api/v1/...
  map: {
    getVehicleLocations: (queries: Record<string, string>): R<unknown> => {
      const params = new URLSearchParams(queries).toString();
      return callApi(`/map/api/v1/map/vehicles${params ? `?${params}` : ""}`);
    },
  },
} as const;
