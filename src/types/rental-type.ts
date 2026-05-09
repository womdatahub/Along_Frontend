export type RentAndCreateIntentType = {
  vehicleId: string;
  bookingType: "SELF_DRIVE" | "WITH_DRIVER";
  pickUpLat: number;
  pickUpLong: number;
  pickUpAddress: string;
  pickUpTime?: string;
  requestedEndAt?: string;
  duration: number; // Duration in hours, 30mins is 0.5.
  luggage?: number; // Size of luggage in kg: Optional (must be number)
  pets?: string; // Optional pet note
  recurring?: boolean; // Optional
  flexibility: boolean;
  days: string[];
  // This will save the rental information and create payment intent
};

export type VehicleLocation = {
  _id: string;
  vehicleId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  address: string;
  capacity: number;
  status: "available" | "unavailable" | "busy";
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  vehicleInfo: VehicleInfo;
  driverInfo: DriverInfo;
  supportsSelfDrive?: boolean;
  supportsWithDriver?: boolean;
};

export type VehicleInfo = {
  vehicleMake: string;
  vehicleModel: string;
  vehicleClass: "economy" | "standard" | "premium" | string;
  vehicleYear: string;
  vehicleColor: string;
  vehicleFrontViewImageUri: string;
  vehicleBackViewImageUri: string;
  vehicleSideViewImageUri: string;
  vehicleIdentificationNumber: string;
};

export type DriverInfo = {
  _id: string;
  email: string;
  role: "driver";
  userId: string;
  firstName: string;
  lastName: string;
  acceptanceRate: number;
  rating: DriverRating;
  gender: "male" | "female" | "other";
  services: string[];
  rideProfile: RideProfile;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  __v: number;
  age: number;
  driverLincenseBackViewUri: string;
  driverLincenseFrontViewUri: string;
  driverProfilePictureUri: string;
  driverSocialSecurityNumber: string;
  referralCode: string;
  kycStatus: string;
};

export type DriverRating = {
  totalRating: number;
  numberOfRatings: number;
};

export type RideProfile = {
  currentLocation: {
    location: string;
    longitude: number;
    latitude: number;
  };
  ratePerHour: string; // ⚠ API returns string
  allowPets: boolean;
  luggageCapacity: number;
};

export type PaymentIntentResponse = {
  riderId: string;
  driverId: string;
  vehicleId: string;
  vehicleClass: string;
  rentalType: string;
  pickUpLat: number;
  pickUpLong: number;
  pickUpAddress: string;
  pickUpTime: null;
  duration: number;
  recurring: boolean;
  flexibility: boolean;
  days: [];
  pets: [];
  status: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  _id?: string;
  paymentIntentId?: string;
  reservedUntil?: string;
  bookingType?: "SELF_DRIVE" | "WITH_DRIVER";
  vehicle: VehicleLocation;
  driver: DriverInfo;
  cost: IntentCost;
  paymentIntent: PaymentIntent;
};

export type IntentCost = {
  baseCost: number;
  tax: number;
  pickUpCharge: number;
  total: string;
  currency: string;
};
type PaymentIntent = IntentCost & {
  intentId: string;
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  amount: number;
  paymentMethodTypes: "card" | "link" | "cashapp"[];
  id: string;
  publishableKey: string;
};

export type RentalRecord = Partial<PaymentIntentResponse> & {
  _id?: string;
  id?: string;
  status?: string;
  bookingType?: "SELF_DRIVE" | "WITH_DRIVER";
  rentalType?: "instant" | "scheduled";
  vehicleId?: string;
  driverId?: string;
  riderId?: string;
  pickUpAddress?: string;
  pickUpTime?: string;
  requestedEndAt?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type RentalPaymentStatus = {
  rentalId?: string;
  paymentId?: string;
  status?: string;
  amount?: number;
  currency?: string;
  paymentIntentId?: string;
  receiptUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RentalCostEstimate = {
  baseCost: number;
  pickUpCharge?: number;
  tax: number;
  total: number | string;
  currency?: string;
};
