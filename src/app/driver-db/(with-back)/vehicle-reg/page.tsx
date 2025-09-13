"use client";

import { Button, CustomAuthInput } from "@/components";
import { HeadingHeebo } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/UploadingImagesReusableComponent";
import { ImageType } from "@/types";
import { UploadImageIcon } from "@public/svgs";
import { useState } from "react";

const Page = () => {
  const [previews, setPreviews] = useState<(ImageType | null)[]>([
    null,
    null,
    null,
    null,
    null,
  ]);
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-white text-black mb-32'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Registration</HeadingHeebo>
        <p className='text-left text-sm w-[65%]'>
          Enter your car details to complete your registration and access
          related services{" "}
        </p>
      </div>
      <div className='flex flex-col gap-8'>
        <CustomAuthInput
          label='Car make'
          placeholder='Tesla'
          className='flex-1 '
          inputClassName='bg-[#EFF1F1]'
        />
        <CustomAuthInput
          label='Car model'
          placeholder='Model Y'
          className='flex-1 '
          inputClassName='bg-[#EFF1F1]'
        />
        <CustomAuthInput
          label='Car ID number'
          placeholder='0000000000000000000'
          className='flex-1 '
          inputClassName='bg-[#EFF1F1]'
        />
        <div className='flex gap-4'>
          <CustomAuthInput
            label='Car color'
            placeholder='Beige white'
            className='flex-1 '
            inputClassName='bg-[#EFF1F1]'
          />
          <CustomAuthInput
            label='Year'
            placeholder='2025'
            className='flex-1'
            inputClassName='bg-[#EFF1F1]'
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
            className='justify-center items-center rounded-[10px] bg-[#EFF1F1] text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-[#EFF1F1] text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-[#EFF1F1] text-placeholder self-end w-full h-[80px]'
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
            className='justify-center items-center rounded-[10px] bg-[#EFF1F1] text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>
            Insurance document
          </label>
          <UploadingImagesReusableComponent
            key={4}
            index={4}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-[#EFF1F1] text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <UploadImageIcon />
              <p className='text-sm font-medium'>Upload Photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>
      <Button className='rounded-xl w-fit text-sm'>Save</Button>
    </div>
  );
};
export default Page;
