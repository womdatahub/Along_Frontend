"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
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
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500 items-center",
            selected === "rider" && "bg-icons'"
          )}
        >
          <Image
            src='/images/passenger.png'
            alt={"rider"}
            width={40}
            height={40}
          />
          <p className='font-semibold text-base'>Rider</p>
        </button>
        <button
          onClick={() => {
            setSelected("driver");
            router.push("/onboarding/terms");
          }}
          className={cn(
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500 items-center",
            selected === "driver" && "bg-icons'"
          )}
        >
          <Image
            src='/images/driver.png'
            alt={"driver"}
            width={40}
            height={40}
          />
          <p className='font-semibold text-base'>Driver</p>
        </button>
      </div>
    </div>
  );
};
export default Page;
