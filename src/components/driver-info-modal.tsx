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

// ── Types ──────────────────────────────────────────────────────────
type Tab = "personal" | "ssn" | "vehicle" | "insurance";

// ── Helpers ────────────────────────────────────────────────────────
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className='mb-4'>
      <p className='text-xs text-gray-400 mb-0.5'>{label}</p>
      <p className='text-sm font-medium text-gray-800'>{value}</p>
    </div>
  );
}

function ImgBox({ label }: { label: string }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <div className='w-20 h-16 bg-red-500 rounded-md' />
      <span className='text-xs text-gray-400'>{label}</span>
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
      className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
        active
          ? "text-gray-900 font-semibold"
          : "text-gray-400 hover:text-gray-600"
      }`}
    >
      <Icon size={14} className={active ? "text-gray-700" : "text-gray-300"} />
      {label}
    </button>
  );
}

// ── Tab content ────────────────────────────────────────────────────
function PersonalTab() {
  return (
    <div className='flex gap-5'>
      <div className='w-20 h-20 rounded-full bg-red-500 flex-shrink-0' />
      <div>
        <Field label='Name' value='Mark Spencer' />
        <Field label='Date of Birth' value='May 5th 2000' />
        <Field label='Gender' value='Male' />
        <div>
          <p className='text-xs text-gray-400 mb-0.5'>Email Address</p>
          <div className='flex items-center gap-2'>
            <p className='text-sm font-medium text-gray-800'>
              markspencer@gmail.com
            </p>
            <Badge
              variant='outline'
              className='text-xs text-green-600 border-green-300 bg-green-50'
            >
              Verified
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function SsnTab() {
  return (
    <div>
      <Field label='Social Security Number' value='288 085 198 37' />
      <Field label="Driver's License Number" value='387 0966 UT' />
      <Field label='Issued Date' value='23 – 06 – 2025' />
      <p className='text-xs text-gray-400 mb-2'>Uploads</p>
      <div className='flex gap-3'>
        <ImgBox label='Front' />
        <ImgBox label='Back' />
        <ImgBox label='Advanced' />
      </div>
    </div>
  );
}

function VehicleTab() {
  const [page, setPage] = useState(1);
  return (
    <div>
      {page === 1 ? (
        <>
          <Field label='Vehicle Make' value='Tesla' />
          <Field label='Vehicle Model' value='Model Y' />
          <Field label='Vehicle Vin Number' value='0912 9883 000990' />
          <Field label='Vehicle Colour' value='Beige' />
        </>
      ) : (
        <>
          <p className='text-xs text-gray-400 mb-2'>Uploads</p>
          <div className='flex gap-3 mb-4'>
            <ImgBox label='Side front' />
            <ImgBox label='Interior' />
            <ImgBox label='Side rear' />
          </div>
          <p className='text-xs text-gray-400 mb-2'>
            Vehicle Registration Document
          </p>
          <ImgBox label='Vehicle Reg' />
        </>
      )}
      <div className='flex items-center justify-end gap-1 mt-4 text-xs text-gray-500'>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className='hover:text-gray-800'
        >
          <ChevronLeft size={15} />
        </button>
        <span>{page}/2</span>
        <button
          onClick={() => setPage((p) => Math.min(2, p + 1))}
          className='hover:text-gray-800'
        >
          <ChevronRight size={15} />
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
      <DialogContent className='max-w-2xl p-0 overflow-hidden'>
        <div className='flex min-h-[380px]'>
          {/* Sidebar */}
          <div className='w-52 bg-gray-50 border-r border-gray-100 p-4 flex flex-col gap-1 flex-shrink-0'>
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

          {/* Content area */}
          <div className='flex-1 flex flex-col p-6'>
            <div className='flex-1'>{renderContent()}</div>
            <Separator className='mb-3' />
            <div className='flex flex-col gap-2'>
              <Button className='bg-teal-600 hover:bg-teal-700 text-white w-full text-sm'>
                Verify User
              </Button>
              <Button
                variant='outline'
                className='text-red-500 border-red-300 hover:bg-red-50 w-full text-sm'
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
