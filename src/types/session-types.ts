export type AdminProfile = {
  _id: string;
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: "admin";
  profilePictureUri: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isEmailVerified: boolean;
  isMobileNumberVerified: boolean;
  passwordResetToken: string;
  passwordResetOtp: string;
  isGoogleUser: false;
  isAppleUser: false;
  isFacebookUser: false;
  password: string;
  isSuspended: false;
  suspensionReason: string;
  suspensionNotes: string;
  suspensionType: string;
  suspensionEndDate: string;
  refreshToken: string;
};

export type SuspendedDriver = {
  _id: string;
  isSuspended: boolean;
  role: "driver";
  createdAt: string;
  updatedAt: string;
  driver: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    driverProfilePictureUri: string;
  };
};

export type DriverProfile = {
  //  Identifiers
  userId: string;
  driverId?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber?: string;
  role: "driver" | string;
  gender?: "male" | "female" | "other";
  dateOfBirth?: string;
  address?: string;
  referralCode?: string;
  driverProfilePictureUri?: string;
  // ISO 8601 strings
  createdAt: string;
  updatedAt: string;

  //  KYC documents
  driverSocialSecurityNumber?: string;
  driverLincenseFrontViewUri?: string;
  driverLincenseBackViewUri?: string;
  advancedVerificationUri?: string;
  licenseExpiryDate?: string;
  kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | string;
  kycRejectionReason?: string;
  kycNotes?: string;
  /** True only after kyc approval. */
  isLicenseApproved?: boolean;

  //  Driver state
  acceptanceRate?: number;
  driverScore?: number;
  availableForDriving?: boolean;
  payoutReady?: boolean;
  rating?: {
    totalRating: number;
    numberOfRatings: number;
  };
  services?: string[];
  rideProfile?: {
    ratePerHour?: string;
    allowPets?: boolean;
    luggageCapacity?: number;
    passengerCapacity?: number;
  };

  //  Banking
  bankName?: string;
  routingNumber?: string;
  accountNumber?: string;
  vehicles?: DriverVehicleSummary[];
  vehicleId?: string;
  isVehicleAdded?: boolean;
};

export type DriverVehicleSummary = {
  _id: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  vehicleColor?: string;
  vehicleClass?:
    | "economy"
    | "comfort"
    | "comfort_xl"
    | "luxury"
    | "luxury_xl"
    | string;
  vehicleIdentificationNumber?: string;
  vehicleFrontViewImageUri?: string;
  vehicleBackViewImageUri?: string;
  vehicleSideViewImageUri?: string;
  insuranceDocumentUri?: string;
  rentalModes?: Array<"SELF_DRIVE" | "WITH_DRIVER">;
  isActive?: boolean;
  verificationStatus?: "PENDING" | "APPROVED" | "REJECTED";
};

export interface RiderProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: "male" | "female" | "other";
  role: "rider" | "user" | "admin" | "driver";
  referralCode: string;
  profilePictureUri: string | null;
  createdAt: string;
  updatedAt: string;
  dateOfBirth: string;
  isLicenseApproved?: boolean;
  licenseNumber?: string;
  licenseExpiryDate?: string;
  licenseFrontImageUri?: string;
  licenseBackImageUri?: string;
  licenseSelfieImageUri?: string;

  __v: number;
}

export type AllRiderAccount = {
  _id: string;
  email: string;
  isEmailVerified: boolean;
  mobileNumber: string;
  isMobileNumberVerified: boolean;
  passwordResetOtp: string | null;
  isGoogleUser: boolean;
  isAppleUser: boolean;
  isFacebookUser: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
  suspensionNotes: string | null;
  suspensionType: string | null;
  suspensionEndDate: string | null;
  role: "rider";
  createdAt: string;
  updatedAt: string;
  gender: "male" | "female";
  rider: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    profilePictureUri: string | null;
  };
};

export type AllDriversAccount = {
  _id: string;
  email: string;
  mobileNumber: string;
  isSuspended: boolean;
  createdAt: string;
  role: "driver";
  driver: {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    rating: {
      totalRating: number;
      numberOfRatings: number;
    };
    driverProfilePictureUri: string;
    driverSocialSecurityNumber: string;
  };
};
export interface UserProfile {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: boolean;
  isMobileNumberVerified: boolean;
  mobileNumber: string;
}
