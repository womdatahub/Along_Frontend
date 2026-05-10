"use client";
import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import { useRental, useSession } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const { driverProfile } = useSession(
    useShallow((state) => ({
      driverProfile: state.driverProfile,
    })),
  );
  const delistVehicleForRental = useRental(
    (state) => state.actions.delistVehicleForRental,
  );
  const carInfo = [
    {
      title: "Car make",
      value: driverProfile?.vehicleMake ?? "",
    },
    {
      title: "Model",
      value: driverProfile?.vehicleModel ?? "",
    },
    {
      title: "Year",
      value: driverProfile?.vehicleYear ?? "",
    },
    {
      title: "Color",
      value: driverProfile?.vehicleColor ?? "",
    },
    {
      title: "License number",
      value: driverProfile?.vehicleIdentificationNumber ?? "",
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <HeadingHeebo className="text-start pl-4 mb-11">Vehicle</HeadingHeebo>
      <Card className="w-full md:w-111.5 rounded-2xl shadow-none">
        <CardContent className="flex flex-col gap-4">
          <Image
            alt={`${driverProfile?.vehicleMake}-${driverProfile?.vehicleModel}`}
            src={driverProfile?.vehicleFrontViewImageUri ?? "/images/camry.png"}
            width={446}
            height={446}
            className="-mt-20 max-w-75.5 rounded-lg"
          />
          {carInfo.map((i) => {
            return (
              <div
                key={i.title}
                className="flex gap-4 justify-between items-center border-b last:mb-10 pb-4 border-b-[#D0DCDD] text-sm"
              >
                <p className="font-medium text-placeholder">{i.title}</p>
                <p className="font-bold capitalize">{i.value}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-111.5">
        <Button className="cursor-pointer text-sm rounded-full" asChild>
          <Link href="/driver-db/vehicle-reg">Update vehicle</Link>
        </Button>
        <Button
          variant="secondary"
          className="cursor-pointer text-sm rounded-full"
          disabled={!driverProfile?.vehicleId}
          onClick={() => delistVehicleForRental(driverProfile?.vehicleId ?? "")}
        >
          Delist from rentals
        </Button>
      </div>
    </div>
  );
};
export default Page;
