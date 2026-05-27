"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Mail, Loader2, ShieldCheck } from "lucide-react";
import { requests } from "@/lib";
import { PasswordInput } from "@/components";

//  Types
type Step = "request" | "reset";

//  Page
const Page = () => {
  const router = useRouter();

  const [step, setStep] = useState<Step>("request");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  //  Step 1: request OTP
  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = identifier.trim();
    if (!trimmed) {
      toast.error("Please enter your email or phone number");
      return;
    }
    setLoading(true);
    try {
      const payload = trimmed.includes("@")
        ? { email: trimmed }
        : { mobileNumber: trimmed };
      const { error } = await requests.user.requestPasswordReset(payload);
      if (error) {
        toast.error(
          "Could not send reset code. Please check your details and try again.",
        );
        return;
      }
      toast.success("Reset code sent — check your email or phone");
      setStep("reset");
      startResendCooldown();
    } finally {
      setLoading(false);
    }
  };

  //  Step 2: verify OTP + set new password
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length < 4) {
      toast.error("Enter the reset code we sent you");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const trimmed = identifier.trim();
      const payload = {
        otp: otp.trim(),
        newPassword,
        ...(trimmed.includes("@")
          ? { email: trimmed }
          : { mobileNumber: trimmed }),
      };
      const { error } = await requests.user.resetPassword(payload);
      if (error) {
        toast.error("Invalid or expired code. Please try again.");
        return;
      }
      toast.success("Password reset successfully — please sign in");
      router.replace("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  //  Resend cooldown
  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const trimmed = identifier.trim();
      const payload = trimmed.includes("@")
        ? { email: trimmed }
        : { mobileNumber: trimmed };
      const { error } = await requests.user.requestPasswordReset(payload);
      if (error) {
        toast.error("Could not resend code. Please try again.");
        return;
      }
      toast.success("New code sent");
      startResendCooldown();
    } finally {
      setLoading(false);
    }
  };

  //  Render
  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-1.5 text-sm text-gray hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>

        {step === "request" ? (
          <RequestStep
            identifier={identifier}
            setIdentifier={setIdentifier}
            loading={loading}
            onSubmit={handleRequest}
          />
        ) : (
          <ResetStep
            identifier={identifier}
            otp={otp}
            setOtp={setOtp}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
            resendCooldown={resendCooldown}
            onSubmit={handleReset}
            onResend={handleResend}
            onBack={() => setStep("request")}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

//  Sub-components
type RequestStepProps = {
  identifier: string;
  setIdentifier: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
};

const RequestStep = ({
  identifier,
  setIdentifier,
  loading,
  onSubmit,
}: RequestStepProps) => (
  <>
    <div className="mb-8 text-center">
      <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
        <Mail size={24} className="text-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
        Forgot password?
      </h1>
      <p className="text-gray text-sm font-light max-w-xs mx-auto">
        Enter the email or phone number linked to your account and we&apos;ll
        send you a reset code.
      </p>
    </div>

    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm"
    >
      <div className="flex items-center gap-3 bg-white rounded-2xl h-14 px-4 border border-gray-200">
        <Mail size={18} className="text-placeholder shrink-0" />
        <input
          type="text"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Email or Phone Number"
          autoComplete="email"
          className="flex-1 bg-transparent text-sm font-medium font-fustat placeholder:text-placeholder focus:outline-none border-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-deep text-white text-base font-semibold h-14 rounded-2xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Sending…" : "Send reset code"}
      </button>
    </form>
  </>
);

type ResetStepProps = {
  identifier: string;
  otp: string;
  setOtp: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  resendCooldown: number;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
};

const ResetStep = ({
  identifier,
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  resendCooldown,
  onSubmit,
  onResend,
  onBack,
}: ResetStepProps) => (
  <>
    <div className="mb-8 text-center">
      <div className="inline-flex size-14 rounded-2xl bg-primary/10 items-center justify-center mb-4">
        <ShieldCheck size={24} className="text-primary" />
      </div>
      <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
        Check your messages
      </h1>
      <p className="text-gray text-sm font-light max-w-xs mx-auto">
        We sent a reset code to{" "}
        <span className="font-medium text-gray-4">{identifier}</span>. Enter it
        below along with your new password.
      </p>
    </div>

    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm"
    >
      {/* OTP */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-4 ml-1">
          Reset code
        </label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={8}
          value={otp}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))
          }
          placeholder="Enter code"
          autoComplete="one-time-code"
          className="h-14 rounded-2xl bg-white border border-gray-200 px-4 text-center text-xl font-mono font-bold tracking-[0.35em] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 placeholder:tracking-widest placeholder:font-normal placeholder:text-base"
        />
      </div>

      {/* New password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-4 ml-1">
          New password
        </label>
        <PasswordInput
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          className="h-14 w-full rounded-2xl bg-white border border-gray-200 px-4 text-sm font-medium font-fustat placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-gray-4 ml-1">
          Confirm new password
        </label>
        <PasswordInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat new password"
          autoComplete="new-password"
          className="h-14 w-full rounded-2xl bg-white border border-gray-200 px-4 text-sm font-medium font-fustat placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-deep text-white text-base font-semibold h-14 rounded-2xl transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Resetting…" : "Reset password"}
      </button>

      {/* Resend + change identifier */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-xs text-gray hover:text-gray-4 transition-colors"
        >
          Change email / phone
        </button>
        <button
          type="button"
          onClick={onResend}
          disabled={resendCooldown > 0 || loading}
          className="text-xs font-semibold text-primary hover:text-primary-deep disabled:text-gray disabled:cursor-not-allowed transition-colors"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </div>
    </form>
  </>
);
