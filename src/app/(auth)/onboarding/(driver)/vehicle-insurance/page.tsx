"use client";

import { AuthBackAndContinueButton, CustomAuthInput } from "@/components";
import { HeadingHeebo } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import { ImageType } from "@/types";
import { UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [previews, setPreviews] = useState<(ImageType | null)[]>([
    null,
  ]);

  const router = useRouter();
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-2'>
        <HeadingHeebo>Vehicle Insurance</HeadingHeebo>
     
      </div>
      <div className='flex flex-col gap-8'>
        <CustomAuthInput label='Name of Insurance company' placeholder='American insurance' />
        <CustomAuthInput label='Insurance policy number' placeholder='00000000000000' />
 
        <div className='flex gap-4'>
          <CustomAuthInput
            label='Car color'
            placeholder='Beige white'
            className='flex-1'
          />
          <CustomAuthInput label='Year' placeholder='2025' />
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
        // continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;
