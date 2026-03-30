"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User, Shield, Car, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib";
import { DriverProfile } from "@/types";
import Image from "next/image";
import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { LoadingSpinner } from "../shared";
import { ConfirmActionModal } from "../confirm-action-modal";

type Tab = "personal" | "ssn" | "vehicle";

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
      <p className='text-sm text-gray-3'>{label}</p>
      <p className='text-[15px] font-semibold text-gray-900'>{value}</p>
    </div>
  );
}

function ImgBox({ label, img }: { label: string; img: string }) {
  return (
    <div className='flex flex-col items-center gap-1'>
      <Image
        src={img}
        alt={`Driver profile picture`}
        width={36}
        height={36}
        className='w-16 h-14 sm:w-20 sm:h-16 bg-gray-200 rounded-md object-cover'
      />
      <span className='text-xs text-primary'>{label}</span>
    </div>
  );
}

function PersonalTab({ driverInfo }: { driverInfo: DriverProfile | null }) {
  return (
    <div>
      <div className='px-5 py-5'>
        <Image
          src={driverInfo?.driverProfilePictureUri ?? "/images/placeholder.jpg"}
          alt={`${driverInfo?.firstName} ${driverInfo?.lastName} profile picture`}
          width={36}
          height={36}
          className='size-9 rounded-full object-cover'
        />{" "}
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field
          label='Name'
          value={`${driverInfo?.firstName} ${driverInfo?.lastName}`}
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field
          label='Date of Birth'
          value={driverInfo?.dateOfBirth ?? ""}
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field
          label='Gender'
          value={driverInfo?.gender ?? ""}
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4 flex items-start justify-between gap-4'>
        <Field
          label='Email Address'
          value={driverInfo?.email ?? ""}
          className='lowercase'
        />
        <p className='text-xs text-green-600 font-medium shrink-0 mt-5'>
          Verified
        </p>
      </div>
    </div>
  );
}

function SsnTab({ driverInfo }: { driverInfo: DriverProfile | null }) {
  return (
    <div>
      <div className='px-5 py-4'>
        <Field
          label='Social Security Number'
          value={driverInfo?.driverSocialSecurityNumber ?? ""}
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field
          label="Driver's License Number"
          value={driverInfo?.vehicleIdentificationNumber ?? ""}
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <Field
          label='Issued Date'
          value='23 – 06 – 2025'
          className='capitalize'
        />
      </div>
      <Separator />
      <div className='px-5 py-4'>
        <p className='text-sm text-gray-3 mb-3'>Uploads</p>
        <div className='flex gap-3 flex-wrap'>
          <ImgBox
            label='Front'
            img={driverInfo?.driverLincenseFrontViewUri ?? ""}
          />
          <ImgBox
            label='Back'
            img={driverInfo?.driverLincenseBackViewUri ?? ""}
          />
        </div>
      </div>
    </div>
  );
}

