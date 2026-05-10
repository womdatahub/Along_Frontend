import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateToDDMMYYYY = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const apiStr = (type: ApiBase, value: string) => {
  return `/${type}/api/v1${value}`;
};

export enum ApiBase {
  USER = "user",
  RENTAL = "rental",
  PAYMENT = "payment",
  ADMIN = "admin",
  COMMUNICATION = "communication",
  LOCATION = "location",
  MAP = "map",
  TRIP_HISTORY = "trip-history",
  NOTIFICATION = "notify",
}

type Queries = {
  [key: string]: string;
};

const generateQueries = (queries?: Queries) => {
  const params = new URLSearchParams(queries);
  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};
export const userApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.USER, value + generateQueries(queries));
export const rentalApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.RENTAL, value + generateQueries(queries));
export const paymentApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.PAYMENT, value + generateQueries(queries));
export const adminApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.ADMIN, value + generateQueries(queries));
export const communicationApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.COMMUNICATION, value + generateQueries(queries));
export const locationApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.LOCATION, value + generateQueries(queries));
export const mapApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.MAP, value + generateQueries(queries));
export const tripHistoryApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.TRIP_HISTORY, value + generateQueries(queries));
export const notificationApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.NOTIFICATION, value + generateQueries(queries));

export const isRideHailingEnabled =
  process.env.NEXT_PUBLIC_ENABLE_RIDE_HAILING === "true";

export const comingSoonMessage =
  "Ride-hailing is coming soon. Vehicle rental is available now.";

export const createIdempotencyKey = (scope: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${scope}-${crypto.randomUUID()}`;
  }
  return `${scope}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};
