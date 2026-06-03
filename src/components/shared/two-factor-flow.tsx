"use client";

import { useState } from "react";
import { X, ShieldCheck, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import { requests } from "@/lib";
import { toast } from "sonner";

type TwoFactorFlowProps = {
  mode: "enable" | "disable";
  onSuccess: () => void;
  onCancel: () => void;
};

type EnableStep = "setup" | "verify" | "backup";

export const TwoFactorFlow = ({
  mode,
  onSuccess,
  onCancel,
}: TwoFactorFlowProps) => {
  // --- Enable flow state ---
  const [step, setStep] = useState<EnableStep>("setup");
  const [secretData, setSecretData] = useState<{
    secretBase32: string;
    otpauthUrl: string;
  } | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showSecret, setShowSecret] = useState(false);

  // --- Shared OTP input ---
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- Initiate enable ---
  const handleStartEnable = async () => {
    setLoading(true);
    setOtpError("");
    try {
      const { data, error } = await requests.user.initiate2FA();
      if (error || !data?.data) {
        toast.error("Could not start 2FA setup. Please try again.");
        return;
      }
      setSecretData(data.data as { secretBase32: string; otpauthUrl: string });
      setStep("verify");
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP to complete enable ---
  const handleVerifyEnable = async () => {
    if (otp.trim().length < 6) {
      setOtpError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const { data, error } = await requests.user.verify2FAEnable({
        otp: otp.trim(),
      });
      if (error || !data?.data) {
        setOtpError("Invalid or expired code. Try again.");
        return;
      }
      const codes = (data.data as { backupCodes?: string[] }).backupCodes ?? [];
      setBackupCodes(codes);
      setStep("backup");
    } finally {
      setLoading(false);
    }
  };

  // --- Disable ---
  const handleDisable = async () => {
    if (otp.trim().length < 6) {
      setOtpError("Enter your current 6-digit authenticator code");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const { error } = await requests.user.disable2FA({ otp: otp.trim() });
      if (error) {
        setOtpError("Invalid code. Please try again.");
        return;
      }
      toast.success("Two-factor authentication disabled");
      onSuccess();
    } finally {
      setLoading(false);
    }
  };

  const qrImageUrl = secretData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(secretData.otpauthUrl)}`
    : null;

  return (
    <div className="mt-3 mb-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-900">
          {mode === "enable"
            ? "Set up two-factor authentication"
            : "Disable two-factor authentication"}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="size-7 rounded-lg hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* ─── ENABLE: Step 1 — introduction ─── */}
      {mode === "enable" && step === "setup" && (
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck size={18} className="text-primary" />
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            Protect your account with a time-based one-time password (TOTP) app
            like Google Authenticator, Authy, or 1Password.
          </p>
          <button
            type="button"
            onClick={handleStartEnable}
            disabled={loading}
            className="mt-1 h-9 px-5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Get started
          </button>
        </div>
      )}

      {/* ─── ENABLE: Step 2 — scan QR / enter secret ─── */}
      {mode === "enable" && step === "verify" && secretData && (
        <div className="flex flex-col gap-4">
          <p className="text-xs text-gray-500">
            1. Open your authenticator app and scan the QR code below, or enter
            the secret manually.
          </p>
          <div className="flex flex-col items-center gap-3">
            {qrImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrImageUrl}
                alt="2FA QR Code"
                width={160}
                height={160}
                className="rounded-xl border border-gray-200"
              />
            )}
            {/* Manual secret */}
            <div className="w-full flex items-center gap-2 bg-white rounded-xl border border-gray-200 px-3 py-2">
              <code className="flex-1 text-xs font-mono text-gray-700 break-all select-all">
                {showSecret
                  ? secretData.secretBase32
                  : "•".repeat(secretData.secretBase32.length)}
              </code>
              <button
                type="button"
                onClick={() => setShowSecret((v) => !v)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(secretData.secretBase32);
                  toast.success("Secret copied");
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            2. Enter the 6-digit code your authenticator app shows:
          </p>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setOtpError("");
              }}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-primary"
            />
            {otpError && <p className="text-xs text-red-500">{otpError}</p>}
          </div>
          <button
            type="button"
            onClick={handleVerifyEnable}
            disabled={loading}
            className="h-9 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Verify & enable
          </button>
        </div>
      )}

      {/* ─── ENABLE: Step 3 — backup codes ─── */}
      {mode === "enable" && step === "backup" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-600 shrink-0" />
            <p className="text-sm font-semibold text-green-700">
              Two-factor authentication enabled!
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Save these backup codes somewhere safe. Each code can only be used
            once if you lose access to your authenticator app.
          </p>
          <div className="grid grid-cols-2 gap-2 bg-white rounded-xl border border-gray-200 p-3">
            {backupCodes.map((code) => (
              <code
                key={code}
                className="text-xs font-mono text-gray-700 text-center py-1 px-2 bg-gray-50 rounded-lg"
              >
                {code}
              </code>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(backupCodes.join("\n"));
              toast.success("Backup codes copied");
            }}
            className="flex items-center justify-center gap-2 h-8 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Copy size={13} /> Copy all codes
          </button>
          <button
            type="button"
            onClick={onSuccess}
            className="h-9 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Done
          </button>
        </div>
      )}

      {/* ─── DISABLE flow ─── */}
      {mode === "disable" && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            Enter the 6-digit code from your authenticator app to confirm you
            want to disable 2FA.
          </p>
          <div className="flex flex-col gap-1">
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="000000"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 8));
                setOtpError("");
              }}
              className="h-10 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-primary"
            />
            {otpError && <p className="text-xs text-red-500">{otpError}</p>}
          </div>
          <button
            type="button"
            onClick={handleDisable}
            disabled={loading}
            className="h-9 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Disable two-factor authentication
          </button>
        </div>
      )}
    </div>
  );
};
