"use client";
import { AddInput, AuthBackAndContinueButton } from "@/components";
import { UploadingImagesReusableComponent } from "@/components";
import {
  socialSecurityNumberSchema,
  TSocialSecurityNumberSchemaValidator,
  userApiStr,
} from "@/lib";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddPhotoIcon,
  DriverInformationIcon,
  UploadImageIcon,
} from "@public/svgs";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UploadState = {
  preview: { image: ImageType; uri: string } | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
};

const Page = () => {
  const [profilePhoto, setProfilePhoto] = useState<UploadState>({
    preview: null,
    uploadedUrl: null,
    isUploading: false,
    error: null,
  });

  const [licenseFront, setLicenseFront] = useState<UploadState>({
    preview: null,
    uploadedUrl: null,
    isUploading: false,
    error: null,
  });

  const [licenseBack, setLicenseBack] = useState<UploadState>({
    preview: null,
    uploadedUrl: null,
    isUploading: false,
    error: null,
  });

  const [advancedVerification, setAdvancedVerification] = useState<UploadState>(
    {
      preview: null,
      uploadedUrl: null,
      isUploading: false,
      error: null,
    },
  );

  const {
    actions: { addVerificationDocumentsAndServices, uploadImages },
  } = useSession((state) => state);

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

  const handleFileSelect = (
    file: ImageType,
    setter: React.Dispatch<React.SetStateAction<UploadState>>,
  ) => {
    console.log("file selected:", file);
    console.log("file.imageFile:", file.imageFile);

    try {
      // Create object URL from the file
      const objectUrl = URL.createObjectURL(file.imageFile as Blob);

      setter((prev) => ({
        ...prev,
        preview: { image: file, uri: objectUrl },
        error: null,
      }));
    } catch (error) {
      console.error("Error creating object URL:", error);
      toast.error("Invalid file selected");
    }
  };

  const handleConfirmUpload = async (
    uploadType: "profile" | "verification_document",
    state: UploadState,
    setter: React.Dispatch<React.SetStateAction<UploadState>>,
    label: string,
  ) => {
    if (!state.preview) return;

    setter((prev) => ({ ...prev, isUploading: true, error: null }));

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append("image", state.preview.image.imageFile as Blob);
      formData.append("uploadType", uploadType);

      // Make the upload request
      const platform = process.env.NEXT_PUBLIC_FRONTEND_PLATFORM ?? "";
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:3000";
      // Make the upload request
      console.log(`${baseUrl}/${userApiStr("/user/upload")}`);
      const test = await uploadImages({
        imageFile: state.preview.image.imageFile as ImageType["imageFile"],
        uploadType: "profile",
      });

      console.log("test", test);

      const response = await fetch(`${baseUrl}${userApiStr("/user/upload")}`, {
        method: "POST",
        body: formData,
        headers: {
          platform,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "Success" && result.data?.url) {
        setter((prev) => ({
          ...prev,
          uploadedUrl: result.data.url,
          isUploading: false,
        }));
        toast.success(`${label} uploaded successfully`);
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setter((prev) => ({
        ...prev,
        isUploading: false,
        error: `Error uploading ${label}`,
      }));
      toast.error(`Error uploading ${label}`);
    }
  };

  const onSubmit = async (v: TSocialSecurityNumberSchemaValidator) => {
    // Validate all files are uploaded
    const validationErrors: string[] = [];

    if (!profilePhoto.uploadedUrl) validationErrors.push("Profile photo");
    if (!licenseFront.uploadedUrl)
      validationErrors.push("Driver's license front");
    if (!licenseBack.uploadedUrl)
      validationErrors.push("Driver's license back");
    if (!advancedVerification.uploadedUrl)
      validationErrors.push("Advanced verification photo");

    if (validationErrors.length > 0) {
      validationErrors.forEach((error) => {
        toast.error(`${error} is required`);
      });

      // Set error states
      if (!profilePhoto.uploadedUrl) {
        setProfilePhoto((prev) => ({ ...prev, error: "Required" }));
      }
      if (!licenseFront.uploadedUrl) {
        setLicenseFront((prev) => ({ ...prev, error: "Required" }));
      }
      if (!licenseBack.uploadedUrl) {
        setLicenseBack((prev) => ({ ...prev, error: "Required" }));
      }
      if (!advancedVerification.uploadedUrl) {
        setAdvancedVerification((prev) => ({ ...prev, error: "Required" }));
      }
      return;
    }

    const isSuccess = await addVerificationDocumentsAndServices({
      driverSocialSecurityNumber: v.socialSecurityNumber,
      driverProfilePictureUri: profilePhoto.uploadedUrl!,
      driverLincenseFrontViewUri: licenseFront.uploadedUrl!,
      driverLincenseBackViewUri: licenseBack.uploadedUrl!,
      advancedVerificationUri: advancedVerification.uploadedUrl!,
    });

    if (!isSuccess) return;
    router.push("/onboarding/vehicle-info");
  };

  const allFilesUploaded = useMemo(
    () =>
      profilePhoto.uploadedUrl &&
      licenseFront.uploadedUrl &&
      licenseBack.uploadedUrl &&
      advancedVerification.uploadedUrl,
    [
      profilePhoto.uploadedUrl,
      licenseFront.uploadedUrl,
      licenseBack.uploadedUrl,
      advancedVerification.uploadedUrl,
    ],
  );
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <div className='flex flex-col gap-1 justify-center items-center w-fit'>
            <DriverInformationIcon />
            <p className='font-semibold text-lg'>Driver Information</p>
          </div>

          <div className='flex flex-col gap-2'>
            <UploadingImagesReusableComponent
              key={0}
              index={0}
              previews={[profilePhoto.preview]}
              setPreviews={(newValue) => {
                const value =
                  typeof newValue === "function"
                    ? newValue([profilePhoto.preview])
                    : newValue;
                if (value[0]) handleFileSelect(value[0].image, setProfilePhoto);
              }}
              className='justify-center items-center rounded-[10px] bg-[#FAFAFA] text-placeholder self-end w-[157px] h-[98px]'
              imageToastDescription='Profile image'
            >
              <div className='flex flex-col gap-2 justify-center items-center'>
                <AddPhotoIcon />
                <p className='text-sm font-medium'>Profile photo</p>
              </div>
            </UploadingImagesReusableComponent>

            {profilePhoto.preview && !profilePhoto.uploadedUrl && (
              <button
                onClick={() =>
                  handleConfirmUpload(
                    "profile",
                    profilePhoto,
                    setProfilePhoto,
                    "Profile photo",
                  )
                }
                disabled={profilePhoto.isUploading}
                className='self-end px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed'
              >
                {profilePhoto.isUploading ? "Uploading..." : "Confirm Upload"}
              </button>
            )}

            {profilePhoto.uploadedUrl && (
              <p className='self-end text-sm text-green-600 font-medium'>
                ✓ Uploaded
              </p>
            )}

            {profilePhoto.error && (
              <p className='self-end text-sm text-red-600 font-medium'>
                {profilePhoto.error}
              </p>
            )}
          </div>
        </div>

        <AddInput
          label='Social Security Number'
          id='socialSecurityNumber'
          errors={errors}
          placeholder='000 000 00000'
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none'
        />

        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>Drivers License</label>
          <div className='flex gap-5'>
            <div className='flex flex-col gap-2 flex-1'>
              <UploadingImagesReusableComponent
                key={1}
                index={0}
                previews={[licenseFront.preview]}
                setPreviews={(setter) => {
                  const newValue =
                    typeof setter === "function"
                      ? setter([licenseFront.preview])
                      : setter;
                  if (newValue[0])
                    handleFileSelect(newValue[0].image, setLicenseFront);
                }}
                className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
                imageToastDescription='Front of the driver license'
              >
                <div className='flex gap-2 justify-center items-center'>
                  <UploadImageIcon />
                  <p className='text-sm font-medium'>Front</p>
                </div>
              </UploadingImagesReusableComponent>

              {licenseFront.preview && !licenseFront.uploadedUrl && (
                <button
                  onClick={() =>
                    handleConfirmUpload(
                      "verification_document",
                      licenseFront,
                      setLicenseFront,
                      "License front",
                    )
                  }
                  disabled={licenseFront.isUploading}
                  className='px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary disabled:bg-gray-400'
                >
                  {licenseFront.isUploading ? "Uploading..." : "Confirm"}
                </button>
              )}

              {licenseFront.uploadedUrl && (
                <p className='text-xs text-green-600 font-medium text-center'>
                  ✓ Uploaded
                </p>
              )}

              {licenseFront.error && (
                <p className='text-xs text-red-600 font-medium text-center'>
                  {licenseFront.error}
                </p>
              )}
            </div>

            <div className='flex flex-col gap-2 flex-1'>
              <UploadingImagesReusableComponent
                key={2}
                index={0}
                previews={[licenseBack.preview]}
                setPreviews={(setter) => {
                  const newValue =
                    typeof setter === "function"
                      ? setter([licenseBack.preview])
                      : setter;
                  if (newValue[0])
                    handleFileSelect(newValue[0].image, setLicenseBack);
                }}
                className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
                imageToastDescription='Back of the driver license'
              >
                <div className='flex gap-2 justify-center items-center'>
                  <UploadImageIcon />
                  <p className='text-sm font-medium'>Back</p>
                </div>
              </UploadingImagesReusableComponent>

              {licenseBack.preview && !licenseBack.uploadedUrl && (
                <button
                  onClick={() =>
                    handleConfirmUpload(
                      "verification_document",
                      licenseBack,
                      setLicenseBack,
                      "License back",
                    )
                  }
                  disabled={licenseBack.isUploading}
                  className='px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary disabled:bg-gray-400'
                >
                  {licenseBack.isUploading ? "Uploading..." : "Confirm"}
                </button>
              )}

              {licenseBack.uploadedUrl && (
                <p className='text-xs text-green-600 font-medium text-center'>
                  ✓ Uploaded
                </p>
              )}

              {licenseBack.error && (
                <p className='text-xs text-red-600 font-medium text-center'>
                  {licenseBack.error}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex flex-col'>
            <label className='font-semibold text-sm ml-5'>
              Advanced Verification
            </label>
            <p className='font-medium text-sm ml-5 text-[#858585]'>
              Please upload a picture of you holding <br />
              your drivers license
            </p>
          </div>

          <UploadingImagesReusableComponent
            key={3}
            index={0}
            previews={[advancedVerification.preview]}
            setPreviews={(setter) => {
              const newValue =
                typeof setter === "function"
                  ? setter([advancedVerification.preview])
                  : setter;
              if (newValue[0])
                handleFileSelect(newValue[0].image, setAdvancedVerification);
            }}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
            imageToastDescription='Advanced verification photo'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <AddPhotoIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>

          {advancedVerification.preview &&
            !advancedVerification.uploadedUrl && (
              <button
                onClick={() =>
                  handleConfirmUpload(
                    "verification_document",
                    advancedVerification,
                    setAdvancedVerification,
                    "Advanced verification",
                  )
                }
                disabled={advancedVerification.isUploading}
                className='px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary disabled:bg-gray-400'
              >
                {advancedVerification.isUploading
                  ? "Uploading..."
                  : "Confirm Upload"}
              </button>
            )}

          {advancedVerification.uploadedUrl && (
            <p className='text-sm text-green-600 font-medium'>✓ Uploaded</p>
          )}

          {advancedVerification.error && (
            <p className='text-sm text-red-600 font-medium'>
              {advancedVerification.error}
            </p>
          )}
        </div>
      </div>

      <AuthBackAndContinueButton
        backActive
        continueActive={!!allFilesUploaded}
        continueFnc={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default Page;
