import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { ApiResponse } from "@/types";

import { toast } from "sonner";
import { useSession } from "@/store";

const BASEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const cookie = process.env.NEXT_PUBLIC_FRONTEND_COOKIE ?? "";

if (!BASEURL) {
  throw new Error("add BASEURL to your env file");
}

export interface ApiError {
  message: string;
  status: string | number;
  error?: unknown;
  headers?: Record<string, unknown>;
  accountLink?: string;
  errors?: Array<{ path?: string; message: string }>;
}

type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH";

type CallApiOptions = {
  method?: HttpMethod;
  idempotencyKey?: string;
  headers?: Record<string, string>;
  skipToast?: boolean;
  retries?: number;
  /** Internal — set automatically by callApi to suppress non-auth toasts on GET requests */
  _isGet?: boolean;
};

export const isObject = (value: unknown): value is Record<string, unknown> => {
  const isArray = Array.isArray(value);
  const isFormData = value instanceof FormData;
  const isObject = typeof value === "object" && value !== null;

  return !isArray && !isFormData && isObject;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  timeout: 30000,
});

const authTokenStorageKey = "alongAccessToken";

export const clearStoredAuthToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(authTokenStorageKey);
};

const resolveMethod = (
  data?: Record<string, unknown> | FormData,
  legacyMethod?: HttpMethod,
  options?: CallApiOptions,
): HttpMethod => options?.method ?? legacyMethod ?? (data ? "POST" : "GET");

const normalizeApiError = (
  status: number | string,
  responseData: unknown,
): ApiError => {
  if (responseData && typeof responseData === "object") {
    const body = responseData as Record<string, unknown>;
    const message =
      typeof body.message === "string"
        ? body.message
        : typeof body.error === "string"
          ? body.error
          : "Request failed";
    return {
      ...(body as Partial<ApiError>),
      message,
      status: (body.status as string | number | undefined) ?? status,
    };
  }
  return {
    message: typeof responseData === "string" ? responseData : "Request failed",
    status,
  };
};

const normalizeApiResponse = <T>(responseData: unknown): ApiResponse<T> => {
  if (!responseData || typeof responseData !== "object") {
    return {
      message: "Request completed",
      data: responseData as T,
      status: "Success",
    };
  }

  const body = responseData as Record<string, unknown>;
  if ("data" in body) return body as ApiResponse<T>;

  const dataKey = [
    "rental",
    "payment",
    "rentals",
    "vehicles",
    "vehicle",
    "drivers",
    "riders",
    "admins",
    "alerts",
    "conversation",
    "call",
  ].find((key) => key in body);

  return {
    ...(body as Partial<ApiResponse<T>>),
    status:
      typeof body.status === "string"
        ? body.status
        : body.success === false
          ? "Failed"
          : "Success",
    message:
      typeof body.message === "string" ? body.message : "Request completed",
    data: (dataKey ? body[dataKey] : body) as T,
  };
};

const frontendOrigin =
  process.env.NEXT_PUBLIC_FRONTEND_URL ??
  process.env.NEXT_PUBLIC_BASE_FRONTEND_URL ??
  "http://localhost:3001";

export const callApi = async <T>(
  endpoint: string,
  data?: Record<string, unknown> | FormData,
  extraMethods?: HttpMethod,
  options?: CallApiOptions,
): Promise<{ data?: ApiResponse<T>; error?: ApiError }> => {
  const method = resolveMethod(data, extraMethods, options);
  const isFormData = data instanceof FormData;
  const maxAttempts = (options?.retries ?? 0) + 1;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const cancelTokenSource = axios.CancelToken.source();
    try {
      const requestConfig: AxiosRequestConfig = {
        method,
        url: endpoint,
        ...(data !== undefined && method !== "GET" ? { data } : {}),
        headers: {
          platform: process.env.NEXT_PUBLIC_FRONTEND_PLATFORM ?? "web-platform",
          "x-referrer": frontendOrigin,
          Accept: "application/json",
          ...(isFormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          ...(options?.idempotencyKey
            ? { "Idempotency-Key": options.idempotencyKey }
            : {}),
          ...options?.headers,
        },
        cancelToken: cancelTokenSource.token,
      };

      const response: AxiosResponse<ApiResponse<T>> =
        await apiClient.request<ApiResponse<T>>(requestConfig);

      return { data: normalizeApiResponse<T>(response.data) };
    } catch (error) {
      const apiError = handleApiError(error, {
        ...options,
        _isGet: method === "GET",
        skipToast: options?.skipToast || attempt < maxAttempts,
      });
      if (attempt === maxAttempts) {
        return {
          error: apiError ?? { message: "Request failed", status: "Error" },
        };
      }
    }
  }

  return { error: { message: "Request failed", status: "Error" } };
};

const handleApiError = (error: unknown, options?: CallApiOptions): ApiError => {
  if (axios.isCancel(error)) {
    return { message: "Request canceled", status: "Canceled" };
  }

  // GET requests are always silent for non-auth errors — they're background fetches.
  // Auth errors (401/403) always surface regardless of method.
  const isGet = options?._isGet === true;
  const shouldToast = (forceShow: boolean) =>
    !options?.skipToast && (forceShow || !isGet);

  if (axios.isAxiosError(error) && error.response) {
    const { status, data } = error.response;
    const apiError = normalizeApiError(status, data);

    switch (status) {
      case 403: {
        if (apiError.message === "Admin account is suspended") {
          // Always show — account suspension is critical regardless of method
          toast.error(
            "Your account has been suspended and logged out. \n Please contact support.",
          );
          useSession.getState().actions.logOut();
        } else if (shouldToast(true)) {
          toast.error(apiError.message);
        }
        break;
      }
      case 401:
        clearStoredAuthToken();
        if (shouldToast(true)) toast.error(apiError.message);
        break;
      default:
        if (shouldToast(false)) toast.error(apiError.message);
        break;
    }

    return apiError;
  }

  if (axios.isAxiosError(error) && error.request) {
    const apiError = {
      message:
        "Unable to reach the server. Please check your internet connection and try again.",
      status: "Network Error",
    };
    if (shouldToast(false)) toast.error(apiError.message);
    return apiError;
  }

  const message = error instanceof Error ? error.message : "Request failed";
  const apiError = { message, status: "Error" };
  if (shouldToast(false)) toast.error(message);
  return apiError;
};
