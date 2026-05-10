"use client";
import {
  Button,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadarAutocomplete,
} from "@/components";
import {
  AccuracyIcon,
  FilledGreenStarIcon,
  LocationPointerSvg,
} from "@public/svgs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession, useRental, useRadarMap } from "@/store";
import { useShallow } from "zustand/shallow";
import Image from "next/image";
import { useEffect } from "react";

const DynamicDriversChart = dynamic(
  () => import("../../components/shared/drivers-chart"),
  { ssr: false },
);
const Page = () => {
  const router = useRouter();

  const {
    driverProfile,
    isLoading,
    actions: { logOut, setDriverAvailability },
  } = useSession(
    useShallow((state) => ({
      driverProfile: state.driverProfile,
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );

  const {
    rentalHistory,
    actions: { listVehicleForRental, delistVehicleForRental },
  } = useRental(
    useShallow((state) => ({
      rentalHistory: state.rentalHistory,
      actions: state.actions,
    })),
  );
  const fetchRentals = useRental((state) => state.actions.fetchRentals);

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      autoCompleteAddress: state.autoCompleteAddress,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  return (
    <div className="px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 md:h-[calc(100vh-80px)] md:overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-5">
          <div />

          <div className="flex gap-4 items-center">
            <Image
              alt={`${driverProfile?.firstName}-${driverProfile?.lastName}`}
              src={
                driverProfile?.driverProfilePictureUri ?? "/images/camry.png"
              }
              width={96}
              height={96}
              className="size-14 md:size-24 rounded-full object-cover bg-gray-200"
            />
            <Popover>
              <PopoverTrigger asChild>
                <p className="text-lg  cursor-pointer">
                  {driverProfile?.firstName}
                </p>
              </PopoverTrigger>
              <PopoverContent className="w-67.5 p-0">
                <div className="flex rounded-t-2xl overflow-hidden flex-col bg-white w-67.5 pt-4">
                  <div className="flex flex-col gap-4 px-4 pb-4">
                    <div className="flex gap-3 items-center">
                      <Image
                        alt={`${driverProfile?.firstName}-${driverProfile?.lastName}`}
                        src={
                          driverProfile?.driverProfilePictureUri ??
                          "/images/camry.png"
                        }
                        width={32}
                        height={32}
                        className="size-8 rounded-full object-cover bg-gray-200"
                      />
                      <p className="font-semibold text-base">
                        {driverProfile?.firstName} {driverProfile?.lastName}
                      </p>
                    </div>
                    <p
                      className="pl-11 cursor-pointer text-sm"
                      onClick={() => router.push("/driver-db/account")}
                    >
                      Profile
                    </p>
                  </div>
                  <div className="items-center gap-3 flex md:hidden justify-center pb-3">
                    <p>Driver rating</p>
                    <FilledGreenStarIcon />
                    <p>{driverProfile?.rating.numberOfRatings ?? 0}%</p>
                  </div>
                  <div
                    onClick={async () => {
                      const link = await listVehicleForRental({
                        address: autoCompleteAddress?.formattedAddress ?? "",
                        latitude: autoCompleteAddress?.latitude ?? 0,
                        longitude: autoCompleteAddress?.longitude ?? 0,
                        vehicleId: driverProfile?.vehicleId ?? "",
                      });
                      // console.log(`link gotten from api call is this: ${link}`);
                      if (link) router.push(link);
                    }}
                    className="text-center cursor-pointer font-bold"
                  >
                    List vehicle for Rent
                  </div>
                  <div
                    onClick={logOut}
                    className="p-3 bg-icons rounded-b-2xl text-center cursor-pointer text-white font-bold"
                  >
                    Sign out
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <HeadingHeebo className="text-left mt-5">Menu</HeadingHeebo>
        <div className="flex flex-col md:flex-row gap-10 md:items-stretch md:h-[calc(100vh-200px)]">
          <div className="flex flex-row md:flex-col gap-3 md:gap-10 md:border-r md:border-r-gray-5 pr-10 md:mb-32 w-fit whitespace-nowrap">
            <div className="flex gap-3 md:gap-2 justify-between flex-row md:flex-col">
              <div className="flex md:flex-col flex-row gap-5 md:gap-10">
                <Link href={"/driver-db/vehicle"}>Vehicle</Link>
                <Link href={"/driver-db/rentals"}>Rental bookings</Link>
                <Link href={"/driver-db/messages"}>Messages</Link>
                <span className="text-gray-5 cursor-not-allowed">
                  Ride - coming soon
                </span>
              </div>
              <div className="items-center gap-3 hidden md:flex">
                <p>Driver rating</p>
                <FilledGreenStarIcon />
                <p>{driverProfile?.rating.numberOfRatings ?? 0}%</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-20 overflow-y-auto md:mb-32">
            <div className="flex flex-col gap-4 w-full md:max-w-1/3 ">
              <HeadingHeebo className="text-3xl text-left">
                Manage rental demand
              </HeadingHeebo>
              <p className="">
                Keep your vehicle listed, update driver availability, and manage
                incoming rental bookings from one place.
              </p>
              <Button asChild className="w-fit rounded-full cursor-pointer">
                <Link href="/driver-db/rentals">View bookings</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 max-w-xl">
              <p className="font-semibold">Driver availability</p>
              <p className="text-sm text-gray-5">
                Make yourself available for with-driver rentals from your
                current pickup location.
              </p>
              <div className="flex flex-row gap-3">
                <Button
                  className="rounded-full"
                  disabled={!autoCompleteAddress || isLoading}
                  onClick={() =>
                    setDriverAvailability({
                      availableForDriving: true,
                      address: autoCompleteAddress?.formattedAddress,
                      latitude: autoCompleteAddress?.latitude,
                      longitude: autoCompleteAddress?.longitude,
                    })
                  }
                >
                  Available
                </Button>
                <Button
                  variant="secondary"
                  className="rounded-full"
                  disabled={isLoading}
                  onClick={() =>
                    setDriverAvailability({ availableForDriving: false })
                  }
                >
                  Unavailable
                </Button>
              </div>
            </div>
            <div className="flex gap-3 flex-col">
              <HeadingHeebo className="w-fit text-left">Earnings</HeadingHeebo>

              <DynamicDriversChart />
            </div>
          </div>
          <div className="flex flex-col gap-4 mr-5 w-full md:w-65 overflow-y-auto md:relative md:pb-32">
            <HeadingHeebo className="text-left md:sticky md:top-0 bg-background-1 pb-2">
              Activities
            </HeadingHeebo>
            {rentalHistory.length > 0 ? (
              rentalHistory.slice(0, 10).map((rental) => {
                const rentalId = rental._id ?? rental.id ?? "";
                return (
                  <div
                    key={rentalId}
                    className="flex gap-3 pb-5 border-b border-b-[#D3D3D3] cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/driver-db/ride-details?rentalId=${rentalId}`,
                      )
                    }
                  >
                    <div className="mt-5">
                      <LocationPointerSvg />
                    </div>
                    <div className="flex flex-col font-heebo">
                      <p className="text-[8px] font-medium">
                        {rental.bookingType === "SELF_DRIVE"
                          ? "Self-drive rental"
                          : "With-driver rental"}
                      </p>
                      <HeadingHeebo className="text-left text-sm">
                        {rental.pickUpAddress ?? "Pickup pending"}
                      </HeadingHeebo>
                      <p className="text-[9px] text-icons flex gap-3">
                        {rental.pickUpTime
                          ? new Date(rental.pickUpTime).toLocaleDateString()
                          : rental.createdAt
                            ? new Date(rental.createdAt).toLocaleDateString()
                            : "Pending"}
                      </p>
                      <p className="text-green-600 text-[9px] capitalize">
                        {rental.status ?? "pending"}
                      </p>
                      <HeadingHeebo className="text-left text-sm">
                        ${rental.cost?.total ?? "0.00"}
                      </HeadingHeebo>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex py-10 items-center justify-center">
                <Empty>
                  <EmptyHeader>
                    <EmptyTitle className="font-bold text-xl">
                      No recent activities
                    </EmptyTitle>
                  </EmptyHeader>
                </Empty>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
