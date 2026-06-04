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
  pagination?: PaginationMeta;
  meta?: PaginationMeta;
};

/** Pagination envelope returned by paginated list endpoints. */
export type PaginationMeta = {
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

/** Standard query params for any paginated list endpoint. */
export type PaginationParams = {
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
};

// Payment enums (mirror backend)
export const PaymentStatus = {
  PENDING: "pending",
  SUCCESS: "success",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentFor = {
  INSTANT: "instant",
  SCHEDULED: "scheduled",
  RENTAL: "rental",
  RIDE: "ride",
  LOGISTICS: "logistics",
  SERVICE: "service",
} as const;
export type PaymentFor = (typeof PaymentFor)[keyof typeof PaymentFor];

export const PaymentType = {
  WITHDRAW: "withdraw",
  DEPOSIT: "deposit",
  CHARGE: "charge",
  REFUND: "refund",
  TRANSFER: "transfer",
  FEE: "fee",
  DISPUTE: "dispute",
  REWARD: "reward",
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

/** Single payment record shape returned by the payments endpoint. */
export type PaymentRecord = {
  _id?: string;
  id?: string;
  rider?: string;
  driver?: string;
  amount?: number;
  platformFee?: number;
  status?: PaymentStatus | string;
  paymentFor?: PaymentFor | string;
  paymentType?: PaymentType | string;
  createdAt?: string;
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
