"use client";
import { HeadingHeebo } from "@/components";
import Image from "next/image";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components";
import { cn } from "@/lib";
import { AccuracyIcon, WhiteForwardIcon } from "@public/svgs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Ride />
    </Suspense>
  );
};
const Ride = () => {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const vehicleType = searchParams.get("vehicleType");
  const rentalType = searchParams.get("rentalType");

  return (
    <div className='font-fustat'>
      <section className='pt-[272px] px-6 text-center bg-background-1 h-[844px]'>
        <div className='flex gap-20 max-w-6xl mx-auto items-center justify-between'>
          <div className='flex flex-col gap-2 w-1/2'>
            <HeadingHeebo className='font-extrabold text-[67px] text-left'>
              Rent a ride
            </HeadingHeebo>
            <div className='flex flex-col gap-6'>
              <p className='font-heebo font-light text-lg text-left'>
                Need a car for a few hours or even the whole day? Ride options
                gives you flexibility without the headaches of traditional
                rentals
              </p>
              <p className='font-heebo font-light text-lg text-left'>
                Pay for only the time you need. choose from Sedans, SUVs or
                Vans. Drivers are vetted, professional and friendly. Transparent
                prices - No surprises
              </p>
            </div>
            <div
              className={cn(
                "flex items-center gap-8 rounded-2xl px-2"
                // selectedVehicleType && "bg-primaryLight"
              )}
            >
              <div
                className={cn(
                  "flex gap-4 items-center px-4 py-3 bg-white rounded-2xl"
                  //   selectedVehicleType && "bg-transparent"
                )}
              >
                <AccuracyIcon />
                <input
                  className={cn(
                    "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full md:w-[375px]"
                  )}
                  placeholder='Pick up location'
                />
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"default"}
                      className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
                    >
                      <div className='bg-primary rounded-full size-10 flex items-center justify-center'>
                        <WhiteForwardIcon />
                      </div>
                    </Button>
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
                          Ride rental
                        </HeadingHeebo>
                        <p className='text-sm'>
                          Please select a ride rental option to continue <br />
                          your booking
                        </p>
                      </div>
                      <div className='flex flex-col gap-1'>
                        {rideRental.map((r) => {
                          const title = r.title
                            .toLowerCase()
                            .replace(/\s+/g, "-");
                          return (
                            <Dialog key={r.title}>
                              <DialogTrigger asChild>
                                <Button
                                  // disabled
                                  onClick={() => {
                                    router.push(`/ride?rentalType=${title}`);
                                    // setSelectedRentalType(
                                    //  title
                                    // );
                                  }}
                                  key={r.title}
                                  className={cn(
                                    "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                                    rentalType === title &&
                                      "bg-primary text-white"
                                  )}
                                >
                                  <Image
                                    src={r.image}
                                    alt={r.title}
                                    width={40}
                                    height={40}
                                  />
                                  <div className='flex flex-col group-hover:text-white duration-150'>
                                    <p className='font-semibold text-sm'>
                                      {r.title}
                                    </p>
                                    {/* <p className='text-xs'>{car.seat} Persons</p> */}
                                  </div>
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className='sm:max-w-[425px] px-4 py-8 rounded-[20px] bg-background-1'
                                showCloseButton={false}
                              >
                                <VisuallyHidden>
                                  <DialogTitle>
                                    Select a vehicle type: Economy, Comfort,
                                    Comfort XL, Luxury or Luxury XL
                                  </DialogTitle>
                                </VisuallyHidden>
                                <div className='flex flex-col gap-6'>
                                  <div className='flex flex-col pl-7'>
                                    <HeadingHeebo className='text-primary font-semibold text-xl text-left'>
                                      Vehicle type
                                    </HeadingHeebo>
                                    <p className='text-sm'>
                                      Please select a vehicle option to continue{" "}
                                      <br /> your booking
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
                                            router.push(
                                              `/ride?rentalType=${rentalType}&vehicleType=${title}`
                                            );
                                            // setSelectedVehicleType(
                                            //   title
                                            // );
                                          }}
                                          key={car.name}
                                          className={cn(
                                            "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                                            vehicleType === title &&
                                              "bg-primary text-white"
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
                                            <p className='text-xs'>
                                              {car.seat} Persons
                                            </p>
                                          </div>
                                        </Button>
                                      );
                                    })}
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className='flex w-1/2 relative'>
            <Image
              src='/images/about-woman-bg.png'
              alt='woman-bg'
              width={600}
              height={600}
              className='z-10 object-contain'
            />
            <Image
              src='/images/about-woman.png'
              alt='woman'
              width={490}
              height={700}
              className='z-20 absolute w-[490px] h-[700px] object-contain -top-32'
            />
          </div>
        </div>
      </section>
      <section className='py-36 px-6 text-center bg-red-500'>
        <div className='flex flex-col gap-32 max-w-6xl mx-auto items-center justify-between'></div>
      </section>
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

const rideRental = [
  { title: "Rent instant ride", image: "/images/instant-ride.png" },
  { title: "Rent for later", image: "/images/later-ride.png" },
];
