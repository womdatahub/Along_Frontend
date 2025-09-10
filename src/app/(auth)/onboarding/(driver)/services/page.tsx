"use client";
import { AuthBackAndContinueButton } from "@/components";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
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
        <div className='flex flex-col gap-1'>
          {items.map((item) => {
            return (
              <button
                key={item.state}
                onClick={() => {
                  toggleOption(item.state);
                }}
                className={cn(
                  "flex gap-4 justify-between items-center px-4 py-7 bg-white cursor-pointer transition-colors duration-500 last:rounded-b-2xl first:rounded-t-2xl"
                )}
              >
                <div className='flex gap-4 items-center'>
                  <Image
                    src={item.img}
                    alt={item.state}
                    width={40}
                    height={40}
                  />
                  <p className='font-medium text-xs'>{item.title}</p>
                </div>
                <div
                  className={cn(
                    "size-4 bg-[#BBCCCF80]",
                    selectedOptions.includes(item.state) && "bg-primary"
                  )}
                />
              </button>
            );
          })}
          <div className='flex justify-between items-center gap-3 px-4 mt-3'>
            <p>Select all</p>
            <div
              onClick={() => setSelectedOptions(items.map((i) => i.state))}
              className={cn(
                "size-4 bg-[#BBCCCF80] cursor-pointer",
                selectedOptions.length === 3 && "bg-primary"
              )}
            />
          </div>
        </div>
      </div>
      <AuthBackAndContinueButton
        backActive
        continueActive={selectedOptions.length > 0}
        continuePath='/onboarding/driver-info'
      />
    </div>
  );
};
export default Page;

const items = [
  {
    state: "rental",
    title: "Ride Rental",
    img: "/images/rental.png",
  },
  {
    state: "scheduled",
    title: "Scheduled Ride",
    img: "/images/scheduled.png",
  },
  {
    state: "logistics",
    title: "Logistics",
    img: "/images/logistics.png",
  },
];
