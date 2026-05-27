"use client";

import { AddInput, ButtonWithLoader } from "@/components";
import { ROLE_DASHBOARD_MAP, signInSchema, TSignInValidator } from "@/lib";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "@/store";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock } from "lucide-react";
import { DarkIosIcon, DarkGoogleIcon, DarkFacebookIcon } from "@public/svgs";

const Page = () => {
  const router = useRouter();
  const {
    isLoading,
    routeBeforeRedirect,
    actions: { login, setRouteBeforeRedirect },
  } = useSession((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInValidator>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: TSignInValidator) => {
    const val = await login({
      password: values.password,
      ...(values.email.includes("@")
        ? { email: values.email }
        : { mobileNumber: values.email }),
    });
    if (!val) return;
    if (val === "user") {
      router.replace("/onboarding/user-type");
      toast.error("Please complete your onboarding to continue.");
      return;
    } else if (routeBeforeRedirect) {
      router.replace(routeBeforeRedirect);
      setRouteBeforeRedirect("");
      return;
    }
    router.replace(ROLE_DASHBOARD_MAP[val] ?? "/");
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            Welcome back
          </h1>
          <p className="text-gray text-sm font-light">
            Sign in to continue your journey
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm"
        >
          <AddInput
            id="email"
            errors={errors}
            placeholder="Email or Phone Number"
            register={register}
            disabled={false}
            required
            type="text"
            icon={<Mail size={18} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />
          <AddInput
            id="password"
            errors={errors}
            placeholder="Password"
            register={register}
            disabled={false}
            required
            type="password"
            icon={<Lock size={18} className="text-placeholder" />}
            iconAndInputWrapperClassName="bg-white rounded-2xl h-14"
            inputClassName="placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0 shadow-none"
          />

          <div className="flex justify-end -mt-1">
            <Link
              href="/sign-in/forgot-password"
              className="text-xs text-primary font-medium hover:text-primary-deep transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <ButtonWithLoader
            isLoading={isLoading}
            text="Sign in"
            type="submit"
            variant="default"
            className="bg-primary hover:bg-primary-deep rounded-2xl h-14 items-center w-full text-white text-base font-semibold transition-colors duration-200"
          />

          {/* Divider */}
          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-2" />
            <p className="text-xs text-gray font-medium">or continue with</p>
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

          <p className="text-gray text-xs font-light text-center leading-relaxed px-2 mt-1">
            By continuing, you agree that Along and its affiliates may contact
            you at the number you provide.
          </p>
        </form>

        <p className="text-center mt-6 text-sm text-gray">
          Don&apos;t have an account?{" "}
          <Link
            href="/onboarding"
            className="text-primary font-semibold hover:text-primary-deep transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
