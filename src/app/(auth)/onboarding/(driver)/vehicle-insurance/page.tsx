"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  HeadingHeebo,
} from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import { onboardingSchema, TOnboardingValidator } from "@/lib";
import { ImageType } from "@/types";
import { CalenderIcon, UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >(Array(1).fill(null));

  const {
    register,
    // handleSubmit,
    formState: { errors },
  } = useForm<TOnboardingValidator>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(onboardingSchema),
  });
  const router = useRouter();

  //   const onSubmit = async (v: TVehicleRegistrationSchemaValidator) => {
  //   if (previews.some((p) => p == null)) {
  //     toast.error("All images are required");
  //     return;
  //   }

  //   try {
  //     const uris: string[] = await Promise.all(
  //       previews.map((p) =>
  //         uploadImages({
  //           uploadType: "vehicle",
  //           imageFile: p!.image.imageFile,
  //         }),
  //       ),
  //     ).then((results) => {
  //       if (results.some((r) => !r)) {
  //         throw new Error("Upload failed");
  //       }
  //       return results as string[];
  //     });

  //     const isSuccess = await registerVehicle({
  //       ...v,
  //       vehicleFrontViewImageUri: uris[0],
  //       vehicleBackViewImageUri: uris[1],
  //       vehicleSideViewImageUri: uris[2],
  //       insuranceDocumentUri: uris[3],
  //     });

  //     if (!isSuccess) return;
  //     router.push("/onboarding/vehicle-insurance");
  //   } catch {
  //     toast.error("Image uploads failed!");
  //   }
  // };
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Insurance</HeadingHeebo>
      </div>
      <div className='flex flex-col gap-8'>
        <AddInput
          id='email'
          errors={errors}
          label='Name of Insurance company'
          placeholder='American insurance'
          register={register}
          disabled={false}
          required
          type='text'
          isReverse
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />

        <AddInput
          id='email'
          errors={errors}
          label='Insurance policy number'
          placeholder='00000000000000'
          register={register}
          disabled={false}
          required
          type='text'
          isReverse
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />

        <div className='flex gap-4'>
          <AddInput
            id='email'
            label='Issued date'
            errors={errors}
            placeholder='DD/MM/YYY'
            register={register}
            disabled={false}
            required
            type='text'
            isReverse
            icon={<CalenderIcon />}
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />

          <AddInput
            id='email'
            label='Expiry date'
            errors={errors}
            placeholder='Phone Number'
            register={register}
            disabled={false}
            required
            type='text'
            isReverse
            icon={<CalenderIcon />}
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16 px-2'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 mb-8 text-center'>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>
            Insurance document
          </label>
          <UploadingImagesReusableComponent
            key={0}
            index={0}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>
      <AuthBackAndContinueButton
        backActive
        continueActive={true}
        continueFnc={() => {
          router.push("/driver-db");
        }}
        // continueIsLoading

        // continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;
