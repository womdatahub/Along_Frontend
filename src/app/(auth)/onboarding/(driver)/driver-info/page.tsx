"use client";
import { AuthBackAndContinueButton, CustomAuthInput } from "@/components";
import { UploadingImagesReusableComponent } from "@/components";
import { ImageType } from "@/types";
import {
  AddPhotoIcon,
  DriverInformationIcon,
  UploadImageIcon,
} from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [previews, setPreviews] = useState<(ImageType | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const router = useRouter();
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
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
            className='justify-center items-center rounded-[10px] bg-[#FAFAFA] text-placeholder self-end w-[157px] h-[98px]'
            imageToastDescription='Profile image'
          >
            <div className='flex flex-col gap-2 justify-center items-center'>
              <AddPhotoIcon />
              <p className='text-sm font-medium'>Profile photo</p>
            </div>
          </UploadingImagesReusableComponent>
        </div>
        <CustomAuthInput
          label='Social Security Number'
          placeholder='000 000 00000'
        />
        <div className='flex flex-col gap-1'>
          <label className='font-semibold text-sm ml-5'>Driver’s License</label>
          <div className='flex gap-5'>
            <UploadingImagesReusableComponent
              key={1}
              index={1}
              previews={previews}
              setPreviews={setPreviews}
              className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
              imageToastDescription='Front of the driver license'
            >
              <div className='flex gap-2 justify-center items-center'>
                <UploadImageIcon />
                <p className='text-sm font-medium'>Front</p>
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
                <p className='text-sm font-medium'>Back</p>
              </div>
            </UploadingImagesReusableComponent>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-col'>
            <label className='font-semibold text-sm ml-5'>
              Advanced Verification
            </label>
            <p className='font-medium text-sm ml-5 text-[#858585]'>
              Please upload a picture of you holding <br />
              your driver’s license
            </p>
          </div>
          <UploadingImagesReusableComponent
            key={3}
            index={3}
            previews={previews}
            setPreviews={setPreviews}
            className='justify-center items-center rounded-[10px] bg-white text-placeholder self-end w-full h-[80px]'
            imageToastDescription='Front of the driver license'
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
        continueActive
        continueFnc={() => {
          router.push("/onboarding/vehicle-info");
        }}
        //         continuePath='/onboarding/vehicle-info'
      />
    </div>
  );
};
export default Page;
