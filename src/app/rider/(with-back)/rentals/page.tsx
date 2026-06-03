"use client";

import {
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
} from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useRental } from "@/store";
import { cn } from "@/lib";
import Link from "next/link";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { MapPin, Clock, Car } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 border-amber-200",
  active: "text-emerald-600 bg-emerald-50 border-emerald-200",
  completed: "text-primary bg-primary/10 border-primary/20",
  cancelled: "text-rose-600 bg-rose-50 border-rose-200",
};

const Page = () => {
  const {
    isLoading,
    rentalHistory,
    activeRentals,
    actions: { fetchRentals, fetchActiveRentals },
  } = useRental(
    useShallow((state) => ({
      isLoading: state.isLoading,
      rentalHistory: state.rentalHistory,
      activeRentals: state.activeRentals,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    fetchRentals();
    fetchActiveRentals();
  }, [fetchActiveRentals, fetchRentals]);

  const rentals = [...activeRentals, ...rentalHistory].filter(
    (rental, index, list) =>
      list.findIndex(
        (item) => (item._id ?? item.id) === (rental._id ?? rental.id),
      ) === index,
  );

  return (
    <div className="flex flex-col gap-6">
      <HeadingHeebo className="text-start font-bold text-2xl">
        My Rentals
      </HeadingHeebo>

      {isLoading ? (
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      ) : rentals.length > 0 ? (
        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {rentals.map((rental) => {
            const rentalId = rental._id ?? rental.id ?? "";
            const status = rental.status ?? "pending";
            const statusStyle =
              STATUS_STYLES[status.toLowerCase()] ?? STATUS_STYLES.pending;
            const date = rental.pickUpTime ?? rental.createdAt;

            return (
              <div
                key={rentalId}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-4 hover:border-primary/20 transition-colors duration-200"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <p className="font-bold text-base text-black font-heebo">
                      {rental.bookingType === "SELF_DRIVE"
                        ? "Self-drive rental"
                        : "With-driver rental"}
                    </p>
                    {rental.pickUpAddress && (
                      <div className="flex items-center gap-1.5 text-xs text-gray font-light">
                        <MapPin size={11} className="text-primary shrink-0" />
                        <span className="truncate">{rental.pickUpAddress}</span>
                      </div>
                    )}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-xs font-semibold capitalize px-2.5 py-1 rounded-full border",
                      statusStyle,
                    )}
                  >
                    {status}
                  </span>
                </div>

                {/* Details row */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                    <Clock size={12} className="text-gray shrink-0" />
                    {date
                      ? new Date(date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Date pending"}
                  </div>
                  <span className="text-xs text-gray">·</span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                    <Car size={12} className="text-gray shrink-0" />
                    {rental.duration ?? 0} hour{(rental.duration ?? 0) !== 1 ? "s" : ""}
                  </div>
                  <span className="text-xs text-gray">·</span>
                  <p className="text-sm font-bold text-black font-heebo">
                    ${rental.cost?.total ?? "0.00"}
                  </p>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className="bg-primary hover:bg-primary-deep text-white rounded-xl h-9 text-xs font-semibold w-fit transition-colors duration-200 cursor-pointer"
                >
                  <Link href={`/rider/ride-details?rentalId=${rentalId}`}>
                    View details
                  </Link>
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle className="font-bold text-xl">No rentals yet</EmptyTitle>
          </EmptyHeader>
          <Button asChild className="rounded-full mt-4">
            <Link href="/rent-ride">Book a rental</Link>
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default Page;
