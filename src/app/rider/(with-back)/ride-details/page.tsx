"use client";

import { Button, HeadingHeebo } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib";
import { useCommunication, useRental, useSession } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { MapPin, Clock, Car, MessageCircle, XCircle } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  completed: "text-primary bg-primary/10 border-primary/20",
  cancelled: "text-rose-600 bg-rose-50 border-rose-200",
};

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rentalId = searchParams.get("rentalId") ?? "";
  const {
    selectedRental,
    isLoading,
    actions: { cancelRental, fetchRentalDetails },
  } = useRental(
    useShallow((state) => ({
      selectedRental: state.selectedRental,
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );
  const startConversation = useCommunication(
    (state) => state.actions.startConversation,
  );
  const { riderProfile } = useSession(
    useShallow((state) => ({ riderProfile: state.riderProfile })),
  );

  useEffect(() => {
    if (rentalId) fetchRentalDetails(rentalId);
  }, [fetchRentalDetails, rentalId]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 max-w-2xl">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const status = selectedRental?.status ?? "pending";
  const statusStyle = STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.pending;

  const detailRows = [
    {
      icon: MapPin,
      label: "Pick-up location",
      value: selectedRental?.pickUpAddress ?? "-",
    },
    {
      icon: Clock,
      label: "Pick-up time",
      value: selectedRental?.pickUpTime
        ? new Date(selectedRental.pickUpTime).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })
        : "Pending",
    },
    {
      icon: Car,
      label: "Duration",
      value: `${selectedRental?.duration ?? 0} hour${(selectedRental?.duration ?? 0) !== 1 ? "s" : ""}`,
    },
    {
      icon: Car,
      label: "Vehicle class",
      value: selectedRental?.vehicleClass ?? "-",
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <HeadingHeebo className="text-start font-bold text-2xl">
        Rental Details
      </HeadingHeebo>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p className="font-bold text-lg text-black font-heebo">
              {selectedRental?.bookingType === "SELF_DRIVE"
                ? "Self-drive rental"
                : "With-driver rental"}
            </p>
            <p className="text-xs text-gray font-light mt-0.5 capitalize">
              {selectedRental?.vehicleClass ?? ""}
            </p>
          </div>
          <span
            className={cn(
              "shrink-0 text-xs font-semibold capitalize px-3 py-1.5 rounded-full border",
              statusStyle,
            )}
          >
            {status}
          </span>
        </div>

        {/* Detail rows */}
        <div className="flex flex-col divide-y divide-gray-50">
          {detailRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-5 py-4">
              <div className="w-8 h-8 rounded-xl bg-background flex items-center justify-center shrink-0">
                <Icon size={14} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray font-light">{label}</p>
                <p className="text-sm font-semibold text-black mt-0.5 capitalize truncate">
                  {value}
                </p>
              </div>
            </div>
          ))}

          {/* Cost row */}
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <p className="text-sm text-gray font-light">Total amount</p>
            <p className="text-xl font-bold text-black font-heebo">
              ${selectedRental?.cost?.total ?? "0.00"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <Button
            disabled={!rentalId || selectedRental?.status === "cancelled"}
            onClick={() => cancelRental(rentalId)}
            className="flex items-center gap-2 rounded-xl h-10 px-5 text-sm font-semibold bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-colors cursor-pointer"
          >
            <XCircle size={15} />
            Cancel rental
          </Button>
          <Button
            disabled={
              !selectedRental?.driverId ||
              !(
                selectedRental?.riderId ??
                riderProfile?._id ??
                riderProfile?.userId
              )
            }
            onClick={async () => {
              const conversation = await startConversation({
                driverId: selectedRental?.driverId ?? "",
                riderId:
                  selectedRental?.riderId ??
                  riderProfile?._id ??
                  riderProfile?.userId ??
                  "",
              });
              if (conversation) router.push("/rider/messages");
            }}
            className="flex items-center gap-2 rounded-xl h-10 px-5 text-sm font-semibold bg-background hover:bg-primaryLight2 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
          >
            <MessageCircle size={15} />
            Message driver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
