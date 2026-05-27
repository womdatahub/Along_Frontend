"use client";
import { useState } from "react";
import { Loader2, X, Copy, Check } from "lucide-react";
import { requests } from "@/lib";
import { toast } from "sonner";
import Image from "next/image";

type TwoFactorFlowProps = {
  /** "enable" opens the QR/code setup flow; "disable" asks for code then turns 2FA off. */
  mode: "enable" | "disable";
  onSuccess: () => void;
  onCancel: () => void;
};

type EnableStep = "loading" | "qr" | "manual" | "verify";

export const TwoFactorFlow = ({
  mode,
  onSuccess,
  onCancel,
}: TwoFactorFlowProps) => {
  //  Enable flow state
  const [enableStep, setEnableStep] = useState<EnableStep>(
    mode === "enable" ? "loading" : "verify",
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [manualCode, setManualCode] = useState<string>("");
  const [copied, setCopied] = useState(false);

  //  Shared state ─
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  //  Kick off 2FA enable on first render
  const [enableStarted, setEnableStarted] = useState(false);
  if (mode === "enable" && !enableStarted) {
    setEnableStarted(true);
    requests.user
      .enable2FA()
      .then(({ data, error }) => {
        if (error || !data) {
          toast.error("Failed to start 2FA setup. Please try again.");
          onCancel();
          return;
        }
        const raw = data as unknown as {
          qrCode?: string;
          manualCode?: string;
          data?: { qrCode?: string; manualCode?: string };
        };
        const qr = raw.qrCode ?? raw.data?.qrCode ?? "";
        const manual = raw.manualCode ?? raw.data?.manualCode ?? "";
        setQrCode(qr);
        setManualCode(manual);
        setEnableStep("qr");
      })
      .catch(() => {
        toast.error("Failed to start 2FA setup. Please try again.");
        onCancel();
      });
  }

  const handleCopy = async () => {
    if (!manualCode) return;
    try {
      await navigator.clipboard.writeText(manualCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied */
    }
  };

  const handleSubmitCode = async () => {
    const trimmed = code.trim();
    if (!trimmed || trimmed.length < 6) {
      toast.error("Enter the 6-digit code from your authenticator app");
      return;
    }
    setLoading(true);
    try {
      if (mode === "enable") {
        const { error } = await requests.user.verify2FA({ code: trimmed });
        if (error) {
          toast.error("Invalid code. Please try again.");
          setCode("");
          return;
        }
        toast.success("Two-factor authentication enabled");
        onSuccess();
      } else {
        const { error } = await requests.user.disable2FA({ code: trimmed });
        if (error) {
          toast.error("Invalid code. Please try again.");
          setCode("");
          return;
        }
        toast.success("Two-factor authentication disabled");
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  //  Renderers ─

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

      {/*  Enable: loading  */}
      {mode === "enable" && enableStep === "loading" && (
        <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
          <Loader2 size={14} className="animate-spin" />
          <span>Generating your 2FA setup…</span>
        </div>
      )}

      {/*  Enable: QR code  */}
      {mode === "enable" && enableStep === "qr" && qrCode && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-gray-500 text-center">
            Scan this QR code with your authenticator app (Google Authenticator,
            Authy, etc.)
          </p>
          <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <Image
              src={qrCode}
              alt="2FA QR Code"
              width={160}
              height={160}
              className="w-40 h-40"
              unoptimized
            />
          </div>
          <button
            type="button"
            onClick={() => setEnableStep("manual")}
            className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Use manual code instead
          </button>
          <button
            type="button"
            onClick={() => setEnableStep("verify")}
            className="w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Proceed
          </button>
        </div>
      )}

      {/*  Enable: manual code  */}
      {mode === "enable" && enableStep === "manual" && manualCode && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            Enter this code manually into your authenticator app:
          </p>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
            <code className="flex-1 text-sm font-mono font-semibold text-gray-900 tracking-widest break-all">
              {manualCode}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 size-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {copied ? (
                <Check size={13} className="text-emerald-500" />
              ) : (
                <Copy size={13} />
              )}
            </button>
          </div>
          <button
            type="button"
            onClick={() => setEnableStep("qr")}
            className="text-xs text-primary font-semibold hover:text-primary/80 transition-colors self-start"
          >
            Show QR code instead
          </button>
          <button
            type="button"
            onClick={() => setEnableStep("verify")}
            className="w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Proceed
          </button>
        </div>
      )}

      {/*  Verify code (both modes)  */}
      {(enableStep === "verify" || mode === "disable") && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-gray-500">
            {mode === "enable"
              ? "Enter the 6-digit code generated by your authenticator app to confirm setup."
              : "Enter the 6-digit code from your authenticator app, or one of your backup codes."}
          </p>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 8))
            }
            placeholder="000000"
            className="h-12 rounded-xl border border-gray-200 px-4 text-center text-xl font-mono font-bold tracking-[0.4em] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-gray-300 placeholder:tracking-[0.4em]"
          />
          <button
            type="button"
            onClick={handleSubmitCode}
            disabled={loading || code.length < 6}
            className="flex items-center justify-center gap-2 w-full h-10 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && <Loader2 size={13} className="animate-spin" />}
            {loading
              ? mode === "enable"
                ? "Activating…"
                : "Disabling…"
              : mode === "enable"
                ? "Activate 2FA"
                : "Disable 2FA"}
          </button>
        </div>
      )}
    </div>
  );
};
