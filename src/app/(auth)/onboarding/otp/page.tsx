"use client";
import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  LoadingComponent,
} from "@/components";
import { HeadingHeebo } from "@/components";
import { useSession } from "@/store";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const Page = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <OTPVerification />
    </Suspense>
  );
};
const OTPVerification = () => {
  const [otpValue, setValue] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const email: string | null = searchParams.get("email");

  const {
    // isLoading,
    actions: { resendVerificationOTP, verifyEmail },
  } = useSession((state) => state);

  const continueFnc = async () => {
    if (!email || otpValue.length <= 3) return;
    await verifyEmail({ email: email!, otp: otpValue }).then((val) => {
      if (val === false) return;
      router.push("/onboarding/user-type");
    });
  };
  return (
    <div className='flex flex-col gap-2 justify-center items-center h-full'>
      <div className='flex flex-col gap-14 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black'>
        <HeadingHeebo>Let’s get you verified.</HeadingHeebo>
        <div className='flex flex-col gap-4'>
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
              onComplete={continueFnc}
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
          <div className='flex flex-col gap-7'>
            <div className='flex gap-1 justify-center items-center text-center'>
              <p className='text-sm'>Send to email</p>
              <Button
                variant={"link"}
                className='text-icons text-base font-semibold hover:cursor-pointer w-fit h-fit p-0 hover:no-underline'
              >
                Send
              </Button>
            </div>
            <div className='flex gap-1 justify-center items-center text-center'>
              <p className='text-sm'>Didn’t get the code?</p>
              <Button
                variant={"link"}
                className='text-icons text-base font-semibold hover:cursor-pointer w-fit h-fit p-0 hover:no-underline'
                onClick={() => {
                  if (!email) return;
                  resendVerificationOTP({ email: email });
                }}
              >
                Resend
              </Button>
            </div>
          </div>
        </div>
        {/* <AuthBackAndContinueButton
          backActive={true}
          continueActive={otpValue.length === 4 && !isLoading}
          continueFnc={continueFnc}
        /> */}
      </div>
      <p className='text-base text-gray'>
        If you don’t see the code, check your spam folder too.
      </p>
    </div>
  );
};
export default Page;
