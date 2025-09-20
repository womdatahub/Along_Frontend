"use client";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  GoogleMapAutoComplete,
  HeadingHeebo,
  SelectDropdown,
} from "@/components";
import { cn, formatDateToDDMMYYYY } from "@/lib";
import {
  CalenderIcon,
  DestinationAddressIcon,
  EditIcon,
  PickupAddressIcon,
} from "@public/svgs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const Page = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [issDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 9),
    to: new Date(2025, 5, 26),
  });
  const [isOneWay, setISOneWay] = useState(true);
  return (
    // IF YOU WANT THE PAGE TO BE SCROLLABLE WITHOUT THE NAVBAR BECOMING TRANSPARENT, YOU SHOULD LEAVE THE h and the overflow. OTHERWISE REMOVE IT
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-y-scroll'>
      <div className='flex gap-20 h-full'>
        <div className='flex flex-col gap-10 min-w-[378px] h-full'>
          <div className='flex flex-col'>
            <HeadingHeebo className='text-left font-extrabold text-4xl'>
              Scheduled ride
            </HeadingHeebo>

            <p className='text-sm'>
              Plan ahead with stress-free booking. Perfect for airport runs,
              early meetings, or medical appointments. cars
            </p>
          </div>
          <div className={cn("flex flex-col gap-8 rounded-2xl")}>
            <Dialog open={issDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
              <DialogTrigger asChild>
                <div className='rounded-2xl max-w-[378px] bg-white items-center justify-between px-7 py-3 w-full flex gap-4 hover:cursor-pointer'>
                  <p
                    className={cn(
                      "font-medium text-xs",
                      date ? "text-black" : "text-placeholder"
                    )}
                  >
                    {date
                      ? formatDateToDDMMYYYY(date as Date)
                      : "Choose a date"}
                  </p>
                  <CalenderIcon />
                </div>
              </DialogTrigger>

              <DialogContent
                className='w-fit p-0  rounded-[20px] overflow-hidden bg-background-1'
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <DialogTitle>
                    Select a vehicle type: Economy, Comfort, Comfort XL, Luxury
                    or Luxury XL
                  </DialogTitle>
                </VisuallyHidden>
                <div className='flex flex-col bg-white'>
                  <div className='flex gap-12 justify-evenly bg-primaryLight2 px-4 py-8'>
                    <div
                      className='hover:cursor-pointer w-fit h-fit p-0'
                      onClick={() => setISOneWay(true)}
                    >
                      <HeadingHeebo
                        className={cn(
                          "text-left font-semibold text-sm text-primary-deep",
                          !isOneWay && "opacity-35"
                        )}
                      >
                        One way
                      </HeadingHeebo>
                    </div>
                    <div
                      className='hover:cursor-pointer w-fit h-fit p-0'
                      onClick={() => setISOneWay(false)}
                    >
                      <HeadingHeebo
                        className={cn(
                          "text-left font-semibold text-sm text-primary-deep",
                          isOneWay && "opacity-35"
                        )}
                      >
                        Round trip
                      </HeadingHeebo>
                    </div>
                  </div>
                  <div className='flex flex-col gap-5 justify-center items-center bg-white w-fit pb-6 px-4'>
                    {isOneWay ? (
                      <Calendar
                        mode='single'
                        defaultMonth={date}
                        selected={date}
                        onSelect={setDate}
                        disabled={{
                          before: new Date(),
                        }}
                        className='bg-transparent'
                      />
                    ) : (
                      <Calendar
                        mode='range'
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        disabled={{
                          before: new Date(),
                        }}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                        className='bg-transparent'
                      />
                    )}
                    <div className='flex gap-10 items-center font-bold'>
                      <Button
                        onClick={() => setDate(new Date())}
                        className='bg-transparent hover:bg-transparent w-fit h-fit p-0 text-black'
                      >
                        CANCEL
                      </Button>
                      <Button
                        onClick={() => setIsDateDialogOpen(false)}
                        className='bg-transparent hover:bg-transparent w-fit h-fit p-0 text-primary'
                      >
                        SELECT
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className='flex bg-gray-2 rounded-2xl items-center justify-between h-14 w-full gap-6 px-6'>
              <CalenderIcon />
              <div className='flex flex-col text-sm flex-1'>
                <p className='text-[#B1B2B4]'>From date</p>
                <p className='font-bold'>01 Apr 2025</p>
              </div>
              <div className='flex flex-col text-sm flex-1'>
                <p className='text-[#B1B2B4]'>To date</p>
                <p className='font-bold'>01 Apr 2025</p>
              </div>
              <EditIcon />
            </div>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold ml-6'>Set locations</p>
                <div className='flex flex-col gap-4 bg-white rounded-2xl justify-between w-full px-6 py-6'>
                  <div className='flex gap-4 items-center border-b pb-4'>
                    <PickupAddressIcon />
                    <GoogleMapAutoComplete>
                      <input
                        placeholder='Pick up location'
                        className='text-sm font-bold border-none outline-none w-full flex-1 items-center'
                      />
                    </GoogleMapAutoComplete>
                  </div>
                  <div className='flex gap-4 items-center'>
                    <DestinationAddressIcon />
                    <GoogleMapAutoComplete>
                      <input
                        placeholder='Your destination'
                        className='text-sm font-bold border-none outline-none w-full flex-1 items-center'
                      />
                    </GoogleMapAutoComplete>
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold ml-6'>Vehicle option</p>
                <div className=' bg-white rounded-2xl w-full px-6 py-6 flex gap-4 items-center'>
                  <PickupAddressIcon />
                  <p>Vehicle Type</p>
                </div>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-bold ml-6'>Pickup time</p>
                  <div className=' bg-white rounded-2xl w-full px-6 py-6 flex gap-4 items-center'>
                    <PickupAddressIcon />
                    <p>Set time</p>
                  </div>
                </div>
                <div className='flex justify-between items-center font-bold text-sm px-3'>
                  <p>Round trip</p>
                  <p>Yes</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <HeadingHeebo className='font-fustat font-semibold text-xl text-left'>
                Passenger Details
              </HeadingHeebo>
              <SelectDropdown
                options={[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                ].map((v) => `${v} passenger${v === "1" ? "" : "s"}`)}
                triggerLabel='Number of passengers'
              />
              <div className='flex gap-4'>
                <div className='flex justify-center flex-col gap-[1px] items-center rounded-2xl bg-[#D9E0E0] h-16 flex-1 text-[10px]'>
                  <Image
                    src='/images/pets-icon.png'
                    alt='woman-bg'
                    width={2000}
                    height={2000}
                    className='object-contain w-6 h-6'
                  />
                  <p>Pets</p>
                  <div className='w-7 h-1 rounded-full bg-[#979797]' />
                </div>
                <div className='flex justify-center flex-col gap-[1px] items-center rounded-2xl bg-[#D9E0E0] h flex-1 text-[10px]'>
                  <Image
                    src='/images/luggage-icon.png'
                    alt='woman-bg'
                    width={2000}
                    height={2000}
                    className='object-contain w-4 h-6'
                  />
                  <p>Luggage</p>
                  <div className='w-7 h-1 rounded-full bg-[#0DAC47]' />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-9 my-10'>
              <div className='flex justify-between items-center font-bold text-sm px-3'>
                <p>Ride amount</p>
                <p>$55.92</p>
              </div>
              <Button>Proceed to payment</Button>
            </div>
          </div>
        </div>

        <div className='flex w-full h-full min-h-40 sticky top-0'>
          <Image
            src='/images/scheduled-ride-img.png'
            alt='woman-bg'
            width={2000}
            height={2000}
            className='z-10 object-contain'
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
