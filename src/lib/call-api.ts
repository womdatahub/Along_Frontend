import axios, { AxiosInstance, AxiosResponse } from "axios";

import { ApiResponse } from "@/types";

import { toast } from "sonner";

const BASEURL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const cookie = process.env.NEXT_PUBLIC_FRONTEND_COOKIE ?? "";

if (!BASEURL) {
  throw new Error("add BASEURL to your env file");
}

interface ApiError {
  message: string;
  status: string | number;
  error?: unknown;
  headers?: Record<string, unknown>;
  accountLink?: string;
}

export const isObject = (value: unknown): value is Record<string, unknown> => {
  const isArray = Array.isArray(value);
  const isFormData = value instanceof FormData;
  const isObject = typeof value === "object" && value !== null;

  return !isArray && !isFormData && isObject;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true,
  // timeout: 10000,
});

export const callApi = async <T>(
  endpoint: string,
  data?: Record<string, unknown> | FormData,
  extraMethods?: "PUT" | "DELETE" | "PATCH",
): Promise<{ data?: ApiResponse<T>; error?: ApiError }> => {
  const cancelTokenSource = axios.CancelToken.source();

  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request<
      ApiResponse<T>
    >({
      method:
        extraMethods && data
          ? extraMethods
          : data && !extraMethods
            ? "POST"
            : "GET",
      url: endpoint,
      ...(data && { data }),
      headers: {
        platform: process.env.NEXT_PUBLIC_FRONTEND_PLATFORM ?? "",
        "x-referrer":
          process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000",
        ...(isObject(data)
          ? {
              "Content-Type": "application/json",
              Accept: "application/json",
              // Authorization: "Bearer " + cookie,
            }
          : {
              "Content-Type": "multipart/form-data",
            }),
      },
      cancelToken: cancelTokenSource.token,
    });

    return { data: response.data };
  } catch (error) {
    let apiError: ApiError | undefined;
    if (axios.isCancel(error)) {
      console.error("Previous request was canceled");
    }
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      apiError = data;
      switch (status) {
        case 401:
          {
            // useInitSession.getState().actions.clearSession();
          }
          break;
        case 429:
          toast.error(error.message);
          console.error("Bad request");
          break;
        case 500:
          toast.error(error.message);
          console.error(`Internal server error`);
          break;
        case 422:
          toast.error(error.message);
          break;
        default:
          console.error(`Unknown API error: ${status}`);
      }
    } else {
      if (error instanceof Error) {
        apiError = { message: error.message, status: "Error" };
      }
    }
    return { error: apiError };
  }
};
