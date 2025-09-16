"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DriverInfoAccordion,
  HeadingHeebo,
} from "@/components";
import { cn } from "@/lib";
import { AccuracyIcon, EditIcon, WhiteForwardIcon } from "@public/svgs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  return (
    // IF YOU WANT THE PAGE TO BE SCROLLABLE WITHOUT THE NAVBAR BECOMING TRANSPARENT, YOU SHOULD LEAVE THE h and the overflow. OTHERWISE REMOVE IT
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-y-scroll'>
      <div className='flex gap-4 '>
        <div className='flex flex-col gap-10 w-1/2'>
          <div className='flex flex-col'>
            <HeadingHeebo className='text-left font-extrabold text-4xl'>
              Rent a ride
            </HeadingHeebo>
            <p className='text-sm'>
              To proceed, enter your pick up location to see <br /> available
              cars
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-8 rounded-2xl px-2",
              selectedVehicleType && "bg-primaryLight"
            )}
          >
            <div
              className={cn(
                "flex gap-4 items-center px-4 py-3 bg-white rounded-2xl",
                selectedVehicleType && "bg-transparent"
              )}
            >
              <AccuracyIcon />
              <input
                className={cn(
                  "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full md:w-[375px]"
                )}
                placeholder='Pick up location'
              />
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                {selectedVehicleType ? (
                  <Button
                    variant={"default"}
                    className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer'
                  >
                    <EditIcon />
                  </Button>
                ) : (
                  <Button
                    variant={"default"}
                    className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
                  >
                    <div className='bg-primary rounded-full size-10 flex items-center justify-center'>
                      <WhiteForwardIcon />
                    </div>
                  </Button>
                )}
              </DialogTrigger>
              <DialogContent
                className='sm:max-w-[425px] px-4 py-8 rounded-[20px] bg-background-1'
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <DialogTitle>
                    Select a vehicle type: Economy, Comfort, Comfort XL, Luxury
                    or Luxury XL
                  </DialogTitle>
                </VisuallyHidden>
                <div className='flex flex-col gap-6'>
                  <div className='flex flex-col pl-7'>
                    <HeadingHeebo className='text-primary font-semibold text-xl text-left'>
                      Vehicle type
                    </HeadingHeebo>
                    <p className='text-sm'>
                      Please select a vehicle option to continue <br /> your
                      booking
                    </p>
                  </div>
                  <div className='flex flex-col gap-1'>
                    {carTypes.map((car) => {
                      return (
                        <Button
                          // disabled
                          onClick={() => {
                            setSelectedVehicleType(
                              car.name.toLowerCase().replace(" ", "-")
                            );
                            setTimeout(() => {
                              setOpen(false);
                            }, 2000);
                          }}
                          key={car.name}
                          className={cn(
                            "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                            selectedVehicleType ===
                              car.name.toLowerCase().replace(" ", "-") &&
                              "bg-primary"
                          )}
                        >
                          <Image
                            src={"/images/small-car.png"}
                            alt={"car"}
                            width={40}
                            height={40}
                          />
                          <div className='flex flex-col group-hover:text-white duration-150'>
                            <p className='font-semibold text-sm'>{car.name}</p>
                            <p className='text-xs'>{car.seat} Persons</p>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className='flex flex-col gap-8'>
            <DriverInfoAccordion driverInfo={driverInfo} />
          </div>
        </div>

        <div className='bg-red-400 w-full h-full min-h-40 sticky top-0'></div>
      </div>
    </div>
  );
};
export default Page;

const carTypes = [
  {
    name: "Economy",
    seat: 4,
  },
  {
    name: "Comfort",
    seat: 4,
  },
  {
    name: "Comfort XL",
    seat: 4,
  },
  {
    name: "Luxury",
    seat: 4,
  },
  {
    name: "Luxury XL",
    seat: 6,
  },
];

const driverInfo = [
  {
    name: "Mark Spencer",
    carName: "Tesla Model 3 - 2023",
    price: 2,
    image: "",
    rating: 4.8,
    completedRides: 453,
    distanceTraveled: 234,
    passengerCapacity: 3,
    petsAllowed: false,
    carConditions: [
      {
        title: "Type",
        content: "Sedan EV",
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
        content: "LA23 76 NYC",
      },
    ],
  },
  {
    name: "Stephen Malcolm",
    image: "",
    rating: 4.6,
    carName: "Toyota Camry - 2024",
    price: 4,
    completedRides: 231,
    distanceTraveled: 234,
    passengerCapacity: 3,
    petsAllowed: false,
    carConditions: [
      {
        title: "Type",
        content: "Sedan EV",
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
        content: "LA23 76 NYC",
      },
    ],
  },
  {
    name: "Mary Bucher",
    image: "",
    carName: "Audi A8 - 2025",
    price: 6,
    rating: 4.8,
    completedRides: 453,
    distanceTraveled: 234,
    passengerCapacity: 4,
    petsAllowed: false,
    carConditions: [
      {
        title: "Type",
        content: "Sedan EV",
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
        content: "LA23 76 NYC",
      },
    ],
  },
];
