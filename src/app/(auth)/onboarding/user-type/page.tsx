"use client";

import {
  AuthBackAndContinueButton,
  HeadingHeebo,
  TermsModal,
} from "@/components";
import { cn } from "@/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<"rider" | "driver" | "">("");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
      <HeadingHeebo>Register a User</HeadingHeebo>
      <div className='flex flex-col gap-4'>
        <p className='text-center text-sm'>
          Please select an option to register:
        </p>
        <button
          onClick={() => {
            setSelected("rider");
          }}
          className={cn(
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-[#87C4C4] transition-colors duration-500 items-center",
            selected === "rider" && "bg-[#87C4C4]",
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
          }}
          className={cn(
            "flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-[#87C4C4] transition-colors duration-500 items-center",
            selected === "driver" && "bg-[#87C4C4]",
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

      <TermsModal
        acceptFunction={() => {
          // setIsTermsAccepted(true);
          setIsTermsModalOpen(false);
          router.push("/onboarding/driver-info");
        }}
        isTermsModalOpen={isTermsModalOpen}
        setIsTermsModalOpen={setIsTermsModalOpen}
        trigger={<></>}
      />

      <AuthBackAndContinueButton
        backActive
        continueActive={!!selected}
        continueFnc={() => {
          if (selected === "driver") {
            setIsTermsModalOpen(true);
            return;
          }
          router.push(`/onboarding/${selected}`);
        }}
      />
    </div>
  );
};
export default Page;
