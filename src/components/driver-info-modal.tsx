"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Shield,
  Car,
  //   FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib";

// ── Types ──────────────────────────────────────────────────────────
type Tab = "personal" | "ssn" | "vehicle" | "insurance";

// ── Helpers ────────────────────────────────────────────────────────
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
    <div className={cn("mb-4 px-6 flex flex-col gap-1", className)}>
      <p className='text-sm text-[#858585]'>{label}</p>
      <p className='text-[15px] font-semibold'>{value}</p>
    </div>
  );
}

function ImgBox({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='w-20 h-16 bg-red-500 rounded-md' />
      <span className='text-xs text-primary'>{label}</span>
    </div>
  );
}

function SidebarBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        `flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm md:text-base transition-colors text-black font-bold whitespace-nowrap cursor-pointer
        `,
        !active && "text-[#858585] hover:text-black",
      )}
    >
      <Icon size={14} className={active ? "text-gray-700" : "text-gray-300"} />
      {label}
    </button>
  );
}

function PersonalTab() {
  return (
    <div className='flex flex-col gap-5 pt-7 pb-5'>
      <div className='w-20 h-20 rounded-full bg-red-500 flex-shrink-0 ml-6' />
      <div>
        <Field label='Name' value='Mark Spencer' />
        <Separator className='mb-4' />
        <Field label='Date of Birth' value='May 5th 2000' />
        <Separator className='mb-4' />
        <Field label='Gender' value='Male' />
        <Separator className='mb-4' />
        <div className='flex items-center gap-2 justify-between px-6'>
          <Field
            label='Email Address'
            value='markspencer@gmail.com'
            className='px-0'
          />
          <p className='text-xs text-green-600'>Verified</p>
        </div>
      </div>
    </div>
  );
}

function SsnTab() {
  return (
    <div className='flex flex-col gap-5 pt-7 pb-5'>
      <div>
        <Field label='Social Security Number' value='288 085 198 37' />
        <Separator className='mb-4' />
        <Field label="Driver's License Number" value='387 0966 UT' />
        <Separator className='mb-4' />
        <Field label='Issued Date' value='23 – 06 – 2025' />
        <Separator className='mb-4' />
      </div>
      <div className='px-6 flex-col flex gap-2'>
        <p className='text-sm text-[#858585]'>Uploads</p>
        <div className='flex gap-3'>
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
    <div className='flex flex-col gap-5 pt-7 pb-5 justify-between h-full'>
      {page === 1 ? (
        <div>
          <Field label='Vehicle Make' value='Tesla' />
          <Separator className='mb-4' />
          <Field label='Vehicle Model' value='Model Y' />
          <Separator className='mb-4' />
          <Field label='Vehicle Vin Number' value='0912 9883 000990' />
          <Separator className='mb-4' />
          <Field label='Vehicle Colour' value='Beige' />
          <Separator className='mb-4' />
        </div>
      ) : (
        <div className='px-6'>
          <p className='text-xs text-gray-400 mb-2'>Uploads</p>
          <div className='flex gap-3 mb-4'>
            <ImgBox label='Side front' />
            <ImgBox label='Interior' />
            <ImgBox label='Side rear' />
          </div>
          <div className='flex flex-col gap-2 w-fit'>
            <p className='text-xs text-[#858585]'>
              Vehicle Registration Document
            </p>
            <ImgBox label='Vehicle Reg' />
          </div>
        </div>
      )}
      <div className='flex items-center justify-end gap-1 mt-4 pr-4 text-xs text-primary'>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className='hover:text-gray-800 cursor-pointer'
        >
          <ChevronLeft size={18} />
        </button>
        <span className='text-sm md:text-sm'>{page}/2</span>
        <button
          onClick={() => setPage((p) => Math.min(2, p + 1))}
          className='hover:text-gray-800 cursor-pointer'
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// function InsuranceTab() {
//   return (
//     <div>
//       <Field label='Insurance Provider' value='StateFarm Auto' />
//       <Field label='Policy Number' value='SF-00192-2024' />
//       <Field label='Expiry Date' value='01 – 09 – 2026' />
//       <p className='text-xs text-gray-400 mb-2'>Insurance Document</p>
//       <ImgBox label='Insurance Doc' />
//     </div>
//   );
// }

// ── Main component ─────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "personal", label: "Personal Information", icon: User },
  { key: "ssn", label: "Social Security Data", icon: Shield },
  { key: "vehicle", label: "Vehicle Registration", icon: Car },
  //   { key: "insurance", label: "Vehicle Insurance", icon: FileText },
];

export const DriverInfoModal = ({ trigger }: { trigger: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab />;
      case "ssn":
        return <SsnTab />;
      case "vehicle":
        return <VehicleTab />;
      //   case "insurance":
      //     return <InsuranceTab />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='max-w-xl md:max-w-2xl md:min-w-2xl p-0 overflow-hidden mx-2'
      >
        <div className='flex min-h-[450px]'>
          <div className='p-4 flex flex-col gap-1 justify-between border-r border-[#CCCCCC'>
            <div className='flex flex-col gap-2'>
              {TABS.map((t) => (
                <SidebarBtn
                  key={t.key}
                  icon={t.icon}
                  label={t.label}
                  active={activeTab === t.key}
                  onClick={() => setActiveTab(t.key)}
                />
              ))}
            </div>
            <div className='flex flex-col gap-2'>
              <Button className='rounded-xl'>Verify User</Button>
              <Button
                variant='outline'
                className='text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent rounded-xl'
              >
                Reject entry
              </Button>
            </div>
          </div>

          <div className='flex-1 flex flex-col'>
            <div className='flex-1'>{renderContent()}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
