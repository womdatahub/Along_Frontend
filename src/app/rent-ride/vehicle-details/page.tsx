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
import { cn } from "@/lib";
import { useRental } from "@/store";
import { FilledGreenStarIcon } from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const searchParams = useSearchParams();
  const vehicleType = searchParams.get("vehicleType") ?? "";
  const selectedDriver = searchParams.get("selectedDriver") ?? "";
  const isLater = searchParams.get("isLater") === "true";
  const bookingType =
    searchParams.get("bookingType") === "SELF_DRIVE"
      ? "SELF_DRIVE"
      : "WITH_DRIVER";

  const { selectedDriverDetails } = useRental(
    useShallow((state) => ({
      selectedDriverDetails: state.selectedDriverDetails,
    })),
  );

  const gallery = useMemo(
    () =>
      [
        selectedDriverDetails?.vehicleInfo?.vehicleFrontViewImageUri,
        selectedDriverDetails?.vehicleInfo?.vehicleSideViewImageUri,
        selectedDriverDetails?.vehicleInfo?.vehicleBackViewImageUri,
      ].filter(Boolean) as string[],
    [selectedDriverDetails],
  );

  if (!selectedDriverDetails) {
    return (
      <div className='px-4 md:px-0 max-w-7xl mx-auto w-full py-10'>
        <Empty>
          <EmptyHeader>
            <EmptyTitle className='text-xl font-bold'>
              Select a vehicle to view details
            </EmptyTitle>
          </EmptyHeader>
          <Button asChild className='rounded-full mt-4'>
            <Link href='/rent-ride'>Browse rentals</Link>
          </Button>
        </Empty>
      </div>
    );
  }

  const vehicle = selectedDriverDetails.vehicleInfo;
  const driver = selectedDriverDetails.driverInfo;
  const rate = Number(driver?.rideProfile?.ratePerHour ?? 0);

  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full py-8 md:py-14'>
      <div className='flex flex-col gap-6'>
        <Button
          asChild
          variant='secondary'
          className='rounded-full w-fit'
        >
          <Link
            href={{
              pathname: "/rent-ride",
              query: { vehicleType, bookingType, isLater },
            }}
          >
            Back to vehicles
          </Link>
        </Button>

        <section className='grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start'>
          <div className='flex flex-col gap-4'>
            <div className='rounded-2xl overflow-hidden bg-white'>
              <Image
                src={gallery[0] ?? "/images/camry.png"}
                alt={`${vehicle?.vehicleMake ?? "Vehicle"} ${vehicle?.vehicleModel ?? ""}`}
                width={900}
                height={560}
                className='w-full aspect-16/10 object-cover'
                priority
              />
            </div>
            <div className='grid grid-cols-3 gap-3'>
              {gallery.map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  alt={`Vehicle view ${index + 1}`}
                  width={260}
                  height={180}
                  className='w-full aspect-4/3 rounded-2xl object-cover bg-white'
                />
              ))}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div>
              <HeadingHeebo className='text-left text-4xl capitalize'>
                {vehicle?.vehicleMake} {vehicle?.vehicleModel}
              </HeadingHeebo>
              <p className='text-sm text-gray-5 capitalize'>
                {vehicle?.vehicleYear} {vehicle?.vehicleColor}{" "}
                {vehicle?.vehicleClass}
              </p>
            </div>

            <Card className='rounded-2xl shadow-none'>
              <CardContent className='flex flex-col gap-4'>
                <div className='flex items-center justify-between gap-4'>
                  <div>
                    <p className='font-bold'>
                      {driver?.firstName} {driver?.lastName}
                    </p>
                    <p className='text-sm text-gray-5'>Approved owner/driver</p>
                  </div>
                  <div className='flex items-center gap-2 font-bold'>
                    <FilledGreenStarIcon />
                    <span>{driver?.rating?.numberOfRatings ?? 0}</span>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-3 text-sm'>
                  {[
                    ["Rental mode", bookingType === "SELF_DRIVE" ? "Self-drive" : "With driver"],
                    ["Seats", `${selectedDriverDetails.capacity ?? 0}`],
                    ["Pets", driver?.rideProfile?.allowPets ? "Allowed" : "Not allowed"],
                    ["Location", selectedDriverDetails.address],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className='rounded-2xl bg-background-1 px-4 py-3'
                    >
                      <p className='text-gray-5 text-xs'>{label}</p>
                      <p className='font-bold capitalize'>{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className='rounded-2xl shadow-none'>
              <CardContent className='flex flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-5'>Hourly rate</p>
                  <p className='font-bold'>${rate.toFixed(2)}</p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-5'>Payment</p>
                  <p className='font-bold'>Stripe checkout</p>
                </div>
                <div className='flex items-center justify-between'>
                  <p className='text-gray-5'>Status</p>
                  <p
                    className={cn(
                      "font-bold capitalize",
                      selectedDriverDetails.status === "available"
                        ? "text-green-600"
                        : "text-red-500",
                    )}
                  >
                    {selectedDriverDetails.status}
                  </p>
                </div>
                <Button
                  asChild
                  className='rounded-full mt-2'
                  disabled={selectedDriverDetails.status !== "available"}
                >
                  <Link
                    href={{
                      pathname: "/rent-ride",
                      query: {
                        selectedDriver,
                        vehicleType,
                        isLater,
                        bookingType,
                      },
                    }}
                  >
                    Continue booking
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
