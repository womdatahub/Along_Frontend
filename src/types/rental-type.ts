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
