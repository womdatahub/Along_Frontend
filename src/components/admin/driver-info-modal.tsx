"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib";
import { DriverProfile } from "@/types";

type Tab = "personal" | "ssn" | "vehicle";

// ── Field ──────────────────────────────────────────────────────────
function Field({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <p className='text-sm text-[#858585]'>{label}</p>
      <p className='text-[15px] font-semibold text-gray-900'>{value}</p>
    </div>
  );
}

function ImgBox({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='w-16 h-14 sm:w-20 sm:h-16 bg-red-500 rounded-md flex-shrink-0' />
      <span className='text-xs text-primary'>{label}</span>
    </div>
  );
}

// ── Tab contents ───────────────────────────────────────────────────
function PersonalTab() {
  return (
    <div>
      <div className='px-5 py-5'>
        <div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field label='Name' value='Mark Spencer' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field label='Date of Birth' value='May 5th 2000' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field label='Gender' value='Male' />
      </div>
      <Separator />
      <div className='px-5 py-4 flex items-start justify-between gap-4'>
        <Field label='Email Address' value='markspencer@gmail.com' />
        <p className='text-xs text-green-600 font-medium flex-shrink-0 mt-5'>
          Verified
        </p>
      </div>
    </div>
  );
}

function SsnTab() {
  return (
    <div>
      <div className='px-5 py-4'>
        <Field label='Social Security Number' value='288 085 198 37' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field label="Driver's License Number" value='387 0966 UT' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field label='Issued Date' value='23 – 06 – 2025' />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <p className='text-sm text-[#858585] mb-3'>Uploads</p>
        <div className='flex gap-3 flex-wrap'>
          <ImgBox label='Front' />
          <ImgBox label='Back' />
          <ImgBox label='Advanced' />
        </div>
      </div>
    </div>
  );
}

function VehicleTab() {
  const [page, setPage] = useState(1);
  return (
    <div className='flex flex-col min-h-full'>
      <div className='flex-1'>
        {page === 1 ? (
          <>
            <div className='px-5 py-4'>
              <Field label='Vehicle Make' value='Tesla' />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field label='Vehicle Model' value='Model Y' />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field label='Vehicle Vin Number' value='0912 9883 000990' />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field label='Vehicle Colour' value='Beige' />
            </div>
            <Separator />
          </>
        ) : (
          <div className='px-5 py-4'>
            <p className='text-sm text-[#858585] mb-3'>Uploads</p>
            <div className='flex gap-3 flex-wrap mb-5'>
              <ImgBox label='Side front' />
              <ImgBox label='Interior' />
              <ImgBox label='Side rear' />
            </div>
            <p className='text-sm text-[#858585] mb-3'>
              Vehicle Registration Document
            </p>
            <ImgBox label='Vehicle Reg' />
          </div>
        )}
      </div>
      <div className='flex items-center justify-end gap-1 px-4 py-3 text-sm text-primary'>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className='hover:text-gray-800 p-1'
        >
          <ChevronLeft size={17} />
        </button>
        <span className='tabular-nums'>{page}/2</span>
        <button
          onClick={() => setPage((p) => Math.min(2, p + 1))}
          className='hover:text-gray-800 p-1'
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}

// ── Tab config ─────────────────────────────────────────────────────
const TABS: {
  key: Tab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}[] = [
  {
    key: "personal",
    label: "Personal Information",
    shortLabel: "Personal",
    icon: User,
  },
  {
    key: "ssn",
    label: "Social Security Data",
    shortLabel: "Security",
    icon: Shield,
  },
  {
    key: "vehicle",
    label: "Vehicle Registration",
    shortLabel: "Vehicle",
    icon: Car,
  },
];

export const DriverInfoModal = ({
  trigger,
}: {
  trigger: React.ReactNode;
  driverInfo: DriverProfile;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab />;
      case "ssn":
        return <SsnTab />;
      case "vehicle":
        return <VehicleTab />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          "p-0 gap-0 overflow-hidden",
          "w-[calc(100vw-20px)] max-w-[calc(100vw-20px)]",
          "sm:w-[720px] sm:max-w-[720px] sm:min-w-[720px]",
          "max-h-[90dvh] flex flex-col",
          "[&>button.absolute]:hidden",
        )}
      >
        <div className='flex flex-col sm:flex-row flex-1 min-h-0 sm:min-h-[450px]'>
          <div className='flex sm:hidden border-b border-[#CCCCCC] flex-shrink-0 bg-white'>
            {TABS.map(({ key, shortLabel, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors border-b-2 -mb-px",
                  activeTab === key
                    ? "border-primary text-gray-900"
                    : "border-transparent text-[#858585]",
                )}
              >
                <Icon size={15} />
                {shortLabel}
              </button>
            ))}
          </div>
          <div className='hidden sm:flex flex-col justify-between border-r border-[#CCCCCC] p-4 flex-shrink-0'>
            <div className='flex flex-col gap-1'>
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm md:text-base font-bold transition-colors whitespace-nowrap cursor-pointer",
                    activeTab !== key && "text-[#858585]",
                  )}
                >
                  <Icon
                    size={18}
                    className={
                      activeTab === key ? "text-gray-700" : "text-gray-300"
                    }
                  />
                  {label}
                </button>
              ))}
            </div>

            <div className='flex flex-col gap-2 pt-4'>
              <Button className='rounded-xl text-sm'>Verify User</Button>
              <Button
                variant='outline'
                className='text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent rounded-xl text-sm'
              >
                Reject entry
              </Button>
            </div>
          </div>
          <div className='flex-1 flex flex-col min-h-0 min-w-0'>
            <div className='flex-1 overflow-y-auto'>{renderContent()}</div>

            <div className='sm:hidden flex-shrink-0 border-t border-gray-200 p-4 flex flex-col gap-2 bg-white'>
              <Button className='rounded-xl text-sm w-full'>Verify User</Button>
              <Button
                variant='outline'
                className='text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent rounded-xl text-sm w-full'
              >
                Reject entry
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
