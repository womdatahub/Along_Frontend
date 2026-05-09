export type ImageType = {
  imageFile: File | Blob;
  imageName: string;
  imageSize: number;
  url?: string;
};

export type ApiResponse<T = Record<string, unknown>> = {
  success?: boolean;
  status?: string;
  message: string;
  data: T;
  error?: string;
  errors?: Array<{ path?: string; message: string }>;
};

export type SelectorFn<TStore, TResult> = (state: TStore) => TResult;

export type WalletDetails = {
  id?: string;
  userId: string;
  mainBalance: number;
  referralBalance: number;
  createdAt?: string;
  updatedAt?: string;
};

export * from "./radar-map-types";
export * from "./rental-type";
export * from "./session-types";
export * from "./admin-types";
export * from "./permissions.type";
