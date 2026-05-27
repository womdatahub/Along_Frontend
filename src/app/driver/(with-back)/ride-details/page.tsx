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
    actions: { beginRental, fetchRentalDetails, finalizeRental },
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
  const { driverProfile } = useSession(
    useShallow((state) => ({ driverProfile: state.driverProfile })),
  );

  useEffect(() => {
    if (rentalId) fetchRentalDetails(rentalId);
  }, [fetchRentalDetails, rentalId]);

  if (isLoading) {
    return <Skeleton className="h-80 w-full md:w-111.5 rounded-2xl" />;
  }

  const status = selectedRental?.status ?? "pending";

  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4">Rental details</HeadingHeebo>
      <Card className="w-full md:w-111.5 rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-4">
          {[
            ["Pick up location", selectedRental?.pickUpAddress],
            [
              "Pick up time",
              selectedRental?.pickUpTime
                ? new Date(selectedRental.pickUpTime).toLocaleString()
                : "Pending",
            ],
            ["Rental mode", selectedRental?.bookingType],
            ["Vehicle type", selectedRental?.vehicleClass],
            ["Duration", `${selectedRental?.duration ?? 0} hour(s)`],
            ["Status", status],
            ["Amount", `$${selectedRental?.cost?.total ?? "0.00"}`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex gap-4 justify-between items-center border-b pb-3 text-sm"
            >
              <p className="font-medium text-placeholder">{label}</p>
              <p className="font-bold text-right capitalize">{value ?? "-"}</p>
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button
              disabled={!rentalId || status === "active"}
              onClick={() => beginRental(rentalId)}
              className="rounded-full"
            >
              Begin rental
            </Button>
            <Button
              disabled={!rentalId || status !== "active"}
              onClick={() => finalizeRental(rentalId)}
              variant="secondary"
              className="rounded-full"
            >
              Finalize
            </Button>
            <Button
              disabled={
                !selectedRental?.riderId ||
                !(
                  selectedRental?.driverId ??
                  driverProfile?._id ??
                  driverProfile?.userId
                )
              }
              onClick={async () => {
                const conversation = await startConversation({
                  driverId:
                    selectedRental?.driverId ??
                    driverProfile?._id ??
                    driverProfile?.userId ??
                    "",
                  riderId: selectedRental?.riderId ?? "",
                });
                if (conversation) router.push("/driver/messages");
              }}
              variant="outline"
              className="rounded-full"
            >
              Message rider
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
