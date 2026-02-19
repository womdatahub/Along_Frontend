"use client";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  // GoogleMapAutoComplete,
  HeadingHeebo,
  LoadingComponent,
  RadarAutocomplete,
  SelectDropdown,
} from "@/components";
import { cn, formatDateToDDMMYYYY, carTypes } from "@/lib";
import { useRadarMap } from "@/store";
import {
  CalenderIcon,
  DestinationAddressIcon,
  EditIcon,
  PickupAddressIcon,
} from "@public/svgs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { DateRange } from "react-day-picker";
import { useShallow } from "zustand/shallow";
import { RentRideDialogComponent } from "../rent-ride/page";

const Page = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ScheduleRidePage />
    </Suspense>
  );
};
const ScheduleRidePage = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [issDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [selected, setSelected] = useState<string>("");
  const [isOneWay, setISOneWay] = useState(true);
  const [pickupModalOpen, setPickupModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [selectedMins, setSelectedMins] = useState<string>("");
  const [selectAmOrPm, setSelectAmOrPm] = useState<string>("am");

  const searchParams = useSearchParams();
  const vehicleType = searchParams.get("vehicleType");

  const {
    autoCompleteAddress,
    toAutoCompleteAddress,
    actions: { setAutoCompleteAddress, setToAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      autoCompleteAddress: state.autoCompleteAddress,
      toAutoCompleteAddress: state.toAutoCompleteAddress,
      actions: state.actions,
    })),
  );
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
                      date || (dateRange?.from && dateRange?.to)
                        ? "text-black"
                        : "text-placeholder",
                    )}
                  >
                    {isOneWay && date
                      ? formatDateToDDMMYYYY(date as Date)
                      : !isOneWay && dateRange?.from && dateRange?.to
                        ? `${formatDateToDDMMYYYY(
                            dateRange.from as Date,
                          )} - ${formatDateToDDMMYYYY(dateRange.to as Date)}`
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
                          !isOneWay && "opacity-35",
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
                          isOneWay && "opacity-35",
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
                <p className='font-bold'>
                  {isOneWay &&
                    formatDateToDDMMYYYY(date ? (date as Date) : new Date())}
                  {!isOneWay &&
                    formatDateToDDMMYYYY(
                      dateRange?.from ? (dateRange.from as Date) : new Date(),
                    )}
                </p>
              </div>
              <div className='flex flex-col text-sm flex-1'>
                <p className='text-[#B1B2B4]'>To date</p>
                <p className='font-bold'>
                  {isOneWay &&
                    formatDateToDDMMYYYY(date ? (date as Date) : new Date())}
                  {!isOneWay &&
                    formatDateToDDMMYYYY(
                      dateRange?.to ? (dateRange.to as Date) : new Date(),
                    )}
                </p>
              </div>
              <EditIcon />
            </div>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold ml-6'>Set locations</p>
                <div className='flex flex-col gap-4 bg-white rounded-2xl justify-between w-full px-6 py-6'>
                  <div className='flex gap-4 items-center border-b pb-4'>
                    <PickupAddressIcon />
                    <RadarAutocomplete
                      setAutoCompleteAddress={setAutoCompleteAddress}
                      placeholder='Pick up location'
                      defaultValue={
                        autoCompleteAddress &&
                        `${autoCompleteAddress?.formattedAddress}`
                      }
                    />
                  </div>
                  <div className='flex gap-4 items-center'>
                    <DestinationAddressIcon />
                    <RadarAutocomplete
                      setAutoCompleteAddress={setToAutoCompleteAddress}
                      placeholder='Your destination'
                      defaultValue={
                        toAutoCompleteAddress &&
                        `${toAutoCompleteAddress?.formattedAddress}`
                      }
                      containerID='autocomplete-2'
                    />
                  </div>
                </div>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-sm font-bold ml-6'>Vehicle option</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <div className=' bg-white rounded-2xl w-full px-6 py-6 flex gap-4 items-center cursor-pointer'>
                      <PickupAddressIcon />
                      <p className='capitalize'>
                        {vehicleType
                          ? vehicleType.replace("-", " ")
                          : "Vehicle type"}
                      </p>
                    </div>
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
                              asChild
                              key={car.name}
                              className={cn(
                                "flex gap-4 items-center rounded-lg bg-white px-4 h-[71px] hover:bg-primary/70 cursor-pointer group transition-colors duration-150 justify-normal text-black w-full",
                                vehicleType === title &&
                                  "bg-primary text-white",
                              )}
                            >
                              <Link
                                href={{
                                  query: {
                                    vehicleType: title,
                                  },
                                }}
                              >
                                <Image
                                  src={"/images/small-car.png"}
                                  alt={"car"}
                                  width={40}
                                  height={40}
                                  priority
                                />
                                <div className='flex flex-col group-hover:text-white duration-150'>
                                  <p className='font-semibold text-sm'>
                                    {car.name}
                                  </p>
                                  <p className='text-xs'>{car.seat} Persons</p>
                                </div>
                              </Link>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-bold ml-6'>Pickup time</p>

                  <Dialog
                    open={pickupModalOpen}
                    onOpenChange={setPickupModalOpen}
                  >
                    <DialogTrigger asChild>
                      <div className=' bg-white rounded-2xl w-full px-6 py-6 flex gap-4 items-center cursor-pointer'>
                        <PickupAddressIcon />
                        <p>
                          {selectedHours && selectedMins && selectAmOrPm
                            ? `${selectedHours} : ${selectedMins} ${selectAmOrPm}`
                            : "Set time"}
                        </p>
                      </div>
                    </DialogTrigger>
                    <DialogContent
                      className='sm:max-w-[425px] p-0  rounded-[20px] overflow-hidden bg-background-1'
                      showCloseButton={false}
                    >
                      <VisuallyHidden>
                        <DialogTitle>Choose a pick up time</DialogTitle>
                      </VisuallyHidden>
                      <RentRideDialogComponent
                        title='Pick up time'
                        subTitle='Choose the time you’d like to be picked up'
                      >
                        <div className='flex flex-col gap-2 py-9 px-4'>
                          <div className='flex p-4 gap-4'>
                            <div className='flex bg-white rounded-[10px] h-12'>
                              <div className='flex p-4 gap-2 items-center'>
                                <p className='text-sm'>Hour</p>
                                <SelectDropdown
                                  options={Array(12)
                                    .fill(0)
                                    .map((_, i) => `${i + 1}`)}
                                  triggerClassName='bg-[#F8F8F8] hover:cursor-pointer w-fit min-h-4 rounded-lg'
                                  triggerLabel='1'
                                  withoutIcon
                                  selected={selectedHours}
                                  setSelected={setSelectedHours}
                                />
                              </div>
                              <div className='w-[1px] h-4 bg-primaryLight2 self-center' />
                              <div className='flex p-4 gap-2 items-center'>
                                <p className='text-sm'>Min</p>
                                <SelectDropdown
                                  options={Array(60)
                                    .fill(0)
                                    .map(
                                      (_, i) => `${i <= 10 ? "0" : ""}${i + 1}`,
                                    )}
                                  triggerClassName='bg-[#F8F8F8] hover:cursor-pointer w-fit min-h-4 rounded-lg'
                                  triggerLabel='1'
                                  withoutIcon
                                  selected={selectedMins}
                                  setSelected={setSelectedMins}
                                />
                              </div>
                            </div>
                            <div className='bg-white rounded-[10px] h-12 flex items-center justify-center'>
                              <SelectDropdown
                                options={["AM", "PM"]}
                                triggerClassName='hover:cursor-pointer w-fit min-h-4'
                                triggerLabel='AM'
                                withoutIcon
                                selected={selectAmOrPm}
                                setSelected={setSelectAmOrPm}
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => setPickupModalOpen(false)}
                            className='rounded-full self-center'
                          >
                            OK
                          </Button>
                        </div>
                      </RentRideDialogComponent>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className='flex justify-between items-center font-bold text-sm px-3'>
                  <p>Round trip</p>
                  <p>{isOneWay ? "No" : "Yes"}</p>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <HeadingHeebo className='font-fustat font-semibold text-xl text-left'>
                Passenger Details
              </HeadingHeebo>
              <SelectDropdown
                options={Array(10)
                  .fill(0)
                  .map((v) => `${v} passenger${v === "1" ? "" : "s"}`)}
                triggerLabel='Number of passengers'
                selected={selected}
                setSelected={setSelected}
              />
              <div className='flex gap-4'>
                <div className='flex justify-center flex-col gap-[1px] items-center rounded-2xl bg-[#D9E0E0] h-16 flex-1 text-[10px]'>
                  <Image
                    src='/images/pets-icon.png'
                    alt='woman-bg'
                    width={2000}
                    height={2000}
                    priority
                    className='object-contain w-6 h-6'
                  />
                  <p>Pets</p>
                  <div className='w-7 h-1 rounded-full bg-[#979797]' />
                </div>
                <div className='flex justify-center flex-col gap-[1px] items-center rounded-2xl bg-[#D9E0E0] h flex-1 text-[10px]'>
                  <Image
                    src='/images/luggage-icon.png'
                    alt='luggage icon'
                    width={2000}
                    height={2000}
                    priority
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
            alt='scheduled-ride-img'
            // width={2000}
            // height={2000}
            priority
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            objectFit='cover'
            fill
            loading='eager'
            className='z-10 object-contain'
          />
        </div>
      </div>
    </div>
  );
};
export default Page;
