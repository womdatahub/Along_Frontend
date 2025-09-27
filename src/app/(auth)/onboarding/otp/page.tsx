"use client";
import {
  AuthBackAndContinueButton,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components";
import { HeadingHeebo } from "@/components";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";

const Page = () => {
  const [otpValue, setValue] = useState("");
  return (
    <div className='flex flex-col gap-2 justify-center items-center h-full'>
      <div className='flex flex-col gap-14 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
        <HeadingHeebo>Let’s get you verified.</HeadingHeebo>
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
        <AuthBackAndContinueButton
          backActive={false}
          continueActive={otpValue.length === 4}
          continuePath='/onboarding/user-type'
        />
      </div>
      <p className='text-base text-gray'>
        If you don’t see the code, check your spam folder too.
      </p>
    </div>
  );
};
export default Page;
