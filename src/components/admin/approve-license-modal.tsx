"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Separator,
  Button,
} from "@/components";
import { BadgeCheck, Calendar } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  trigger: React.ReactNode;
  /** Title — defaults to "Approve Licence". */
  title?: string;
  /**
   * Expiry date as entered by the rider/driver during submission. Shown to the
   * admin pre-filled in the input so they can either confirm or correct it
   * before the approval is committed.
   */
  submittedExpiryDate?: string;
  /** Full name shown in the description for clarity in batch approvals. */
  subjectName?: string;
  /**
   * Confirm handler. Receives the final expiry date (ISO yyyy-MM-dd) that the
   * admin agreed to. Throw to keep the modal open; resolve to close it.
   */
  onConfirm: (licenseExpiryDate: string) => Promise<void> | void;
};

/** Convert any backend date string into the yyyy-MM-dd value an <input type="date"> needs. */
const toDateInputValue = (raw?: string): string => {
  if (!raw) return "";
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
};

/** Tomorrow as yyyy-MM-dd — the minimum acceptable expiry date. */
const tomorrow = (): string => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
};

const ApproveLicenseModal = ({
  trigger,
  title = "Approve Licence",
  submittedExpiryDate,
  subjectName,
  onConfirm,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [expiry, setExpiry] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const minDate = useMemo(() => tomorrow(), []);
  const submittedFormatted = toDateInputValue(submittedExpiryDate);
  // Whether the admin has changed the rider's/driver's submitted value
  const wasCorrected =
    Boolean(submittedFormatted) && expiry !== submittedFormatted;

  const handleConfirm = async () => {
    if (!expiry) {
      setError("Expiry date is required");
      return;
    }
    if (expiry < minDate) {
      setError("Expiry date must be in the future");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onConfirm(expiry);
      setOpen(false);
    } catch {
      // onConfirm threw — keep the modal open so the admin can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) {
          setExpiry(submittedFormatted);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        dialogTitle={title}
        showCloseButton={false}
        className="max-w-sm overflow-hidden bg-[#E7EDED]"
      >
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="w-14 h-14 rounded-full border-2 border-emerald-500 flex items-center justify-center">
            <BadgeCheck className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <p className="text-xs text-gray-600 max-w-65">
            Confirm the licence expiry date
            {subjectName ? ` for ${subjectName}` : ""}. You may correct it if
            the submitted value is inaccurate.
          </p>
        </div>

        <Separator className="bg-[#768B8F38] mt-5" />

        <div className="flex flex-col gap-2">
          <label
            htmlFor="licenseExpiryDate"
            className="text-xs font-medium text-gray-700 flex items-center gap-1.5"
          >
            <Calendar size={12} />
            Licence Expiry Date
          </label>
          <input
            id="licenseExpiryDate"
            type="date"
            value={expiry}
            min={minDate}
            onChange={(e) => {
              setExpiry(e.target.value);
              if (error) setError(null);
            }}
            className="h-12 px-3 rounded-lg bg-background border border-transparent focus:border-primary focus:outline-none text-sm font-medium font-fustat"
          />
          {error ? (
            <p className="text-xs text-rose-600">{error}</p>
          ) : submittedFormatted ? (
            <p className="text-xs text-gray-500">
              Submitted by user:{" "}
              <span className="font-semibold">
                {new Date(submittedFormatted).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {wasCorrected ? " · you are about to correct it" : ""}
            </p>
          ) : (
            <p className="text-xs text-amber-600">
              No expiry date was submitted by the user — enter one to approve.
            </p>
          )}
        </div>

        <Separator className="bg-[#768B8F38] mt-5" />

        <div className="flex">
          <Button
            variant="ghost"
            className="flex-1 text-icons hover:bg-transparent"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Separator
            orientation="vertical"
            className="h-12 self-center bg-[#768B8F38]"
          />
          <Button
            variant="ghost"
            className="flex-1 hover:bg-transparent text-emerald-600 hover:text-emerald-700"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Approving…" : "Approve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { ApproveLicenseModal };
