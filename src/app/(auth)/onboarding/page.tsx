"use client";

import {
  ButtonWithLoader,
  HeadingHeebo,
  AddInput,
  TermsModal,
  PhoneInput,
} from "@/components";
import { cn, onboardingSchema, TOnboardingValidator } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { DarkFacebookIcon, DarkGoogleIcon, DarkIosIcon } from "@public/svgs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Mail, Lock, Tag } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const {
    isLoading,
    actions: { registerUser },
  } = useSession((state) => state);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TOnboardingValidator>({
    defaultValues: {
      mobileNumber: "",
      email: "",
      password: "",
      referralCode: "",
    },
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: TOnboardingValidator) => {
    if (!isTermsAccepted)
      return toast.error("Please accept terms and conditions.");
    const isSuccess = await registerUser({ ...values, type: "email" });
    if (isSuccess === false) return;
    router.push("/onboarding/otp?email=" + values.email);
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md md:max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray text-sm font-light">Let’s get you onboard</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm"
        >
          <AddInput
            id="email"
            errors={errors}
            placeholder="Email address"
            register={register}
            disabled={false}
            required
            type="text"
            maxLength={254}
            icon={<Mail size={18} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <Controller
            name="mobileNumber"
            control={control}
            render={({ field, fieldState }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error?.message}
                iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
                inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
              />
            )}
          />
          <AddInput
            id="password"
            errors={errors}
            placeholder="Password"
            register={register}
            disabled={false}
            required
            type="password"
            maxLength={128}
            icon={<Lock size={18} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            id="referralCode"
            errors={errors}
            placeholder="Referral code (optional)"
            register={register}
            disabled={false}
            required
            type="text"
            maxLength={20}
            icon={<Tag size={18} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-2" />
            <p className="text-xs text-gray font-medium">or sign up with</p>
            <div className="flex-1 h-px bg-gray-2" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-white border border-gray-2 hover:border-gray-3 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <DarkIosIcon width={24} height={24} />
              <span className="text-xs text-gray-4 font-medium">Apple</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-white border border-gray-2 hover:border-gray-3 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <DarkGoogleIcon width={24} height={24} />
              <span className="text-xs text-gray-4 font-medium">Google</span>
            </button>
            <button
              type="button"
              className="flex flex-col items-center gap-2 py-3.5 rounded-2xl bg-white border border-gray-2 hover:border-gray-3 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <DarkFacebookIcon width={24} height={24} />
              <span className="text-xs text-gray-4 font-medium">Facebook</span>
            </button>
          </div>

          {/* Terms */}
          <div className="flex gap-3 items-start mt-1">
            <button
              type="button"
              onClick={() => setIsTermsAccepted((prev) => !prev)}
              className={cn(
                "mt-0.5 size-4 rounded-lg border-2 shrink-0 transition-colors duration-200",
                isTermsAccepted
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-2",
              )}
            />
            <TermsModal
              acceptFunction={() => {
                setIsTermsAccepted(true);
                setIsTermsModalOpen(false);
              }}
              isTermsModalOpen={isTermsModalOpen}
              setIsTermsModalOpen={setIsTermsModalOpen}
              trigger={
                <button type="button" className="text-left">
                  <span className="text-xs text-gray font-light leading-relaxed">
                    I agree to Along&apos;s{" "}
                    <span className="text-primary font-semibold hover:text-primary-deep transition-colors">
                      Terms & Conditions
                    </span>{" "}
                    and{" "}
                    <span className="text-primary font-semibold hover:text-primary-deep transition-colors">
                      Privacy Policy
                    </span>
                  </span>
                </button>
              }
            />
          </div>

          <ButtonWithLoader
            isLoading={isLoading}
            disabled={!isTermsAccepted || isLoading}
            text="Create account"
            type="submit"
            variant="default"
            className="bg-primary hover:bg-primary-deep disabled:opacity-50 rounded-2xl h-14 items-center w-full text-white text-base font-semibold transition-colors duration-200 mt-2"
          />

          <p className="text-gray text-xs font-light text-center leading-relaxed px-2">
            By continuing, you agree that Along and its affiliates may contact
            you at the number you provide via calls, WhatsApp, or SMS.
          </p>
        </form>

        <p className="text-center mt-6 text-sm text-gray">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary font-semibold hover:text-primary-deep transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Page;
