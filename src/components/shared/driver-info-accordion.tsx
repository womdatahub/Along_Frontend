import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
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

type Props = {
  driverInfo: {
    name: string;
    carName: string;
    price: number;
    image: string;
    rating: number;
    completedRides: number;
    distanceTraveled: number;
    passengerCapacity: number;
    petsAllowed: boolean;
    carConditions: {
      title: string;
      content: string;
    }[];
  }[];
  vehicle: VehicleLocation;
  func: (selectedDriver: VehicleLocation) => void;
};
export const DriverInfoAccordion = ({ driverInfo, vehicle, func }: Props) => {
  return (
    <Accordion
      type='single'
      collapsible
      className='w-full flex flex-col gap-4'
      defaultValue='item-1'
    >
      {driverInfo.map((info, i) => {
        return (
          <AccordionItem
            key={i}
            value={` 
            ${vehicle.driverInfo.firstName} ${vehicle.driverInfo.lastName}-
            ${vehicle.vehicleInfo.vehicleModel}`}
            className='border-b-0 bg-white rounded-2xl '
          >
            <AccordionTrigger className='hover:no-underline cursor-pointer pr-4 py-2 items-center'>
              <div className='flex gap-8 justify-between w-full items-center'>
                <div className='flex gap-8 items-center'>
                  <Image
                    src={"/images/small-car.png"}
                    alt={"car"}
                    width={40}
                    height={40}
                    className='w-[100px]'
                  />
                  <div className='flex flex-col'>
                    <p className='font-semibold text-base'>
                      {vehicle.vehicleInfo.vehicleModel} -{" "}
                      {vehicle.vehicleInfo.vehicleMake}
                      {/* {info.carName} */}
                    </p>
                    <p className='text-sm text-[#858585]'>
                      {`${vehicle.driverInfo.firstName} ${vehicle.driverInfo.lastName}  `}{" "}
                      {/* {info.name} */}
                    </p>
                  </div>
                </div>
                <p className='font-extrabold text-lg'>
                  ${vehicle.driverInfo.rideProfile.ratePerHour}
                  {/* {info.price} */}
                  .00/hr
                </p>
              </div>
            </AccordionTrigger>
            <AccordionContent className='flex flex-col gap-10 px-4'>
              <div className='flex gap-4 items-center'>
                {info.carConditions.map((condition, i) => {
                  return (
                    <div
                      key={i}
                      className='flex flex-col bg-background-1 rounded-xl flex-1 px-2 py-3'
                    >
                      <p className='font-medium text-[10px] text-gray-4'>
                        {condition.title}
                      </p>
                      <p className='font-semibold text-[9px]'>
                        {condition.content}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className='flex flex-col gap-1'>
                <HeadingHeebo className='font-fustat text-base font-semibold text-left'>
                  Driver Information
                </HeadingHeebo>
                <div className='flex rounded-2xl p-3 gap-4 items-center justify-between bg-primaryLight2'>
                  <div className='flex gap-4 items-center'>
                    <div className='p-[2px] rounded-full bg-white'>
                      <Image
                        src={"/images/profile.jpg"}
                        alt='profile-image'
                        className='rounded-full w-[66px] object-cover aspect-square'
                        width={40}
                        height={40}
                      />
                    </div>
                    <HeadingHeebo className='font-fustat text-xl font-semibold text-left'>
                      {`${vehicle.driverInfo.firstName} ${vehicle.driverInfo.lastName}  `}{" "}
                      {/* {info.name} */}
                    </HeadingHeebo>
                  </div>
                  <div className='flex items-center gap-2 text-lg'>
                    <FilledGreenStarIcon />
                    <p>
                      {vehicle.driverInfo.rating.numberOfRatings}
                      {/* {info.rating}{" "} */}
                      Rating
                    </p>
                  </div>
                </div>
              </div>
              <div className='flex px-3'>
                <div className='flex gap-4 items-center w-1/2'>
                  <RideRentCarIcon />
                  <div className='flex flex-col'>
                    <p className='font-bold text-sm'>{info.completedRides}</p>
                    <p className='text-xs'>Completed rides</p>
                  </div>
                </div>
                <div className='flex gap-4 items-center border-l border-l-[#CDD4D4] w-1/2 pl-10'>
                  <DistanceTraveledIcon />
                  <div className='flex flex-col'>
                    <p className='font-bold text-sm'>
                      {info.distanceTraveled}ml
                    </p>
                    <p className='text-xs'>Distance shared</p>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-4'>
                <HeadingHeebo className='font-fustat text-base font-semibold text-left border-b border-b-[#EDEDED] pb-3'>
                  Driver Preference
                </HeadingHeebo>
                <div className='flex justify-between gap-6 items-center border-b border-b-[#EDEDED] pb-3'>
                  <div className='flex gap-6 items-center'>
                    <PassengerCapacityIcon />
                    <p className='font-semibold text-sm'>Passenger Capacity</p>
                  </div>
                  <p className='text-base'>
                    {vehicle.capacity}
                    {/* {info.passengerCapacity}  */}
                    Persons
                  </p>
                </div>
                <div className='flex justify-between gap-6 items-center border-b border-b-[#EDEDED] pb-3'>
                  <div className='flex gap-6 items-center'>
                    <PetIcons />
                    <p className='font-semibold text-sm'>Pets</p>
                  </div>
                  <p className='text-base'>
                    {vehicle.driverInfo.rideProfile.allowPets
                      ? "Allowed"
                      : "Not allowed"}
                    {/* {info.petsAllowed ? "Allowed" : "Not allowed"} */}
                  </p>
                </div>
              </div>
              <Button
                onClick={() =>
                  func(
                    vehicle
                    // info.carConditions[info.carConditions.length - 1].content
                    //   .toLowerCase()
                    //   .replace(/\s+/g, "-")
                  )
                }
                className='w-fit rounded-2xl hover:cursor-pointer'
              >
                Book
              </Button>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
