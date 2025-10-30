"use client";

import { AuthBackAndContinueButton, CustomAuthInput } from "@/components";
import { HeadingHeebo } from "@/components";
import { UploadingImagesReusableComponent } from "@/components/shared/uploading-images-reusable-component";
import { UploadImageIcon } from "@public/svgs";
import { useRouter } from "next/navigation";

const Page = () => {


  const router = useRouter();
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
        <CustomAuthInput label='Car make' placeholder='Tesla' />
        <CustomAuthInput label='Car model' placeholder='Model Y' />
        <CustomAuthInput
          label='Car ID number'
          placeholder='0000000000000000000'
        />
        <div className='flex gap-4'>
          <CustomAuthInput
            label='Car color'
            placeholder='Beige white'
            className='flex-1'
          />
          <CustomAuthInput label='Year' placeholder='2025' />
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
