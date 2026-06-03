"use client";

import { Suspense, useState } from "react";
import { AddInput, ButtonWithLoader } from "@/components";
import {
  AUTH_ONLY_ROUTES,
  ROLE_DASHBOARD_MAP,
  signInSchema,
  TSignInValidator,
} from "@/lib";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/store";
import Link from "next/link";
import { toast } from "sonner";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { DarkIosIcon, DarkGoogleIcon, DarkFacebookIcon } from "@public/svgs";

// Redirect helpers
const ROLE_PREFIXES: Record<string, string> = {
  driver: "/driver",
  rider: "/rider",
  admin: "/admin",
};

/**
 * Returns the redirect URL if it is safe for the given role, otherwise null.
 *
 * Rules:
 *  1. Must be a relative path (starts with "/").
 *  2. Must not be an auth-only route (sign-in, otp, etc.).
 *  3. Must not belong to a *different* role's space.
 */
const resolveRedirect = (
  redirect: string | null,
  role: string,
): string | null => {
  if (!redirect) return null;

  // Must be relative
  if (!redirect.startsWith("/")) return null;

  // Must not loop back to an auth-only route
  if (
    AUTH_ONLY_ROUTES.some((r) => redirect === r || redirect.startsWith(`${r}/`))
  )
    return null;

  // Reject redirects that belong to a different role's portal
  const myPrefix = ROLE_PREFIXES[role];
  const otherPrefixes = Object.values(ROLE_PREFIXES).filter(
    (p) => p !== myPrefix,
  );
  if (otherPrefixes.some((p) => redirect.startsWith(p))) return null;

  return redirect;
};

// Inner component — uses useSearchParams (must be inside <Suspense>)
const SignInContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    isLoading,
    routeBeforeRedirect,
    actions: { login, verify2FALogin, setRouteBeforeRedirect },
  } = useSession((state) => state);

  // 2FA challenge state
  const [show2FAStep, setShow2FAStep] = useState(false);
  const [pendingMfaToken, setPendingMfaToken] = useState<string | null>(null);
  const [mfaOtp, setMfaOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInValidator>({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(signInSchema),
  });

  /** Navigate to the role's dashboard after a successful sign-in. */
  const redirectAfterLogin = (role: string) => {
    if (role === "user") {
      router.replace("/onboarding/user-type");
      toast.error("Please complete your onboarding to continue.");
      return;
    }
    const rawRedirect =
      searchParams.get("redirect") ?? routeBeforeRedirect ?? null;
    const destination = resolveRedirect(rawRedirect, role);
    if (routeBeforeRedirect) setRouteBeforeRedirect("");
    if (destination) {
      router.replace(destination);
      return;
    }
    router.replace(ROLE_DASHBOARD_MAP[role] ?? "/");
  };

  const onSubmit = async (values: TSignInValidator) => {
    const result = await login({
      password: values.password,
      ...(values.email.includes("@")
        ? { email: values.email }
        : { mobileNumber: values.email }),
    });

    if (!result.role) return;

    if (result.requires2fa && result.mfaToken) {
      setPendingMfaToken(result.mfaToken);
      setShow2FAStep(true);
      return;
    }

    redirectAfterLogin(result.role);
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingMfaToken || mfaOtp.trim().length < 6) {
      toast.error("Enter the 6-digit code from your authenticator app");
      return;
    }
    const role = await verify2FALogin({
      mfaToken: pendingMfaToken,
      otp: mfaOtp.trim(),
    });
    if (!role) {
      toast.error("Invalid code. Please try again.");
      return;
    }
    redirectAfterLogin(role);
  };

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            {show2FAStep ? "Two-Factor Authentication" : "Welcome back"}
          </h1>
          <p className="text-gray text-sm font-light">
            {show2FAStep
              ? "Enter the 6-digit code from your authenticator app"
              : "Sign in to continue your journey"}
          </p>
        </div>
        {/* ── 2FA challenge step ── */}
        {show2FAStep ? (
          <form
            onSubmit={handle2FASubmit}
            className="flex flex-col gap-4 bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm"
          >
            <div className="flex justify-center mb-2">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck size={26} className="text-primary" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold ml-1 text-gray-700">
                Authentication Code
              </label>
              <div className="bg-white rounded-2xl h-14 flex items-center px-4 border border-gray-200 focus-within:border-primary transition-colors">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="000000"
                  value={mfaOtp}
                  onChange={(e) =>
                    setMfaOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  maxLength={6}
                  autoFocus
                  className="flex-1 h-full bg-transparent placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none border-0 shadow-none tracking-widest text-center"
                />
              </div>
            </div>

            <ButtonWithLoader
              isLoading={isLoading}
              text="Verify"
              type="submit"
              variant="default"
              className="bg-primary hover:bg-primary-deep rounded-2xl h-14 items-center w-full text-white text-base font-semibold transition-colors duration-200"
            />

            <button
              type="button"
              onClick={() => {
                setShow2FAStep(false);
                setPendingMfaToken(null);
                setMfaOtp("");
              }}
              className="text-sm text-center text-primary underline hover:text-primary-deep transition-colors"
            >
              Back to sign in
            </button>
          </form>
        ) : (
          /* ── Normal sign-in form ── */
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
              maxLength={254}
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
              maxLength={128}
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
                <span className="text-xs text-gray-4 font-medium">
                  Facebook
                </span>
              </button>
            </div>

            <p className="text-gray text-xs font-light text-center leading-relaxed px-2 mt-1">
              By continuing, you agree that Along and its affiliates may contact
              you at the number you provide.
            </p>
          </form>
        )}{" "}
        {/* end show2FAStep conditional */}
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
};;

//
// Page export — wraps inner component in Suspense (required by useSearchParams)
//

const Page = () => (
  <Suspense fallback={null}>
    <SignInContent />
  </Suspense>
);

export default Page;
