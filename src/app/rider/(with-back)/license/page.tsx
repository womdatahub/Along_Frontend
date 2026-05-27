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
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

/*  helpers  */
const STATUS_CONFIG = {
  pending:  { icon: Clock,       color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   label: "Pending Review" },
  approved: { icon: BadgeCheck,  color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "Approved" },
  rejected: { icon: XCircle,     color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200",    label: "Rejected" },
} as const;

function maskLicense(num?: string) {
  if (!num) return "···· ···· ····";
  const last4 = num.slice(-4);
  return `···· ···· ${last4}`;
}

function fmtDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  const hasSubmitted = !!status && status !== "not submitted";
  const isPending = status === "pending";
  const isRejected = status === "rejected";
  const canEdit = isPending || isRejected;

  const cfg = status
    ? (STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
      STATUS_CONFIG.pending)
    : null;

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

    if (previews.some((preview) => preview == null)) {
      toast.error("Front, back, and selfie license images are required");
      return;
    }

    try {
      const uris = await Promise.all(
        previews.map((preview) =>
          uploadImages({
            uploadType: "verification_document",
            imageFile: preview!.image.imageFile,
          }),
        ),
      );
      if (uris.some((uri) => !uri)) throw new Error("Upload failed");
      const success = await submitRiderLicense({
        licenseNumber: licenseNumber.trim(),
        licenseExpiryDate,
        licenseFrontImageUri: uris[0],
        licenseBackImageUri: uris[1],
        licenseSelfieImageUri: uris[2],
      });
      if (success) {
        setIsEditing(false);
        router.push("/rider/account");
      }
    } catch {
      toast.error("License upload failed");
    }
  };

  /*  */

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">
        License verification
      </HeadingHeebo>

      <Card className="w-full max-w-7xl rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-6">
          {/*  Already submitted  */}
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

              {/* Submission detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: CreditCard,
                    label: "License number",
                    value: maskLicense(riderProfile?.riderLicenseNumber),
                  },
                  {
                    icon: Calendar,
                    label: "Expiry date",
                    value: fmtDate(riderProfile?.riderLicenseExpiryDate),
                  },
                  {
                    icon: Mail,
                    label: "Email on file",
                    value: riderProfile?.email ?? "—",
                    span: true,
                  },
                ].map(({ icon: Icon, label, value, span }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-xl bg-background px-4 py-3 ${span ? "sm:col-span-2" : ""}`}
                  >
                    <div className="size-8 rounded-lg bg-background-1 flex items-center justify-center shrink-0">
                      <Icon size={14} className="text-gray" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray">{label}</p>
                      <p className="text-sm font-semibold text-black truncate">
                        {value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Edit / Resubmit button */}
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 self-start text-xs font-semibold text-primary bg-primaryLight2 hover:bg-primaryLight hover:text-primary-deep px-4 py-2 rounded-xl transition-colors"
                >
                  <Pencil size={13} />
                  {isRejected ? "Resubmit license" : "Update submission"}
                </button>
              )}
            </div>
          ) : (
            /*  Upload / Edit form  */
            <div className="flex flex-col gap-6">
              {!hasSubmitted && (
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-5">
                    Self-drive rentals require a reviewed driver license before
                    checkout.
                  </p>
                </div>
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
                      : "Updating your submission"}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex flex-col gap-2 sm:col-span-3 text-sm font-medium">
                  License number
                  <input
                    value={licenseNumber}
                    onChange={(event) => setLicenseNumber(event.target.value)}
                    className="h-12 rounded-xl bg-background px-4 text-sm outline-none"
                    placeholder="Enter license number"
                    disabled={isLoading}
                  />
                </label>
                <label className="flex flex-col gap-2 sm:col-span-3 text-sm font-medium">
                  Expiry date
                  <input
                    type="date"
                    value={licenseExpiryDate}
                    onChange={(event) =>
                      setLicenseExpiryDate(event.target.value)
                    }
                    className="h-12 rounded-xl bg-background px-4 text-sm outline-none"
                    disabled={isLoading}
                  />
                </label>
                {["Front", "Back", "Selfie"].map((label, index) => (
                  <UploadingImagesReusableComponent
                    key={label}
                    index={index}
                    previews={previews}
                    setPreviews={setPreviews}
                    className="justify-center items-center rounded-[10px] bg-background text-placeholder w-full h-28"
                    imageToastDescription={`${label} license image`}
                  >
                    <div className="flex flex-col gap-2 justify-center items-center text-center">
                      <UploadImageIcon />
                      <p className="text-sm font-medium">{label}</p>
                    </div>
                  </UploadingImagesReusableComponent>
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
