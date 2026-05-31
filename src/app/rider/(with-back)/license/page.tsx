"use client";

import {
  AuthBackAndContinueButton,
  Card,
  CardContent,
  HeadingHeebo,
  UploadingImagesReusableComponent,
} from "@/components";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { UploadImageIcon } from "@public/svgs";
import {
  BadgeCheck,
  Clock,
  XCircle,
  Pencil,
  CreditCard,
  Calendar,
  ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

/*  helpers  */
const STATUS_CONFIG = {
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    label: "Pending Review",
  },
  approved: {
    icon: BadgeCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    label: "Approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    label: "Rejected",
  },
} as const;

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Convert an ISO date string to YYYY-MM-DD for a date input's value */
function toDateInputValue(iso?: string) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

const Page = () => {
  const router = useRouter();

  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    isLoading,
    riderProfile,
    actions: { submitRiderLicense, uploadImages },
  } = useSession(
    useShallow((state) => ({
      isLoading: state.isLoading,
      riderProfile: state.riderProfile,
      actions: state.actions,
    })),
  );

  const status = riderProfile?.licenseStatus;

  // A license is only "submitted" if the API has returned actual license data.
  // licenseStatus defaults to "pending" for all riders even before submission,
  // so we check the presence of real document fields instead.
  const hasSubmitted = !!(
    riderProfile?.licenseFrontImageUri || riderProfile?.licenseNumber
  );

  const isPending = hasSubmitted && status === "pending";
  const isRejected = hasSubmitted && status === "rejected";

  const cfg = status
    ? (STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
      STATUS_CONFIG.pending)
    : null;

  // Existing image URIs (used as fallback for slots left unchanged during edit)
  const existingUris = [
    riderProfile?.licenseFrontImageUri,
    riderProfile?.licenseBackImageUri,
    riderProfile?.licenseSelfieImageUri,
  ];

  const enterEditMode = () => {
    // Pre-populate form fields with currently submitted data
    setLicenseNumber(riderProfile?.licenseNumber ?? "");
    setLicenseExpiryDate(toDateInputValue(riderProfile?.licenseExpiryDate));
    setPreviews([null, null, null]); // reset image slots (existing URIs used as fallback)
    setIsEditing(true);
  };

  const onSubmit = async () => {
    if (!licenseNumber.trim()) {
      toast.error("License number is required");
      return;
    }

    if (
      !licenseExpiryDate ||
      new Date(licenseExpiryDate).getTime() <= Date.now()
    ) {
      toast.error("License expiry date must be in the future");
      return;
    }

    // When editing, images are optional — reuse existing URIs for any slot left empty
    const needAllImages = !hasSubmitted;
    if (needAllImages && previews.some((p) => p == null)) {
      toast.error("Front, back, and selfie license images are required");
      return;
    }

    try {
      const uris = await Promise.all(
        previews.map(async (preview, i) => {
          if (preview) {
            return uploadImages({
              uploadType: "verification_document",
              imageFile: preview.image.imageFile,
            });
          }
          // Fall back to the already-uploaded URI
          return existingUris[i] ?? "";
        }),
      );

      if (uris.some((uri) => !uri)) throw new Error("Upload failed");

      const success = await submitRiderLicense({
        licenseNumber: licenseNumber.trim(),
        licenseExpiryDate,
        licenseFrontImageUri: uris[0]!,
        licenseBackImageUri: uris[1]!,
        licenseSelfieImageUri: uris[2]!,
      });
      if (success) {
        setIsEditing(false);
        router.push("/rider/account");
      }
    } catch {
      toast.error("License upload failed");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">
        License verification
      </HeadingHeebo>

      <Card className="w-full max-w-7xl rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-6">
          {/*  Already submitted — view mode  */}
          {hasSubmitted && !isEditing ? (
            <div className="flex flex-col gap-5">
              {/* Status banner */}
              {cfg && (
                <div
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg.bg} ${cfg.border}`}
                >
                  <cfg.icon size={18} className={cfg.color} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isPending &&
                        "Your license is being reviewed. We'll notify you once it's processed."}
                      {status === "approved" &&
                        "Your license has been verified. You can now book self-drive rentals."}
                      {isRejected &&
                        "Your submission was rejected. Please resubmit with valid documents."}
                    </p>
                  </div>
                </div>
              )}

              {/* License details */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3">
                  <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-100">
                    <CreditCard size={14} className="text-gray" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray">License number</p>
                    <p className="text-sm font-semibold text-black font-mono tracking-wide">
                      {riderProfile?.licenseNumber ?? "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl bg-background px-4 py-3">
                  <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0 border border-gray-100">
                    <Calendar size={14} className="text-gray" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray">Expiry date</p>
                    <p className="text-sm font-semibold text-black">
                      {fmtDate(riderProfile?.licenseExpiryDate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Document images */}
              {existingUris.some(Boolean) && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon size={13} className="text-gray" />
                    <p className="text-xs font-semibold text-gray uppercase tracking-wide">
                      Submitted documents
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Front", "Back", "Selfie"] as const).map((label, i) =>
                      existingUris[i] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <div key={label} className="flex flex-col gap-1">
                          <p className="text-xs text-gray ml-0.5">{label}</p>
                          <img
                            src={existingUris[i]}
                            alt={`${label} of license`}
                            className="w-full h-64 object-cover rounded-xl border border-gray-100"
                          />
                        </div>
                      ) : (
                        <div key={label} className="flex flex-col gap-1">
                          <p className="text-xs text-gray ml-0.5">{label}</p>
                          <div className="w-full h-24 rounded-xl bg-background border border-dashed border-gray-2 flex items-center justify-center">
                            <ImageIcon size={20} className="text-gray-300" />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Edit button */}
              <button
                onClick={enterEditMode}
                className="flex items-center gap-2 self-start text-xs font-semibold text-primary bg-primaryLight2 hover:bg-primaryLight hover:text-primary-deep px-4 py-2 rounded-xl transition-colors"
              >
                <Pencil size={13} />
                {isRejected ? "Resubmit license" : "Edit details"}
              </button>
            </div>
          ) : (
            /*  Submission / Edit form  */
            <div className="flex flex-col gap-6">
              {!hasSubmitted && (
                <p className="text-sm text-gray-5">
                  Self-drive rentals require a verified driver's license before
                  checkout.
                </p>
              )}

              {isEditing && (
                <div
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${cfg?.bg ?? "bg-amber-50"} ${cfg?.border ?? "border-amber-200"}`}
                >
                  <Pencil
                    size={16}
                    className={cfg?.color ?? "text-amber-600"}
                  />
                  <p
                    className={`text-sm font-semibold ${cfg?.color ?? "text-amber-600"}`}
                  >
                    {isRejected
                      ? "Resubmitting your license"
                      : "Editing your submission"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* License number */}
                <label className="flex flex-col gap-2 sm:col-span-3 text-sm font-medium">
                  License number
                  <input
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="h-12 rounded-xl bg-background px-4 text-sm outline-none border border-gray-200 focus:border-primary transition-colors"
                    placeholder="Enter your license number"
                    maxLength={20}
                    disabled={isLoading}
                  />
                </label>

                {/* Expiry date */}
                <label className="flex flex-col gap-2 sm:col-span-3 text-sm font-medium">
                  Expiry date
                  <input
                    type="date"
                    value={licenseExpiryDate}
                    onChange={(e) => setLicenseExpiryDate(e.target.value)}
                    className="h-12 rounded-xl bg-background px-4 text-sm outline-none border border-gray-200 focus:border-primary transition-colors"
                    disabled={isLoading}
                  />
                </label>

                {/* Image upload slots */}
                {(["Front", "Back", "Selfie"] as const).map((label, index) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-gray-600">{label}</p>
                    <UploadingImagesReusableComponent
                      index={index}
                      previews={previews}
                      setPreviews={setPreviews}
                      className="justify-center items-center rounded-xl bg-background text-placeholder w-full h-28 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
                      imageToastDescription={`${label} license image`}
                    >
                      {/* Show existing image as background hint when editing */}
                      {isEditing && existingUris[index] && !previews[index] ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={existingUris[index]}
                            alt={`Current ${label}`}
                            className="w-full h-full object-cover rounded-xl opacity-40"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                            <UploadImageIcon />
                            <p className="text-xs text-gray font-medium">
                              Tap to replace
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 justify-center items-center text-center">
                          <UploadImageIcon />
                          <p className="text-xs font-medium text-gray">
                            {label}
                          </p>
                        </div>
                      )}
                    </UploadingImagesReusableComponent>
                    {isEditing && existingUris[index] && !previews[index] && (
                      <p className="text-xs text-gray-400 text-center">
                        Keeping current image
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="text-sm text-gray-5 hover:text-gray-4 transition-colors self-start"
                >
                  ← Cancel
                </button>
              )}

              <AuthBackAndContinueButton
                backActive={!isLoading}
                continueActive={!isLoading}
                continueFnc={onSubmit}
                continueIsLoading={isLoading}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
