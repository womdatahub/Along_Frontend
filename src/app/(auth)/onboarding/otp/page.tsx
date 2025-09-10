"use client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components";
import { cn } from "@/lib/utils";
import { WhiteGreaterThanIcon } from "@public/svgs";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

const Page = () => {
  const [otpValue, setValue] = useState("");
  return (
    <div className='flex flex-col gap-2 justify-center items-center h-full'>
      <div className='flex flex-col gap-14 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black'>
        <p className='font-semibold text-2xl text-center'>
          Let’s get you verified.
        </p>
        <div className='flex flex-col gap-5'>
          <p className='text-center text-sm'>
            Enter the 4-digit verification code sent to you.
          </p>
          <div className='w-full flex justify-center'>
            <InputOTP
              maxLength={4}
              value={otpValue}
              onChange={(value) => setValue(value)}
              pattern={REGEXP_ONLY_DIGITS}
              autoFocus
              onComplete={() => {}}
            >
              <InputOTPGroup className='gap-7'>
                {[0, 1, 2, 3].map((v) => {
                  return (
                    <InputOTPSlot
                      key={v}
                      index={v}
                      className='bg-white size-15 aspect-square rounded-lg data-[active=true]:border-primary text-center text-2xl shadow-none'
                    />
                  );
                })}
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className='flex flex-col text-center'>
            <p className='text-sm'>Didn’t get the code?</p>
            <button className='text-icons text-lg font-semibold hover:cursor-pointer'>
              Resend
            </button>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <button className='flex gap-3 items-center cursor-not-allowed'>
            <div className='flex justify-center items-center rounded-full bg-inactive  w-14 aspect-square rotate-180'>
              <WhiteGreaterThanIcon />
            </div>
            <p className='text-sm'>Back</p>
          </button>
          <button
            className={cn(
              "flex gap-3 items-center cursor-pointer",
              otpValue.length !== 4 && "cursor-not-allowed"
            )}
          >
            <p className='text-sm'>Continue</p>
            <div
              className={cn(
                "flex justify-center items-center rounded-full w-14 aspect-square transition-colors duration-500",
                otpValue.length === 4 ? "bg-primary" : "bg-inactive"
              )}
            >
              <WhiteGreaterThanIcon />
            </div>
          </button>
        </div>
      </div>
      <p className='text-base text-gray'>
        If you don’t see the code, check your spam folder too.
      </p>
    </div>
  );
};
export default Page;
