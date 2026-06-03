"use client";
import { X, ShieldOff } from "lucide-react";

type TwoFactorFlowProps = {
  mode: "enable" | "disable";
  onSuccess: () => void;
  onCancel: () => void;
};

/**
 * Two-factor authentication UI.
 *
 * NOTE: The backend does not yet expose 2FA endpoints (enable / verify / disable).
 * This component renders a "coming soon" notice until the feature is available.
 * When the backend implements the endpoints, restore the full flow from git history.
 */
export const TwoFactorFlow = ({ mode, onCancel }: TwoFactorFlowProps) => {
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

      {/* Coming-soon notice */}
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center">
          <ShieldOff size={18} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-700">
          Two-factor authentication coming soon
        </p>
        <p className="text-xs text-gray-400 max-w-65">
          This feature is not yet available. We&apos;ll notify you when it
          launches.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="mt-1 h-9 px-5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
