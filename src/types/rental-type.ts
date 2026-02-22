export type RentAndCreateIntentResponseType = {
  rental: {
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
    recurring: true;
    flexibility: true;
    days: string[];
    luggage: number;
    pets: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    id: string;
    vehicle: VehicleInfo;
    driver: DriverInfo;
    cost: {
      baseCost: number;
      tax: number;
      pickUpCharge: number;
      total: string;
      currency: string;
    };
    paymentIntent: {
      baseCost: number;
      tax: number;
      pickUpCharge: number;
      total: string;
      currency: string;
      intentId: string;
      paymentIntent: string;
      ephemeralKey: string;
      customer: string;
      amount: number;
      paymentMethodTypes: string[];
      id: string;
      publishableKey: string;
    };
  };
};

export type RentAndCreateIntentType = {
  vehicleId: string;
  pickUpLat: number;
  pickUpLong: number;
  pickUpAddress: string;
  // "pickUpTime": "{{current_date}}", // When to pick rider, applies only to scheduled rentals: Optional
  duration: number; // Duration in hours, 30mins is 0.5.
  luggage?: number; // Size of luggage in kg: Optional (must be number)
  pets?: string[]; // List of pets a rider plans to ride with: Optional
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
