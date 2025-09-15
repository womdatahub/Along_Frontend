"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
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
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-hidden'>
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
                    {items.map((i) => {
                      return (
                        <Button
                          // disabled
                          onClick={() => {
                            setSelectedVehicleType(
                              i.name.toLowerCase().replace(" ", "-")
                            );
                            setTimeout(() => {
                              setOpen(false);
                            }, 2000);
                          }}
                          key={i.name}
                          className={cn(
                            "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black",
                            selectedVehicleType ===
                              i.name.toLowerCase().replace(" ", "-") &&
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
                            <p className='font-semibold text-sm'>{i.name}</p>
                            <p className='text-xs'>{i.seat} Persons</p>
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
            <Accordion
              type='single'
              collapsible
              className='w-full flex flex-col gap-4'
              defaultValue='item-1'
            >
              <AccordionItem
                value='item-1'
                className='border-b-0 bg-white rounded-2xl '
              >
                <AccordionTrigger className='hover:no-underline cursor-pointer pr-4 flex gap-8 justify-between'>
                  <Image
                    src={"/images/small-car.png"}
                    alt={"car"}
                    width={40}
                    height={40}
                  />
                  <div className='flex flex-col'>
                    <p className='font-semibold text-base'>
                      Tesla Model 3 - 2023
                    </p>
                    <p className='text-sm text-[#858585]'>Mark Spencer</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-4 text-balance px-4'>
                  <p>
                    Our flagship product combines cutting-edge technology with
                    sleek design. Built with premium materials, it offers
                    unparalleled performance and reliability.
                  </p>
                  <p>
                    Key features include advanced processing capabilities, and
                    an intuitive user interface designed for both beginners and
                    experts.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value='item-2'
                className='border-b-0 bg-white rounded-2xl '
              >
                <AccordionTrigger className='hover:no-underline cursor-pointer pr-4'>
                  Shipping Details
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-4 text-balance px-4'>
                  <p>
                    We offer worldwide shipping through trusted courier
                    partners. Standard delivery takes 3-5 business days, while
                    express shipping ensures delivery within 1-2 business days.
                  </p>
                  <p>
                    All orders are carefully packaged and fully insured. Track
                    your shipment in real-time through our dedicated tracking
                    portal.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem
                value='item-3'
                className='border-b-0 bg-white rounded-2xl '
              >
                <AccordionTrigger className='hover:no-underline cursor-pointer pr-4'>
                  Return Policy
                </AccordionTrigger>
                <AccordionContent className='flex flex-col gap-4 text-balance px-4'>
                  <p>
                    We stand behind our products with a comprehensive 30-day
                    return policy. If you&apos;re not completely satisfied,
                    simply return the item in its original condition.
                  </p>
                  <p>
                    Our hassle-free return process includes free return shipping
                    and full refunds processed within 48 hours of receiving the
                    returned item.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className='bg-red-400 w-full h-full min-h-40'></div>
      </div>
    </div>
  );
};
export default Page;

const items = [
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
