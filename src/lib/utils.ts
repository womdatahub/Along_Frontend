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

const apiStr = (type: "user" | "rental" | "instant", value: string) => {
  return `/${type}/api/v1${value}`;
};
export const USER = "user";
export const INSTANT = "instant";
export const RENTAL = "rental";

export const userApiStr = (value: string) => apiStr(USER, value);
export const instantApiStr = (value: string) => apiStr(INSTANT, value);
export const rentalApiStr = (value: string) => apiStr(RENTAL, value);
