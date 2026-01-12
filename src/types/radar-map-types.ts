export type AddressResult = {
  addressLabel: string;
  city: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  county: string;
  distance: number;
  formattedAddress: string;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  latitude: number;
  longitude: number;
  state: string;
  layer: string; // e.g. "locality"
};
