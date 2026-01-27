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
  DriverInformationIcon,
  UploadImageIcon,
} from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >(Array(4).fill(null));

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
              previews={previews}
              setPreviews={setPreviews}
              className='justify-center items-center rounded-[10px] bg-[#FAFAFA] text-placeholder self-end w-[157px] h-[98px]'
              imageToastDescription='Profile image'
            >
              <div className='flex flex-col gap-2 justify-center items-center'>
                <AddPhotoIcon />
                <p className='text-sm font-medium'>Profile photo</p>
              </div>
            </UploadingImagesReusableComponent>
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
                index={1}
                previews={previews}
                setPreviews={setPreviews}
                className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
                imageToastDescription='Front of the driver license'
              >
                <div className='flex gap-2 justify-center items-center'>
                  <UploadImageIcon />
                  <p className='text-sm font-medium'>Front</p>
                </div>
              </UploadingImagesReusableComponent>
            </div>

            <div className='flex flex-col gap-2 flex-1'>
              <UploadingImagesReusableComponent
                key={2}
                index={2}
                previews={previews}
                setPreviews={setPreviews}
                className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
                imageToastDescription='Back of the driver license'
              >
                <div className='flex gap-2 justify-center items-center'>
                  <UploadImageIcon />
                  <p className='text-sm font-medium'>Back</p>
                </div>
              </UploadingImagesReusableComponent>
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
            index={3}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder w-full h-[80px]'
            imageToastDescription='Advanced verification photo'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <AddPhotoIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>

      <AuthBackAndContinueButton
        backActive
        continueActive={true}
        continueFnc={handleSubmit(onSubmit)}
      />
    </div>
  );
};

export default Page;
