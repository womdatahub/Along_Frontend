"use client";
import {
  Button,
  ButtonWithLoader,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  LoadingComponent,
} from "@/components";
import { useSession } from "@/store";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Mail, RotateCcw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useShallow } from "zustand/shallow";

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
    isLoading,
    isResendingVerificationOTP,
    actions: { resendVerificationOTP, verifyEmail },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      isLoading: state.isLoading,
      isResendingVerificationOTP: state.isResendingVerificationOTP,
    })),
  );

  const continueFnc = async () => {
    if (!email || otpValue.length <= 3) return;
    await verifyEmail({ email: email!, otp: otpValue }).then((val) => {
      if (val === false) return;
      router.push("/onboarding/user-type");
    });
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Verify your email
          </h1>
          <p className="text-gray text-sm font-light">
            We&apos;ve sent a 4-digit code to
          </p>
          {email && (
            <p className="text-sm font-semibold text-black mt-1 font-fustat">
              {email}
            </p>
          )}
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-8">
          {/* Email icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primaryLight2 flex items-center justify-center">
              <Mail size={28} className="text-primary" />
            </div>
          </div>

          {/* OTP Input */}
          <div className="flex flex-col gap-4">
            <p className="text-center text-sm text-gray font-light">
              Enter the 4-digit verification code
            </p>
            <div className="w-full flex justify-center">
              <InputOTP
                maxLength={4}
                value={otpValue}
                onChange={(value) => setValue(value)}
                pattern={REGEXP_ONLY_DIGITS}
                autoFocus
                onComplete={continueFnc}
              >
                <InputOTPGroup className="gap-4">
                  {[0, 1, 2, 3].map((v) => (
                    <InputOTPSlot
                      key={v}
                      index={v}
                      className="bg-white size-16 aspect-square rounded-2xl data-[active=true]:border-primary data-[active=true]:ring-2 data-[active=true]:ring-primary/20 text-center text-2xl font-bold shadow-sm border-2 border-gray-2 transition-all duration-200"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {/* Verify button */}
          {isLoading ? (
            <ButtonWithLoader
              isLoading={isLoading}
              text="Verifying..."
              className="bg-primary rounded-2xl h-14 w-full text-white text-base font-semibold"
            />
          ) : (
            <button
              onClick={continueFnc}
              disabled={otpValue.length < 4}
              className="bg-primary hover:bg-primary-deep disabled:opacity-40 rounded-2xl h-14 w-full text-white text-base font-semibold transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
            >
              Verify code
            </button>
          )}

          {/* Resend */}
          <div className="flex gap-2 justify-center items-center text-center">
            <p className="text-sm text-gray font-light">
              Didn&apos;t receive it?
            </p>
            <Button
              variant="link"
              disabled={isResendingVerificationOTP}
              className="text-primary text-sm font-semibold hover:cursor-pointer w-fit h-fit p-0 hover:no-underline disabled:cursor-progress disabled:text-gray gap-1.5 transition-colors hover:text-primary-deep"
              onClick={() => {
                if (!email) return;
                resendVerificationOTP({ email });
                setValue("");
              }}
            >
              {isResendingVerificationOTP ? (
                <>
                  <RotateCcw size={13} className="animate-spin" />
                  Resending...
                </>
              ) : (
                "Resend code"
              )}
            </Button>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-gray font-light">
          Check your spam folder if you don&apos;t see it in your inbox.
        </p>
      </div>
    </div>
  );
};

export default Page;
