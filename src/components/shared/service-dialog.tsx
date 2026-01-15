"use client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  HeadingHeebo,
} from "@/components";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib";
import { carTypes, rideRental } from "@/lib";
type ServiceDialogType = {
  trigger: React.ReactNode;
};

export const ServiceDialog = ({ trigger }: ServiceDialogType) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const vehicleType = searchParams.get("vehicleType");
  const rentalType = searchParams.get("rentalType");
  const service = searchParams.get("service");
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='sm:max-w-[425px] px-4 py-8 rounded-[20px] bg-background-1'
        showCloseButton={false}
      >
        <VisuallyHidden>
          <DialogTitle>
            Select a vehicle type: Economy, Comfort, Comfort XL, Luxury or
            Luxury XL
          </DialogTitle>
        </VisuallyHidden>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col pl-7'>
            <HeadingHeebo className='text-primary font-semibold text-xl text-left'>
              Ride rental
            </HeadingHeebo>
            <p className='text-sm'>
              Please select a ride rental option to continue <br />
              your booking. Note: rides are intracity only.
            </p>
          </div>
          <div className='flex flex-col gap-1'>
            {rideRental.map((r) => {
              const title = r.title.toLowerCase().replace(/\s+/g, "-");
              return (
                <Dialog key={r.title}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        router.push(`?service=${service}&rentalType=${title}`);
                      }}
                      key={r.title}
                      className={cn(
                        "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                        rentalType === title && "bg-primary text-white"
                      )}
                    >
                      <Image
                        src={r.image}
                        alt={r.title}
                        width={40}
                        height={40}
                      />
                      <div className='flex flex-col group-hover:text-white duration-150'>
                        <p className='font-semibold text-sm'>{r.title}</p>
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
                                const path = `/rent-ride?isLater=${
                                  rentalType === "rent-for-later"
                                }&rentalType=${rentalType}&vehicleType=${title}`;

                                router.push(path);
                              }}
                              key={car.name}
                              className={cn(
                                "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                                vehicleType === title && "bg-primary text-white"
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
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
