"use client";

import { AddInput, AuthBackAndContinueButton } from "@/components";
import { HeadingHeebo } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import {
  TSocialSecurityNumberSchemaValidator,
  TVehicleRegistrationSchemaValidator,
  socialSecurityNumberSchema,
  vehicleRegistrationSchema,
} from "@/lib";
import { useSession } from "@/store";
import { ImageType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >([null, null, null, null, null]);

  const [imagesUri, setImagesUri] = useState<string[]>([]);
  const {
    actions: { uploadImages, registerVehicle },
  } = useSession((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TVehicleRegistrationSchemaValidator>({
    defaultValues: {
      vehicleMake: "",
      vehicleModel: "",
      vehicleColor: "",
      vehicleIdentificationNumber: "",
      vehicleYear: "",
    },
    resolver: zodResolver(vehicleRegistrationSchema),
  });

  const router = useRouter();

  const onSubmit = async (v: TVehicleRegistrationSchemaValidator) => {
    console.log(v, errors);
    if (previews.includes(null)) {
      toast.error("All images are required");
      return;
    }

    // for (let i = 0; i < previews.length; i++) {
    //   const uri = await uploadImages({
    //     uploadType: "vehicle",
    //     imageFile: previews[i]?.image.imageFile as ImageType["imageFile"],
    //   });
    //   if (!uri) return;
    //   setImagesUri((prev) => [...prev, uri]);
    // }

    const isSuccess = await registerVehicle({
      ...v,
      vehicleFrontViewImageUri: imagesUri[0],
      vehicleBackViewImageUri: imagesUri[1],
      vehicleSideViewImageUri: imagesUri[2],
      insuranceDocumentUri: imagesUri[3],
    });
    if (!isSuccess) return;
    router.push("/onboarding/vehicle-insurance");
  };
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Registration</HeadingHeebo>
        <p className='text-center text-sm'>
          Enter your car details to complete your registration and access
          related services{" "}
        </p>
      </div>
      <div className='flex flex-col gap-8'>
        <AddInput
          label='Car make'
          placeholder='Tesla'
          id='vehicleMake'
          errors={errors}
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <AddInput
          label='Car model'
          placeholder='Model Y'
          id='vehicleModel'
          errors={errors}
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <AddInput
          label='Car ID number'
          placeholder='0000000000000000000'
          id='vehicleIdentificationNumber'
          errors={errors}
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <div className='flex gap-4'>
          <AddInput
            label='Car color'
            placeholder='Beige white'
            id='vehicleColor'
            errors={errors}
            register={register}
            disabled={false}
            required
            type='text'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
          <AddInput
            label='Year'
            placeholder='2025'
            id='vehicleYear'
            errors={errors}
            register={register}
            disabled={false}
            required
            type='text'
            iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
            inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          />
        </div>
      </div>
      <div className='flex flex-col gap-8 mt-5 text-center'>
        <div className='flex flex-col gap-1'>
          <p className='font-bold text-base'>Car pictures</p>
          <p className='text-sm font-medium text-[#858585]'>
            Take and upload clear photos of your car’s front, side and back,
            registration and insurance. This helps verify your vehicle.
          </p>
        </div>
        <div className='flex gap-5'>
          <UploadingImagesReusableComponent
            key={0}
            index={0}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Side front</p>
            </div>
          </UploadingImagesReusableComponent>
          <UploadingImagesReusableComponent
            key={1}
            index={1}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Back of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Interior</p>
            </div>
          </UploadingImagesReusableComponent>
          <UploadingImagesReusableComponent
            key={2}
            index={2}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Back of the driver license'
          >
            <div className='flex gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Side rear</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>Car registration</label>
          <UploadingImagesReusableComponent
            key={3}
            index={3}
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
        continueFnc={handleSubmit(onSubmit)}
        // router.push("/onboarding/vehicle-insurance");

        // continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;
