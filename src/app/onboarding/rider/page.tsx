"use client";

import { DatePicker, SelectDropdown } from "@/components";
import { cn } from "@/lib/utils";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const router = useRouter();

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] -mt-10 px-8 py-10 bg-[#EFF1F1] text-black'>
      <div className='flex flex-col gap-1'>
        <p className='font-semibold text-2xl text-center'>
          Lets get you started
        </p>
        <p className='text-sm text-center'>
          Tell us a bit about yourself to help us set up your account.
        </p>
      </div>
      <div className='flex gap-4 px-4 py-7 rounded-lg bg-icons'>
        <p>icon</p>
        <p className='font-semibold text-base'>Rider</p>
      </div>

      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-sm ml-5'>First Name</p>
          <input
            className='bg-white h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder'
            placeholder='John'
          />
        </div>
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-sm ml-5'>Last Name</p>
          <input
            className='bg-white h-16 rounded-2xl px-4 text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder'
            placeholder='Doe'
          />
        </div>
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

      <div className='flex justify-between items-center'>
        <button
          onClick={() => router.back()}
          className='flex gap-3 items-center cursor-pointer'
        >
          <div className='flex justify-center items-center rounded-full bg-primary w-14 aspect-square rotate-180'>
            <WhiteGreaterThanIcon />
          </div>
          <p className='text-sm'>Back</p>
        </button>
        <button
          className={cn(
            "flex gap-3 items-center cursor-pointer"
            // otpValue.length !== 4 && "cursor-not-allowed"
          )}
        >
          <p className='text-sm'>Continue</p>
          <div
            className={cn(
              "flex justify-center items-center rounded-full w-14 aspect-square transition-colors duration-500 bg-primary"
              //   otpValue.length === 4 ? "bg-primary" : "bg-inactive"
            )}
          >
            <WhiteGreaterThanIcon />
          </div>{" "}
        </button>
      </div>
    </div>
  );
};
export default Page;
