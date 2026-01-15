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
    disabled: false,
  },
  {
    state: "logistics",
    title: "Logistics",
    img: "/images/logistics.png",
    disabled: true,
  },
];
