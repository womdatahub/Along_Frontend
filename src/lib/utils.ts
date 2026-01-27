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
export const instantApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.INSTANT, value + generateQueries(queries));
export const rentalApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.RENTAL, value + generateQueries(queries));
export const matchingApiStr = (value: string, queries?: Queries) =>
  apiStr(ApiBase.MATCH, value + generateQueries(queries));