function VehicleTab({ driverInfo }: { driverInfo: DriverProfile | null }) {
  const [page, setPage] = useState(1);
  return (
    <div className='flex flex-col min-h-full'>
      <div className='flex-1'>
        {page === 1 ? (
          <>
            <div className='px-5 py-4'>
              <Field
                label='Vehicle Make'
                value={driverInfo?.vehicleMake ?? ""}
                className='capitalize'
              />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field
                label='Vehicle Model'
                value={driverInfo?.vehicleModel ?? ""}
                className='capitalize'
              />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field
                label='Vehicle Vin Number'
                value={driverInfo?.vehicleIdentificationNumber ?? ""}
                className='capitalize'
              />
            </div>
            <Separator />
            <div className='px-5 py-4'>
              <Field
                label='Vehicle Color'
                value={driverInfo?.vehicleColor ?? ""}
                className='capitalize'
              />
            </div>
            <Separator />
          </>
        ) : (
          <div className='px-5 py-4'>
            <p className='text-sm text-gray-3 mb-3'>Uploads</p>
            <div className='flex gap-3 flex-wrap mb-5'>
              <ImgBox
                label='Side front'
                img={driverInfo?.vehicleFrontViewImageUri ?? ""}
              />
              <ImgBox
                label='Interior'
                img={driverInfo?.vehicleBackViewImageUri ?? ""}
              />
              <ImgBox
                label='Side rear'
                img={driverInfo?.vehicleSideViewImageUri ?? ""}
              />
            </div>
            {/* <p className='text-sm text-gray-3 mb-3'>
              Vehicle Registration Document
            </p>
            <ImgBox label='Vehicle Reg' img={driverInfo?.??''} /> */}
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

export const DriverPendingInfoModal = ({
  trigger,
}: {
  trigger: React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("personal");

  const {
    actions: { processDriverKYC },
    singleDriverDetails,
    isLoading,
    isProcessingKYC,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      singleDriverDetails: state.singleDriverDetails,
      isLoading: state.isLoading,
      isProcessingKYC: state.isProcessingKYC,
    })),
  );

  const renderContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalTab driverInfo={singleDriverDetails} />;
      case "ssn":
        return <SsnTab driverInfo={singleDriverDetails} />;
      case "vehicle":
        return <VehicleTab driverInfo={singleDriverDetails} />;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      {isLoading ? (
        <DialogContent
          dialogTitle='Loading'
          className='max-w-sm md:max-w-210 min-h-[50vh] p-0 overflow-y-auto overflow-x-hidden rounded-2xl gap-0 [&>button]:hidden flex justify-center items-center'
        >
          <LoadingSpinner />
        </DialogContent>
      ) : (
        <DialogContent
          dialogTitle='Driver Information'
          className={cn(
            "p-0 gap-0 overflow-hidden",
            "w-[calc(100vw-20px)] max-w-[calc(100vw-20px)]",
            "sm:w-180 sm:max-w-180 sm:min-w-180",
            "max-h-[90dvh] flex flex-col",
            "[&>button.absolute]:hidden",
          )}
        >
          <div className='flex flex-col sm:flex-row flex-1 min-h-0 sm:min-h-112/5'>
            <div className='flex sm:hidden border-b border-[#CCCCCC] shrink-0 bg-white'>
              {TABS.map(({ key, shortLabel, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors border-b-2 -mb-px",
                    activeTab === key
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-3",
                  )}
                >
                  <Icon size={15} />
                  {shortLabel}
                </button>
              ))}
            </div>
            <div className='hidden sm:flex flex-col justify-between border-r border-[#CCCCCC] p-4 shrink-0'>
              <div className='flex flex-col gap-1'>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      "flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm md:text-base font-bold transition-colors whitespace-nowrap cursor-pointer",
                      activeTab !== key && "text-gray-3",
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
                <Button
                  className='rounded-xl text-sm'
                  onClick={() =>
                    processDriverKYC({
                      driverId: singleDriverDetails?.driverId ?? "",
                      action: "APPROVE",
                    })
                  }
                  disabled={isProcessingKYC}
                >
                  Verify User
                </Button>

                <ConfirmActionModal
                  trigger={
                    <Button
                      variant='outline'
                      className='text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent rounded-xl text-sm'
                      disabled={isProcessingKYC}
                    >
                      Reject entry
                    </Button>
                  }
                  title='Reject driver'
                  description='Are you sure you want to reject this driver? This action cannot be undone.'
                  confirmActionFunction={async (values) => {
                    await processDriverKYC({
                      driverId: singleDriverDetails?.driverId ?? "",
                      action: "REJECT",
                      reason: values?.reason ?? "",
                    });
                  }}
                  type='reject-kyc'
                />
              </div>
            </div>
            <div className='flex-1 flex flex-col min-h-0 min-w-0'>
              <div className='flex-1 overflow-y-auto'>{renderContent()}</div>

              <div className='sm:hidden shrink-0 border-t border-gray-200 p-4 flex flex-col gap-2 bg-white'>
                <Button
                  onClick={() =>
                    processDriverKYC({
                      driverId: singleDriverDetails?.driverId ?? "",
                      action: "APPROVE",
                    })
                  }
                  className='rounded-xl text-sm w-full'
                >
                  Verify User
                </Button>

                <ConfirmActionModal
                  trigger={
                    <Button
                      variant='outline'
                      className='text-red-500 border-red-500 hover:text-red-500 hover:bg-transparent rounded-xl text-sm w-full'
                      disabled={isProcessingKYC}
                    >
                      Reject entry
                    </Button>
                  }
                  title='Reject driver'
                  description='Are you sure you want to reject this driver? This action cannot be undone.'
                  confirmActionFunction={async (values) => {
                    await processDriverKYC({
                      driverId: singleDriverDetails?.driverId ?? "",
                      action: "REJECT",
                      reason: values?.reason ?? "",
                    });
                  }}
                  type='reject-kyc'
                />
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
