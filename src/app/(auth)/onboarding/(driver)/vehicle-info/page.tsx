"use client";

import { cn } from "@/lib/utils";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black'>
      <p className='font-semibold text-2xl text-center'>Register a User</p>
      <div className='flex flex-col gap-4'>
        <p className='text-center text-sm'>
          Please select an option to register:
        </p>
        <button
          onClick={() => {
            setSelected("rider");
            router.push("/onboarding/rider");
          }}
          className={cn(
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500",
            selected === "rider" && "bg-icons'"
          )}
        >
          <p>icon</p>
          <p className='font-semibold text-base'>Rider</p>
        </button>
        <button
          onClick={() => {
            setSelected("driver");
            router.push("/onboarding/terms");
          }}
          className={cn(
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500",
            selected === "driver" && "bg-icons'"
          )}
        >
          <p>icon</p>
          <p className='font-semibold text-base'>Driver</p>
        </button>
      </div>
      <div className='flex justify-between items-center'>
        <button className='flex gap-3 items-center cursor-not-allowed'>
          <div className='flex justify-center items-center rounded-full bg-inactive  w-14 aspect-square rotate-180'>
            <WhiteGreaterThanIcon />
          </div>
          <p className='text-sm'>Back</p>
        </button>
        <button className={cn("flex gap-3 items-center cursor-pointer")}>
          <p className='text-sm'>Continue</p>
          <div
            className={cn(
              "flex justify-center items-center rounded-full w-14 aspect-square transition-colors duration-500"
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
