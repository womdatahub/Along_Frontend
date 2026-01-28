"use client";

import {
  HeadingHeebo,
  AddInput,
  ButtonWithLoader,
  UploadingImagesReusableComponent,
} from "@/components";
import { ImageType } from "@/types";
import { UploadImageIcon } from "@public/svgs";
import { useState } from "react";
import {
  TVehicleRegistrationSchemaValidator,
  vehicleRegistrationSchema,
} from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const [previews, setPreviews] = useState<
    ({ image: ImageType; uri: string } | null)[]
  >(Array(4).fill(null));

  const {
    isLoading,
    actions: { uploadImages, registerVehicle },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      isLoading: state.isLoading,
    })),
  );

  const {
    register,
    handleSubmit,
    reset,
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

  const onSubmit = async (v: TVehicleRegistrationSchemaValidator) => {
    if (previews.some((p) => p == null)) {
      toast.error("All images are required");
      return;
    }

    try {
      const uris: string[] = await Promise.all(
        previews.map((p) =>
          uploadImages({
            uploadType: "vehicle",
            imageFile: p!.image.imageFile,
          }),
        ),
      ).then((results) => {
        if (results.some((r) => !r)) {
          throw new Error("Upload failed");
        }
        return results as string[];
      });

      const isSuccess = await registerVehicle({
        ...v,
        vehicleFrontViewImageUri: uris[0],
        vehicleBackViewImageUri: uris[1],
        vehicleSideViewImageUri: uris[2],
        insuranceDocumentUri: uris[3],
      });

      if (!isSuccess) return;
      reset();
      setPreviews(Array(4).fill(null));
    } catch {
      toast.error("Image uploads failed!");
    }
  };
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-white text-black'>
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
          iconAndInputWrapperClassName='bg-background-1 rounded-2xl h-16'
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
          iconAndInputWrapperClassName='bg-background-1 rounded-2xl h-16'
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
          iconAndInputWrapperClassName='bg-background-1 rounded-2xl h-16'
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
            iconAndInputWrapperClassName='bg-background-1 rounded-2xl h-16'
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
            iconAndInputWrapperClassName='bg-background-1 rounded-2xl h-16'
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
            className='justify-center items-center rounded-[10px] bg-background-1 text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-background-1 text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-background-1 text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-background-1 text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>

      <ButtonWithLoader
        text='Save'
        className='rounded-xl w-fit text-sm'
        isLoading={isLoading}
        onClick={handleSubmit(onSubmit)}
      />
    </div>
  );
};
export default Page;
