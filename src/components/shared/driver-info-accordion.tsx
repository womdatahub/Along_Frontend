import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Empty,
  EmptyContent,
  EmptyTitle,
  HeadingHeebo,
} from "@/components";
import { VehicleLocation } from "@/types";
import {
  DistanceTraveledIcon,
  FilledGreenStarIcon,
  PassengerCapacityIcon,
  PetIcons,
  RideRentCarIcon,
} from "@public/svgs";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
import { useRental } from "@/store";
import { useShallow } from "zustand/shallow";
import Link from "next/link";

type Props = {
  func: (selectedDriver: VehicleLocation) => void;
  vehicleType: string;
  isLater: boolean;
  bookingType: "SELF_DRIVE" | "WITH_DRIVER";
};
export const DriverInfoAccordion = ({
  func,
  vehicleType,
  isLater,
  bookingType,
}: Props) => {
  const { isLoadingRental, availableVehicles } = useRental(
    useShallow((state) => ({
      actions: state.actions,
      availableVehicles: state.availableVehicles,
      isLoadingRental: state.isLoading,
    })),
  );

  if (isLoadingRental) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className=" h-16 rounded-lg" />
        <Skeleton className=" h-16 rounded-lg" />
        <Skeleton className=" h-16 rounded-lg" />
      </div>
    );
  }

  if ((availableVehicles ?? []).length === 0) {
    return (
      <Empty>
        <EmptyContent>
          <EmptyTitle className="text-sm">
            There are no available vehicles with vehicle type: {vehicleType}{" "}
            around your location
          </EmptyTitle>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full flex flex-col gap-4"
      defaultValue="item-1"
    >
      {(availableVehicles ?? []).map((vehicle, i) => {
        const carConditions = [
          {
            title: "Type",
            content: vehicle.vehicleInfo?.vehicleMake,
          },
          {
            title: "Comfort",
            content: "Fully Air-conditioned",
          },
          {
            title: "Safety",
            content: "Passenger/Rear Airbag",
          },
          {
            title: "License",
            content: vehicle.vehicleInfo?.vehicleIdentificationNumber,
          },
        ];

        return (
          <AccordionItem
            key={i}
            value={`
            ${vehicle.driverInfo?.firstName} ${vehicle.driverInfo?.lastName}-
            ${vehicle.vehicleInfo?.vehicleModel}-${vehicle.vehicleId}`}
            className="border-b-0 bg-white rounded-2xl "
          >
            <AccordionTrigger className="hover:no-underline cursor-pointer pr-4 py-2 items-center">
              <div className="flex gap-8 justify-between w-full items-center">
                <div className="flex gap-8 items-center">
                  <Image
                    src={vehicle.vehicleInfo.vehicleSideViewImageUri}
                    alt={"car"}
                    width={40}
                    height={40}
                    className="w-25 aspect-square object-cover rounded-2xl"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-base capitalize">
                      {vehicle.vehicleInfo?.vehicleMake} -{" "}
                      {vehicle.vehicleInfo?.vehicleModel}
                    </p>
                    <p className="text-sm text-gray-3 capitalize">
                      {`${vehicle.driverInfo?.firstName} ${vehicle.driverInfo?.lastName}  `}{" "}
                    </p>
                    <p className="text-[10px] text-primary font-semibold">
                      {bookingType === "SELF_DRIVE"
                        ? "Self-drive"
                        : "With driver"}
                    </p>
                  </div>
                </div>
                <p className="font-extrabold text-lg">
                  ${vehicle.driverInfo.rideProfile?.ratePerHour}
                  .00/hr
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-10 px-4">
              <div className="flex gap-4 items-center">
                {carConditions.map((condition, i) => {
                  return (
                    <div
                      key={i}
                      className="flex flex-col bg-background rounded-xl flex-1 px-2 py-3"
                    >
                      <p className="font-medium text-[10px] text-gray-4">
                        {condition.title}
                      </p>
                      <p className="font-semibold text-[9px]">
                        {condition.content}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-1">
                <HeadingHeebo className="font-fustat text-base font-semibold text-left">
                  Driver Information
                </HeadingHeebo>
                <div className="flex rounded-2xl p-3 gap-4 items-center justify-between bg-primaryLight2">
                  <div className="flex gap-4 items-center">
                    <div className="p-0.5 rounded-full bg-white">
                      <Image
                        src={vehicle.driverInfo?.driverProfilePictureUri ?? ""}
                        alt="profile-image"
                        className="rounded-full w-16.5 object-cover aspect-square"
                        width={40}
                        height={40}
                      />
                    </div>
                    <HeadingHeebo className="font-fustat text-xl font-semibold text-left">
                      {`${vehicle.driverInfo?.firstName} ${vehicle.driverInfo?.lastName}`}
                    </HeadingHeebo>
                  </div>
                  <div className="flex items-center gap-2 text-lg">
                    <FilledGreenStarIcon />
                    <p>{vehicle.driverInfo?.rating?.numberOfRatings} Rating</p>
                  </div>
                </div>
              </div>
              <div className="flex px-3">
                <div className="flex gap-4 items-center w-1/2">
                  <RideRentCarIcon />
                  <div className="flex flex-col">
                    <p className="font-bold text-sm">{0}</p>
                    <p className="text-xs">Completed rides</p>
                  </div>
                </div>
                <div className="flex gap-4 items-center border-l border-l-[#CDD4D4] w-1/2 pl-10">
                  <DistanceTraveledIcon />
                  <div className="flex flex-col">
                    <p className="font-bold text-sm">{0}ml</p>
                    <p className="text-xs">Distance shared</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <HeadingHeebo className="font-fustat text-base font-semibold text-left border-b border-b-[#EDEDED] pb-3">
                  Driver Preference
                </HeadingHeebo>
                <div className="flex justify-between gap-6 items-center border-b border-b-[#EDEDED] pb-3">
                  <div className="flex gap-6 items-center">
                    <PassengerCapacityIcon />
                    <p className="font-semibold text-sm">Passenger Capacity</p>
                  </div>
                  <p className="text-base">{vehicle.capacity} Persons</p>
                </div>
                <div className="flex justify-between gap-6 items-center border-b border-b-[#EDEDED] pb-3">
                  <div className="flex gap-6 items-center">
                    <PetIcons />
                    <p className="font-semibold text-sm">Pets</p>
                  </div>
                  <p className="text-base">
                    {vehicle.driverInfo.rideProfile.allowPets
                      ? "Allowed"
                      : "Not allowed"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => {
                    func(vehicle);
                  }}
                  className="w-fit rounded-2xl hover:cursor-pointer"
                  asChild
                >
                  <Link
                    href={{
                      pathname: "/rent-ride/vehicle-details",
                      query: {
                        selectedDriver: vehicle.vehicleId,
                        vehicleType,
                        isLater,
                        bookingType,
                      },
                    }}
                  >
                    View details
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    func(vehicle);
                  }}
                  variant="secondary"
                  className="w-fit rounded-2xl hover:cursor-pointer"
                  asChild
                >
                  <Link
                    href={{
                      query: {
                        selectedDriver: vehicle.vehicleId,
                        vehicleType,
                        isLater,
                        bookingType,
                      },
                    }}
                  >
                    Book
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
