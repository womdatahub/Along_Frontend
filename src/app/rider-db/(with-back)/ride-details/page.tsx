"use client";

import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunication, useRental, useSession } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

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
    return <Skeleton className="h-80 w-full md:w-105.5 rounded-2xl" />;
  }

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">Rental details</HeadingHeebo>
      <Card className="w-full md:w-105.5 rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-4 px-6">
          <p className="font-heebo font-semibold text-xl text-primary">
            {selectedRental?.bookingType === "SELF_DRIVE"
              ? "Self-drive rental"
              : "With-driver rental"}
          </p>
          {[
            ["Pick up location", selectedRental?.pickUpAddress],
            [
              "Pick up time",
              selectedRental?.pickUpTime
                ? new Date(selectedRental.pickUpTime).toLocaleString()
                : "Pending",
            ],
            ["Duration", `${selectedRental?.duration ?? 0} hour(s)`],
            ["Vehicle type", selectedRental?.vehicleClass],
            ["Status", selectedRental?.status ?? "pending"],
            ["Amount", `$${selectedRental?.cost?.total ?? "0.00"}`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b pb-3 text-sm"
            >
              <p className="text-gray-5">{label}</p>
              <p className="font-bold text-right capitalize">{value ?? "-"}</p>
            </div>
          ))}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              disabled={!rentalId || selectedRental?.status === "cancelled"}
              onClick={() => cancelRental(rentalId)}
              variant="destructive"
              className="rounded-full"
            >
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
                if (conversation) router.push("/rider-db/messages");
              }}
              variant="secondary"
              className="rounded-full"
            >
              Message driver
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
