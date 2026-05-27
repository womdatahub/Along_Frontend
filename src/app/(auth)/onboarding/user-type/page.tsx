"use client";

import {
  AuthBackAndContinueButton,
  TermsModal,
} from "@/components";
import { cn } from "@/lib";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car, User } from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [selected, setSelected] = useState<"rider" | "driver" | "">("");
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  return (
    <div className="flex justify-center items-center min-h-full w-full px-4 py-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-black font-heebo mb-2 tracking-tight">
            How will you use Along?
          </h1>
          <p className="text-gray text-sm font-light">
            Select your account type to get started
          </p>
        </div>

        <div className="bg-background rounded-3xl px-6 md:px-8 py-8 shadow-sm flex flex-col gap-6">
          {/* Role cards */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setSelected("rider")}
              className={cn(
                "flex gap-5 px-5 py-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 items-center border-2 text-left group",
                selected === "rider"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent hover:border-gray-2",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200",
                  selected === "rider"
                    ? "bg-primary/10"
                    : "bg-background group-hover:bg-primary/5",
                )}
              >
                {selected === "rider" ? (
                  <Image
                    src="/images/passenger.png"
                    alt="rider"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                ) : (
                  <User size={24} className="text-gray" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-black font-heebo">
                  Rider
                </p>
                <p className="text-xs text-gray font-light mt-0.5">
                  Book rides, schedule trips, and travel comfortably
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center",
                  selected === "rider"
                    ? "border-primary bg-primary"
                    : "border-gray-2",
                )}
              >
                {selected === "rider" && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </button>

            <button
              onClick={() => setSelected("driver")}
              className={cn(
                "flex gap-5 px-5 py-5 bg-white rounded-2xl cursor-pointer transition-all duration-200 items-center border-2 text-left group",
                selected === "driver"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-transparent hover:border-gray-2",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors duration-200",
                  selected === "driver"
                    ? "bg-primary/10"
                    : "bg-background group-hover:bg-primary/5",
                )}
              >
                {selected === "driver" ? (
                  <Image
                    src="/images/driver.png"
                    alt="driver"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                ) : (
                  <Car size={24} className="text-gray" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-bold text-base text-black font-heebo">
                  Driver
                </p>
                <p className="text-xs text-gray font-light mt-0.5">
                  Earn by driving — set your own schedule and routes
                </p>
              </div>
              <div
                className={cn(
                  "size-5 rounded-full border-2 shrink-0 transition-all duration-200 flex items-center justify-center",
                  selected === "driver"
                    ? "border-primary bg-primary"
                    : "border-gray-2",
                )}
              >
                {selected === "driver" && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          </div>

          <TermsModal
            acceptFunction={() => {
              setIsTermsModalOpen(false);
              router.push("/onboarding/driver-info");
            }}
            isTermsModalOpen={isTermsModalOpen}
            setIsTermsModalOpen={setIsTermsModalOpen}
            trigger={<div key="1" />}
          />

          <AuthBackAndContinueButton
            backActive
            continueActive={!!selected}
            continueFnc={() => {
              if (selected === "driver") {
                setIsTermsModalOpen(true);
                return;
              }
              router.push(`/onboarding/${selected}`);
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
