"use client";
import { AuthBackAndContinueButton } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/UploadingImagesReusableComponent";
import { ImageType } from "@/types";
import { AddPhotoIcon, DriverInformationIcon } from "@public/svgs";
import { useState } from "react";

const Page = () => {
  const [previews, setPreviews] = useState<(ImageType | null)[]>([
    null,
    null,
    null,
  ]);
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black'>
      <div className='flex flex-col gap-5'>
        <div className='flex flex-col'>
          <div className='flex flex-col gap-1 justify-center items-center w-fit'>
            <DriverInformationIcon />
            <p className='font-semibold text-lg'>Driver Information</p>
          </div>
          <UploadingImagesReusableComponent
            key={0}
            index={0}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-[157px] h-[98px]'
            imageToastDescription='Profile image'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <AddPhotoIcon />
              <p className='text-sm font-medium'>Profile photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
      </div>
      <AuthBackAndContinueButton
        backActive
        continueActive
        continuePath='/onboarding/vehicle-info'
      />
    </div>
  );
};
export default Page;
