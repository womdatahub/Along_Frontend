"use client";
import { AddInput, AuthBackAndContinueButton } from "@/components";
import { UploadingImagesReusableComponent } from "@/components";
import {
  socialSecurityNumberSchema,
  TSocialSecurityNumberSchemaValidator,
} from "@/lib";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPhotoIcon,
  UploadImageIcon,
} from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";
import { FileText, Camera, CreditCard, User } from "lucide-react";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >(Array(4).fill(null));

  const {
    isLoading,
    actions: { addVerificationDocumentsAndServices, uploadImages },
  } = useSession(
    useShallow((state) => ({
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSocialSecurityNumberSchemaValidator>({
    defaultValues: {
      socialSecurityNumber: "",
    },
    resolver: zodResolver(socialSecurityNumberSchema),
  });

  const router = useRouter();

  const onSubmit = async (v: TSocialSecurityNumberSchemaValidator) => {
    if (previews.some((p) => p == null)) {
      toast.error("All images are required");
      return;
    }

    try {
      const uris: string[] = await Promise.all(
        previews.map((p, i) =>
          uploadImages({
            uploadType: i === 0 ? "profile" : "verification_document",
            imageFile: p!.image.imageFile,
          }),
        ),
      ).then((results) => {
        if (results.some((r) => !r)) {
          throw new Error("Upload failed");
        }
        return results as string[];
      });

      const isSuccess = await addVerificationDocumentsAndServices({
        driverSocialSecurityNumber: v.socialSecurityNumber,
        driverProfilePictureUri: uris[0],
        driverLincenseFrontViewUri: uris[1],
        driverLincenseBackViewUri: uris[2],
        advancedVerificationUri: uris[3],
      });

      if (!isSuccess) return;

      router.push("/onboarding/vehicle-info");
    } catch {
      toast.error("Image uploads failed!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Verification documents
          </h1>
          <p className="text-gray text-sm font-light">
            Upload your documents to get verified
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Step badge */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-2 w-fit">
            <div className="size-2 rounded-full bg-primary" />
            <span className="text-xs font-medium text-gray-4">Step 3 of 4</span>
          </div>

          {/* Profile photo */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <User size={14} className="text-gray" />
              <p className="font-semibold text-sm text-black">Profile photo</p>
            </div>
            <UploadingImagesReusableComponent
              key={0}
              index={0}
              previews={previews}
              setPreviews={setPreviews}
              className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-32 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
              imageToastDescription="Profile image"
            >
              <div className="flex flex-col gap-2 justify-center items-center">
                <Camera size={24} className="text-gray" />
                <p className="text-sm font-medium text-gray">
                  Upload profile photo
                </p>
              </div>
            </UploadingImagesReusableComponent>
          </div>

          {/* SSN */}
          <AddInput
            label="Social Security Number"
            id="socialSecurityNumber"
            errors={errors}
            placeholder="AAA-GG-SSSS"
            register={register}
            disabled={false}
            required
            type="text"
            icon={<FileText size={16} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />

          {/* Driver's license */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <CreditCard size={14} className="text-gray" />
              <p className="font-semibold text-sm text-black">
                Driver&apos;s license
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-gray font-light ml-1">Front side</p>
                <UploadingImagesReusableComponent
                  key={1}
                  index={1}
                  previews={previews}
                  setPreviews={setPreviews}
                  className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-24 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
                  imageToastDescription="Front of the driver license"
                >
                  <div className="flex flex-col gap-1.5 justify-center items-center">
                    <UploadImageIcon />
                    <p className="text-xs font-medium text-gray">Front</p>
                  </div>
                </UploadingImagesReusableComponent>
              </div>

              <div className="flex flex-col gap-1.5">
                <p className="text-xs text-gray font-light ml-1">Back side</p>
                <UploadingImagesReusableComponent
                  key={2}
                  index={2}
                  previews={previews}
                  setPreviews={setPreviews}
                  className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-24 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
                  imageToastDescription="Back of the driver license"
                >
                  <div className="flex flex-col gap-1.5 justify-center items-center">
                    <UploadImageIcon />
                    <p className="text-xs font-medium text-gray">Back</p>
                  </div>
                </UploadingImagesReusableComponent>
              </div>
            </div>
          </div>

          {/* Advanced verification */}
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <Camera size={14} className="text-gray" />
                <p className="font-semibold text-sm text-black">
                  Advanced verification
                </p>
              </div>
              <p className="text-xs text-gray font-light ml-5">
                Upload a photo of you holding your driver&apos;s license
              </p>
            </div>
            <UploadingImagesReusableComponent
              key={3}
              index={3}
              previews={previews}
              setPreviews={setPreviews}
              className="justify-center items-center rounded-2xl bg-white text-placeholder w-full h-28 border-2 border-dashed border-gray-2 hover:border-primary transition-colors duration-200"
              imageToastDescription="Advanced verification photo"
            >
              <div className="flex flex-col gap-2 justify-center items-center">
                <AddPhotoIcon />
                <p className="text-sm font-medium text-gray">Upload photo</p>
              </div>
            </UploadingImagesReusableComponent>
          </div>

          <AuthBackAndContinueButton
            backActive={!isLoading}
            continueActive={!isLoading}
            continueFnc={handleSubmit(onSubmit)}
            continueIsLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
