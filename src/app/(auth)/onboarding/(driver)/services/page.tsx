"use client";

import { cn } from "@/lib/utils";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((opt) => opt !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black'>
      <div className='flex flex-col gap-2'>
        <p className='font-semibold text-2xl text-center'>Offered services</p>
        <p className='text-center text-sm'>
          Please select a service (s) you are interested in
        </p>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-1 last:rounded-b-2xl first:rounded-t-2xl'>
          <button
            onClick={() => {
              toggleOption("rental");
            }}
            className={cn(
              "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl"
            )}
          >
            <div className='flex gap-4 items-center'>
              <p>icon</p>
              <p className='font-medium text-xs'>Ride Rental</p>
            </div>
            <div
              className={cn(
                "size-4 bg-[#BBCCCF80]",
                selectedOptions.includes("rental") && "bg-primary"
              )}
            />
          </button>
          <button
            onClick={() => {
              toggleOption("scheduled");
            }}
            className={cn(
              "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl"
            )}
          >
            <div className='flex gap-4 items-center'>
              <p>icon</p>
              <p className='font-medium text-xs'>Scheduled Ride</p>
            </div>
            <div
              className={cn(
                "size-4 bg-[#BBCCCF80]",
                selectedOptions.includes("scheduled") && "bg-primary"
              )}
            />
          </button>

          <button
            onClick={() => {
              toggleOption("logistics");
            }}
            className={cn(
              "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl"
            )}
          >
            <div className='flex gap-4 items-center'>
              <p>icon</p>
              <p className='font-medium text-xs'>Logistics</p>
            </div>
            <div
              className={cn(
                "size-4 bg-[#BBCCCF80]",
                selectedOptions.includes("logistics") && "bg-primary"
              )}
            />
          </button>
          <div className='flex justify-between items-center gap-3 px-4 mt-3'>
            <p>Select all</p>
            <div
              onClick={() =>
                setSelectedOptions(["rental", "scheduled", "logistics"])
              }
              className={cn(
                "size-4 bg-[#BBCCCF80] cursor-pointer",
                selectedOptions.length === 3 && "bg-primary"
              )}
            />
          </div>
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
          onClick={() => {
            if (selectedOptions.length > 0)
              router.push("/onboarding/driver-info");
          }}
          className={cn(
            "flex gap-3 items-center cursor-pointer"
            // otpValue.length !== 4 && "cursor-not-allowed"
          )}
        >
          <p className='text-sm'>Continue</p>
          <div
            className={cn(
              "flex justify-center items-center rounded-full w-14 aspect-square transition-colors duration-500 bg-primary",
              selectedOptions.length > 0
                ? "bg-primary"
                : "bg-inactive cursor-not-allowed"
            )}
          >
            <WhiteGreaterThanIcon />
          </div>
        </button>
      </div>
    </div>
  );
};
export default Page;
