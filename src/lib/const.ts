export const carTypes = [
  {
    name: "Economy",
    seat: 4,
  },
  {
    name: "Comfort",
    seat: 4,
  },
  {
    name: "Comfort XL",
    seat: 6,
  },
  {
    name: "Luxury",
    seat: 4,
  },
  {
    name: "Luxury XL",
    seat: 6,
  },
];

export const rideRental = [
  { title: "Rent instant ride", image: "/images/instant-ride.png" },
  { title: "Rent for later", image: "/images/later-ride.png" },
];

export const modalItems = [
  {
    state: "rental",
    title: "Ride Rental",
    img: "/images/rental.png",
  },
];
export const nonModalItems = [
  {
    state: "scheduled",
    title: "Scheduled Ride",
    img: "/images/scheduled.png",
    disabled: true,
  },
  {
    state: "logistics",
    title: "Logistics",
    img: "/images/logistics.png",
    disabled: true,
  },
];

// Routes accessible to everyone (logged-in or not)
export const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/onboarding",
  "/onboarding/driver-info",
  "/onboarding/services",
  "/onboarding/documents",
  "/onboarding/vehicle-info",
] as const;

// Routes that authenticated users should be redirected away from
export const AUTH_ONLY_ROUTES = [
  "/sign-in",
  "/onboarding/otp",
  "/onboarding/rider",
  "/onboarding/user-type",
  "/onboarding/terms",
] as const;

// Dashboard landing pages per role
export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  driver: "/driver-db",
  rider: "/rider-db",
  admin: "/admin",
};
