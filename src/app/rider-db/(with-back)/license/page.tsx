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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const router = useRouter();
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null]);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState("");
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

  const onSubmit = async () => {
    if (!licenseNumber.trim()) {
      toast.error("License number is required");
      return;
    }

    if (!licenseExpiryDate || new Date(licenseExpiryDate).getTime() <= Date.now()) {
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
      if (success) router.push("/rider-db/account");
    } catch {
      toast.error("License upload failed");
    }
  };

  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>License verification</HeadingHeebo>
      <Card className='w-full md:w-130 rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-8'>
          <div className='flex flex-col gap-1'>
            <p className='font-semibold text-sm'>
              Status:{" "}
              <span className='capitalize text-primary'>
                {riderProfile?.licenseStatus ?? "not submitted"}
              </span>
            </p>
            <p className='text-sm text-gray-5'>
              Self-drive rentals require a reviewed driver license before
              checkout.
            </p>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
            <label className='flex flex-col gap-2 sm:col-span-3 text-sm font-medium'>
              License number
              <input
                value={licenseNumber}
                onChange={(event) => setLicenseNumber(event.target.value)}
                className='h-12 rounded-xl bg-background-1 px-4 text-sm outline-none'
                placeholder='Enter license number'
                disabled={isLoading}
              />
            </label>
            <label className='flex flex-col gap-2 sm:col-span-3 text-sm font-medium'>
              Expiry date
              <input
                type='date'
                value={licenseExpiryDate}
                onChange={(event) => setLicenseExpiryDate(event.target.value)}
                className='h-12 rounded-xl bg-background-1 px-4 text-sm outline-none'
                disabled={isLoading}
              />
            </label>
            {["Front", "Back", "Selfie"].map((label, index) => (
              <UploadingImagesReusableComponent
                key={label}
                index={index}
                previews={previews}
                setPreviews={setPreviews}
                className='justify-center items-center rounded-[10px] bg-background-1 text-placeholder w-full h-28'
                imageToastDescription={`${label} license image`}
              >
                <div className='flex flex-col gap-2 justify-center items-center text-center'>
                  <UploadImageIcon />
                  <p className='text-sm font-medium'>{label}</p>
                </div>
              </UploadingImagesReusableComponent>
            ))}
          </div>
          <AuthBackAndContinueButton
            backActive={!isLoading}
            continueActive={!isLoading}
            continueFnc={onSubmit}
            continueIsLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
