"use client";

import {
  Button,
  Card,
  CardContent,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
} from "@/components";
import { Skeleton } from "@/components/ui/skeleton";
import { useRental } from "@/store";
import Link from "next/link";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

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
      list.findIndex((item) => (item._id ?? item.id) === (rental._id ?? rental.id)) ===
      index,
  );

  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>My rentals</HeadingHeebo>
      {isLoading ? (
        <div className='flex flex-col gap-3 w-full md:w-130'>
          <Skeleton className='h-28 rounded-2xl' />
          <Skeleton className='h-28 rounded-2xl' />
        </div>
      ) : rentals.length > 0 ? (
        <div className='grid gap-4 w-full md:w-140'>
          {rentals.map((rental) => {
            const rentalId = rental._id ?? rental.id ?? "";
            return (
              <Card key={rentalId} className='rounded-2xl shadow-none'>
                <CardContent className='flex flex-col gap-3'>
                  <div className='flex items-start justify-between gap-4'>
                    <div>
                      <p className='font-bold'>
                        {rental.bookingType === "SELF_DRIVE"
                          ? "Self-drive rental"
                          : "With-driver rental"}
                      </p>
                      <p className='text-sm text-gray-5'>
                        {rental.pickUpAddress ?? "Pickup pending"}
                      </p>
                    </div>
                    <p className='text-sm font-bold capitalize text-primary'>
                      {rental.status ?? "pending"}
                    </p>
                  </div>
                  <div className='grid grid-cols-2 gap-3 text-sm'>
                    <p>Duration: {rental.duration ?? 0} hour(s)</p>
                    <p className='text-right'>${rental.cost?.total ?? "0.00"}</p>
                  </div>
                  <Button asChild className='rounded-full w-fit'>
                    <Link href={`/rider-db/ride-details?rentalId=${rentalId}`}>
                      View details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle className='font-bold text-xl'>
              No rentals yet
            </EmptyTitle>
          </EmptyHeader>
          <Button asChild className='rounded-full mt-4'>
            <Link href='/rent-ride'>Book a rental</Link>
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default Page;
