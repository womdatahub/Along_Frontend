import { callApi } from "./call-api";
import { userApiStr } from "./utils";

export type AlongUploadType = "profile" | "vehicle" | "verification_document";

type CloudinarySignature = {
  apiKey: string;
  cloudName: string;
  folder: string;
  signature: string;
  timestamp: number;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  url?: string;
  error?: { message?: string };
};

export const uploadMediaDirectly = async (
  file: File | Blob,
  uploadType: AlongUploadType,
): Promise<string> => {
  const { data, error } = await callApi<CloudinarySignature>(
    userApiStr("/user/upload"),
    { uploadType },
    "POST",
  );

  if (error) {
    throw new Error(error.message || "Failed to sign upload");
  }

  const signature = data?.data;
  if (
    !signature?.apiKey ||
    !signature.cloudName ||
    !signature.folder ||
    !signature.signature ||
    !signature.timestamp
  ) {
    throw new Error("Upload signature payload is incomplete");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", String(signature.timestamp));
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const payload = (await response.json()) as CloudinaryUploadResponse;
  if (!response.ok || payload.error) {
    throw new Error(payload.error?.message || "Cloudinary upload failed");
  }

  const secureUrl = payload.secure_url ?? payload.url?.replace(/^http:\/\//i, "https://");
  if (!secureUrl || !secureUrl.startsWith("https://res.cloudinary.com/")) {
    throw new Error("Cloudinary did not return a valid secure URL");
  }

  return secureUrl;
};
