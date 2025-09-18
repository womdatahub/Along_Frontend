"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DriverInfoAccordion,
  HeadingHeebo,
  Switch,
} from "@/components";
import { cn } from "@/lib";
import {
  AccuracyIcon,
  EditIcon,
  LocationFlagIcon,
  MoreInfoIcon,
  Return24Icon,
  TimerIcon,
  WhiteForwardIcon,
} from "@public/svgs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const vehicleType = searchParams.get("vehicleType");
  const selectedDriver = searchParams.get("selectedDriver");

  const func = (driver: string) =>
    router.push(
      `/rent-ride?vehicleType=${vehicleType}&selectedDriver=${driver}`
    );
  return (
    // IF YOU WANT THE PAGE TO BE SCROLLABLE WITHOUT THE NAVBAR BECOMING TRANSPARENT, YOU SHOULD LEAVE THE h and the overflow. OTHERWISE REMOVE IT
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-y-scroll'>
      <div className='flex gap-4 h-full'>
        <div className='flex flex-col gap-10 min-w-[40%] h-full'>
          <div className='flex flex-col'>
            <HeadingHeebo className='text-left font-extrabold text-4xl'>
              Rent a ride
            </HeadingHeebo>
            {!selectedDriver && (
              <p className='text-sm'>
                To proceed, enter your pick up location to see <br /> available
                cars
              </p>
            )}
          </div>
          {!selectedDriver && (
            <div
              className={cn(
                "flex items-center gap-8 rounded-2xl px-2",
                vehicleType && "bg-primaryLight"
              )}
            >
              <div
                className={cn(
                  "flex gap-4 items-center px-4 py-3 bg-white rounded-2xl w-full",
                  vehicleType && "bg-transparent"
                )}
              >
                <AccuracyIcon />
                <input
                  className={cn(
                    "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full flex-1"
                  )}
                  placeholder='Pick up location'
                />
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  {vehicleType ? (
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
                      Select a vehicle type: Economy, Comfort, Comfort XL,
                      Luxury or Luxury XL
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
                        const title = car.name
                          .toLowerCase()
                          .replace(/\s+/g, "-");
                        return (
                          <Button
                            // disabled
                            onClick={() => {
                              router.push(`/rent-ride?vehicleType=${title}`);

                              // setTimeout(() => {
                              setOpen(false);
                              // }, 2000);
                            }}
                            key={car.name}
                            className={cn(
                              "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                              vehicleType === title && "bg-primary"
                            )}
                          >
                            <Image
                              src={"/images/small-car.png"}
                              alt={"car"}
                              width={40}
                              height={40}
                            />
                            <div className='flex flex-col group-hover:text-white duration-150'>
                              <p className='font-semibold text-sm'>
                                {car.name}
                              </p>
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
          )}
          {vehicleType && !selectedDriver && (
            <div className='flex flex-col gap-8'>
              <DriverInfoAccordion driverInfo={driverInfo} func={func} />
            </div>
          )}
          {vehicleType && selectedDriver && (
            <section className='min-w-[40%] h-full flex flex-col justify-between'>
              <section className='flex flex-col gap-11'>
                <div className='flex rounded-2xl p-3 gap-4 items-center justify-between bg-primaryLight2 w-full'>
                  <div className='flex gap-7 items-center'>
                    <Image
                      src={"/images/small-car.png"}
                      alt={"car"}
                      width={40}
                      height={40}
                      className='w-[100px]'
                    />
                    <div className='flex flex-col'>
                      <p className=' text-xs font-semibold'>
                        Tesla Model 3 - 2023
                      </p>
                      <p className=' text-sm font-extrabold'>
                        Tesla Model 3 - 2023
                      </p>
                    </div>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='p-[2px] rounded-full bg-white'>
                      <Image
                        src='/images/profile.jpg'
                        alt='profile-image'
                        className='rounded-full w-[66px] object-cover aspect-square'
                        width={40}
                        height={40}
                      />
                    </div>
                    <p className=' text-xs font-semibold'>Mark Spencer</p>
                  </div>
                </div>
                <div className='flex flex-col gap-8'>
                  <div className='flex flex-col gap-4'>
                    <p className='text-sm font-bold'>Pick up location</p>
                    <div className='flex justify-between w-full gap-4'>
                      <div className='flex gap-4'>
                        <LocationFlagIcon />
                        <div className='flex flex-col text-sm font-bold'>
                          <p>Long Beach</p>
                          <p className='font-normal'>
                            Cabbagetown, Candler Park
                          </p>
                          <p className='text-xs'>California</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => router.back()}
                        className='bg-primaryLight2 text-black hover:bg-primaryLight2 rounded-full px-8'
                      >
                        Change
                      </Button>
                    </div>
                  </div>
                  <div className='flex gap-4 w-full items-center'>
                    <div className='flex flex-col gap-1 w-full'>
                      <p className='pl-4 font-bold text-sm'>Duration</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='rounded-2xl bg-white items-center justify-between px-4 py-3 w-full flex gap-4 hover:cursor-pointer'>
                            <p className='text-icons font-medium text-xs'>
                              Choose rent duration
                            </p>
                            <Return24Icon />
                          </div>
                        </DialogTrigger>
                        <DialogContent
                          className='sm:max-w-[425px] px-4 py-8 rounded-[20px] bg-background-1'
                          showCloseButton={false}
                        >
                          <VisuallyHidden>
                            <DialogTitle>Choose rent duration</DialogTitle>
                          </VisuallyHidden>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className='flex flex-col gap-1 w-full'>
                      <p className='pl-4 font-bold text-sm'>Pick up time</p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className='rounded-2xl bg-white items-center justify-between px-4 py-3 w-full flex gap-4 hover:cursor-pointer'>
                            <p className='text-icons font-medium text-xs'>
                              Choose a pick up time
                            </p>
                            <TimerIcon />
                          </div>
                        </DialogTrigger>
                        <DialogContent
                          className='sm:max-w-[425px] px-4 py-8 rounded-[20px] bg-background-1'
                          showCloseButton={false}
                        >
                          <VisuallyHidden>
                            <DialogTitle>Choose a pick up time</DialogTitle>
                          </VisuallyHidden>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-4 w-full -mt-4'>
                    <div className='flex items-center gap-3'>
                      <p className='text-sm font-semibold'>Time Flexibility</p>
                      <MoreInfoIcon />
                    </div>
                    <Switch color='primary' />
                  </div>
                </div>
              </section>
              <Button className='items-end'>Review request</Button>
            </section>
          )}
        </div>

        <div className='bg-red-400 w-full h-full min-h-40 sticky top-0' />
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
