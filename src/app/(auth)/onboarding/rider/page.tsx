"use client";

import {
  AuthBackAndContinueButton,
  CustomAuthInput,
  DatePicker,
  SelectDropdown,
} from "@/components";
import { HeadingHeebo } from "@/components";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] -mt-10 px-8 py-10 bg-[#EFF1F1] text-black'>
      <div className='flex flex-col gap-1'>
        <HeadingHeebo>Lets get you started</HeadingHeebo>
        <p className='text-sm text-center'>
          Tell us a bit about yourself to help us set up your account.
        </p>
      </div>
      <div className='flex gap-4 px-4 py-7 rounded-lg bg-icons items-center'>
        <Image
          src='/images/passenger.png'
          alt={"driver"}
          width={40}
          height={40}
        />
        <p className='font-semibold text-base'>Rider</p>
      </div>

      <div className='flex flex-col gap-4'>
        <CustomAuthInput label='First Name' placeholder='John' />
        <CustomAuthInput label='Last Name' placeholder='Doe' />

        <DatePicker
          date={date}
          open={open}
          setOpen={setOpen}
          setDate={setDate}
          label='Date of birth'
          placeholder='MM/DD/YYYY'
        />

        <div className='flex flex-col gap-1'>
          <p className='font-medium text-sm ml-5'>Gender</p>
          <SelectDropdown
            triggerLabel='Select gender'
            options={["Male", "Female"]}
          />
        </div>
      </div>

      <AuthBackAndContinueButton
        backActive
        continueActive
        continuePath='/onboarding/user-type'
      />
    </div>
  );
};
export default Page;
