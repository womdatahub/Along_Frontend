export * from "./utils";
export * from "./hooks";
export * from "./call-api";
export * from "./schemas";
export * from "./const";
export const removeFieldsFromObject = <T extends object, K extends keyof T>(obj: T, keys: K[]) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
}