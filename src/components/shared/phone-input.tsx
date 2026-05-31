"use client";

import { Phone } from "lucide-react";
import { type ChangeEvent, useRef } from "react";
import { cn } from "@/lib";

//  Formatting helpers (exported so pages can normalise default values)

/**
 * Strips non-digit characters from a raw phone string and removes a leading
 * country-code 1 when present. Safe for US numbers because no NANP area code
 * starts with 1.
 */
export const extractPhoneDigits = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("1") ? digits.slice(1) : digits;
};

/**
 * Formats up to 10 bare digits into the display mask: +1 (xxx) xxx xxxx.
 * Returns an empty string when no digits are present.
 */
export const formatUSPhone = (digits: string): string => {
  const d = digits.slice(0, 10);
  if (d.length === 0) return "";
  if (d.length <= 3) return `+1 (${d}`;
  if (d.length <= 6) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)} ${d.slice(6)}`;
};

/**
 * Convenience: normalises any stored phone value (E.164, raw digits, formatted)
 * into the display mask. Use this to seed react-hook-form defaultValues.
 */
export const normalizePhoneForForm = (raw: string): string =>
  formatUSPhone(extractPhoneDigits(raw));

//  Component

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  /** Passed directly to the wrapper div — use for bg, rounded, height, etc. */
  iconAndInputWrapperClassName?: string;
  inputClassName?: string;
}

/**
 * Controlled phone input that auto-formats digits as the user types.
 *
 * - Auto-prepends "+1 " so the user only needs to type their 10-digit number.
 * - Produces values in the form "+1 (xxx) xxx xxxx".
 * - Wire via react-hook-form <Controller> — do NOT use register().
 */
export const PhoneInput = ({
  value,
  onChange,
  onBlur,
  error,
  disabled,
  label,
  iconAndInputWrapperClassName,
  inputClassName,
}: PhoneInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = extractPhoneDigits(e.target.value);
    const formatted = formatUSPhone(digits);
    onChange(formatted);
    // Keep cursor at the end so the mask never confuses mid-string edits.
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.selectionStart = formatted.length;
        inputRef.current.selectionEnd = formatted.length;
      }
    });
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="font-medium text-sm ml-1 text-black">{label}</label>
      )}
      <div
        className={cn(
          "flex gap-2 items-center px-6 border border-gray-200",
          iconAndInputWrapperClassName,
          error && "border-red-400",
        )}
      >
        <Phone size={18} className="text-placeholder shrink-0" />
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          placeholder="+1 (555) 000 0000"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn("block flex-1 h-full bg-transparent", inputClassName)}
        />
      </div>
      {error && <p className="text-red-500 text-xs ml-1 mt-0.5">{error}</p>}
    </div>
  );
};
