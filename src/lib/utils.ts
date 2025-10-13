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
  INSTANT = "instant",
  RENTAL = "rental",
  MATCH = "match",
}

export const userApiStr = (value: string) => apiStr(ApiBase.USER, value);
export const instantApiStr = (value: string) => apiStr(ApiBase.INSTANT, value);
export const rentalApiStr = (value: string) => apiStr(ApiBase.RENTAL, value);
export const matchingApiStr = (value: string) => apiStr(ApiBase.MATCH, value);
