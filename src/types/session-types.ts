export type AdminProfile = {
  _id: string;
  adminId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: "admin" | string;
  profilePictureUri: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
export type DriverProfile = {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  acceptanceRate: number;
  rating: {
    totalRating: number;
    numberOfRatings: number;
  };
  // ISO 8601 strings
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
  gender: "male" | "female" | "other";
  services: Array<"scheduled_ride" | string>;
  allowPets: boolean;
  email: string;
  role: "driver" | string;
  driverId: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleClass: "economy" | "standard" | "premium" | string;
  vehicleIdentificationNumber: string;
  advancedVerificationUri: string;
  driverLincenseFrontViewUri: string;
  driverLincenseBackViewUri: string;
  driverProfilePictureUri: string;
  vehicleFrontViewImageUri: string;
  vehicleBackViewImageUri: string;
  vehicleSideViewImageUri: string;
  vehicleId: string;
  mobileNumber: string;
  insuranceDocumentUri: string;
  isActive: boolean;
  __v: number;
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
  __v: number;
}

export interface UserProfile {
  _id: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  isEmailVerified: true;
  isMobileNumberVerified: boolean;
  mobileNumber: string;
}
