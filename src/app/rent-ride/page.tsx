"use client";
import {
  Button,
  Calendar,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DriverInfoAccordion,
  HeadingHeebo,
  RadarAutocomplete,
  RadarMap,
  SelectDropdown,
  Switch,
  LoadingComponent,
} from "@/components";
import { cn, formatDateToDDMMYYYY } from "@/lib";
import { useRadarMap } from "@/store";
import { useRental } from "@/store/use-rental";
import { carTypes } from "@/types";
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
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { useShallow } from "zustand/shallow";

const Page = () => {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <RentRide />
    </Suspense>
  );
};
const RentRide = () => {
  const [open, setOpen] = useState(false);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("hours");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedHours, setSelectedHours] = useState<string>("");
  const [selectedHoursLength, setSelectedHoursLength] = useState<string>("");
  const [selectedMins, setSelectedMins] = useState<string>("");
  const [selectAmOrPm, setSelectAmOrPm] = useState<string>("am");
  const [pickupModalOpen, setPickupModalOpen] = useState(false);

  // const { loading, error, longitude, latitude } = useGetCurrentLocation();

  // console.log(loading, error, longitude, latitude);

  const searchParams = useSearchParams();
  const router = useRouter();

  const vehicleType = searchParams.get("vehicleType");
  const selectedDriver = searchParams.get("selectedDriver");
  const isReview = !!searchParams.get("isReview");
  const isLater = !!!searchParams.get("isLater");

  const func = (driver: string) =>
    router.push(
      `/rent-ride?vehicleType=${vehicleType}&selectedDriver=${driver}&isLater=${isLater}`
    );

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap((state) => state);

  const {
    availableVehicles,
    actions: { retrieveAvailableVehicles },
  } = useRental(
    useShallow((state) => ({
      actions: state.actions,
    }))
  );

  useEffect(() => {
    retrieveAvailableVehicles();
  }, []);

  console.log(availableVehicles, "available vehicles");
  return (
    // IF YOU WANT THE PAGE TO BE SCROLLABLE WITHOUT THE NAVBAR BECOMING TRANSPARENT, YOU SHOULD LEAVE THE h and the overflow. OTHERWISE REMOVE IT
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px) overflow-y-scroll'>
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

                <RadarAutocomplete
                  setAutoCompleteAddress={setAutoCompleteAddress}
                  defaultValue={
                    autoCompleteAddress &&
                    `${autoCompleteAddress?.formattedAddress}`
                  }
                />
                {/* <GoogleMapAutoComplete>
                  <input
                    className={cn(
                      "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full flex-1"
                    )}
                    placeholder='Pick up location'
                  />
                </GoogleMapAutoComplete> */}
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
                      disabled={!autoCompleteAddress}
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
                        className='bg-primaryLight2 text-black hover:bg-primaryLight2 rounded-full px-8'
                        asChild
                      >
                        <Link
                          href={{
                            pathname: "/rent-ride",
                            query: {
                              vehicleType,
                              isLater,
                            },
                          }}
                        >
                          Change
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {!isReview && (
                    <div className='flex flex-col gap-3'>
                      <div className='flex gap-4 w-full items-center'>
                        <div className='flex flex-col gap-1 w-full'>
                          <p className='pl-4 font-bold text-sm'>Duration</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className='rounded-2xl bg-white items-center justify-between px-4 py-3 w-full flex gap-4 hover:cursor-pointer'>
                                <p
                                  className={cn(
                                    "text-icons font-medium text-xs",
                                    selectedHoursLength && "text-black"
                                  )}
                                >
                                  {selectedHoursLength
                                    ? selectedHoursLength
                                    : "Choose rent duration"}
                                </p>
                                <Return24Icon />
                              </div>
                            </DialogTrigger>
                            <DialogContent
                              className='sm:max-w-[425px] p-0  rounded-[20px] overflow-hidden bg-background-1'
                              showCloseButton={false}
                            >
                              <VisuallyHidden>
                                <DialogTitle>Choose rent duration</DialogTitle>
                              </VisuallyHidden>
                              <RentRideDialogComponent
                                title='Rent duration'
                                subTitle='Choose how long to ride'
                              >
                                <div className='flex flex-col gap-2 py-9 px-4'>
                                  <div className='flex gap-3'>
                                    <Button
                                      className={cn(
                                        "text-primary-deep text-sm font-bold bg-transparent hover:bg-transparent w-fit h-fit p-0 underline",
                                        selectedTab !== "hours" &&
                                          "text-placeholder no-underline"
                                      )}
                                      onClick={() => {
                                        setSelectedTab("hours");
                                      }}
                                    >
                                      Hours
                                    </Button>
                                    <Button
                                      className={cn(
                                        "text-primary-deep text-sm font-bold bg-transparent hover:bg-transparent w-fit h-fit p-0 underline",
                                        selectedTab !== "days" &&
                                          "text-placeholder no-underline"
                                      )}
                                      onClick={() => {
                                        setSelectedTab("days");
                                      }}
                                    >
                                      Day
                                    </Button>
                                  </div>
                                  <SelectDropdown
                                    options={[
                                      "1 Hours",
                                      "2 Hours",
                                      "3 Hours",
                                      "4 Hours",
                                      "5 Hours",
                                      "6 Hours",
                                      "7 Hours",
                                      "8 Hours",
                                      "9 Hours",
                                      "10 Hours",
                                      "11 Hours",
                                      "12 Hours",
                                    ]}
                                    triggerLabel='Select hours'
                                    selected={selectedHoursLength}
                                    setSelected={setSelectedHoursLength}
                                  />
                                </div>
                              </RentRideDialogComponent>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                          <p className='pl-4 font-bold text-sm'>Pick up time</p>
                          <Dialog
                            open={pickupModalOpen}
                            onOpenChange={setPickupModalOpen}
                          >
                            <DialogTrigger asChild>
                              <div className='rounded-2xl bg-white items-center justify-between px-4 py-3 w-full flex gap-4 hover:cursor-pointer'>
                                <p
                                  className={cn(
                                    "text-icons font-medium text-xs",
                                    selectedHours &&
                                      selectedMins &&
                                      selectAmOrPm &&
                                      "text-black"
                                  )}
                                >
                                  {selectedHours && selectedMins && selectAmOrPm
                                    ? `${selectedHours} : ${selectedMins} ${selectAmOrPm}`
                                    : "Choose a pick up time"}
                                </p>
                                <TimerIcon />
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
                                              (_, i) =>
                                                `${i <= 10 ? "0" : ""}${i + 1}`
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
                      </div>
                      {isLater && (
                        <div className='flex flex-col gap-1 w-full'>
                          <p className='pl-4 font-bold text-sm'>Select date</p>
                          <Dialog
                            open={isDateDialogOpen}
                            onOpenChange={setIsDateDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <div className='rounded-2xl bg-white items-center justify-between px-4 py-3 w-full flex gap-4 hover:cursor-pointer'>
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
                                <Return24Icon />
                              </div>
                            </DialogTrigger>
                            <DialogContent
                              className='sm:max-w-[425px] w-fit p-0  rounded-[20px] overflow-hidden bg-background-1'
                              showCloseButton={false}
                            >
                              <VisuallyHidden>
                                <DialogTitle>Choose rent date</DialogTitle>
                              </VisuallyHidden>
                              <RentRideDialogComponent
                                title={
                                  date ? formatDateToDDMMYYYY(date as Date) : ""
                                }
                                subTitle=''
                                isTitleCentered
                              >
                                <div className='flex flex-col gap-5 justify-center items-center bg-white w-fit pb-6 px-4'>
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
                              </RentRideDialogComponent>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                      <div className='flex items-center justify-between gap-4 w-full'>
                        <div className='flex items-center gap-3'>
                          <p className='text-sm font-semibold'>
                            Time Flexibility
                          </p>
                          <MoreInfoIcon />
                        </div>
                        <Switch color='primary' />
                      </div>
                    </div>
                  )}
                  {isReview && (
                    <div className='flex flex-col gap-5 border-t border-primaryLight2 pt-8'>
                      {reviewDetails.map((review) => {
                        return (
                          <div
                            key={review.title}
                            className='flex justify-between gap-4 font-semibold text-sm'
                          >
                            <div className='flex items-center gap-3'>
                              <p>I</p>
                              <p>{review.title}</p>
                            </div>
                            <p>{review.value}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </section>
              <div className='flex gap-6 items-center'>
                <Button className='items-end' asChild={!isReview}>
                  {isReview ? (
                    "Proceed to payment"
                  ) : (
                    <Link
                      href={{
                        pathname: "/rent-ride",
                        query: {
                          vehicleType,
                          selectedDriver,
                          isReview: true,
                          isLater,
                        },
                      }}
                    >
                      Review request
                    </Link>
                  )}
                </Button>
                {isReview && (
                  <div className='flex flex-col w-1/3'>
                    <div className='flex justify-between gap-4 font-bold text-base'>
                      <p>Total</p>
                      <p>$55.92</p>
                    </div>
                    <div className='flex justify-between gap-4 font-semibold text-sm text-icons'>
                      <p>Tax</p>
                      <p>$2.92</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* <div className='bg-red- w-full h-full min-h-40 sticky top-0' /> */}

        {/* <GoogleMaps /> */}
        <RadarMap
          pickup={[
            autoCompleteAddress?.longitude ?? 0,
            autoCompleteAddress?.latitude ?? 0,
          ]}
        />
      </div>
    </div>
  );
};
export default Page;

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

type RentRideDialogComponentProps = {
  title: string;
  subTitle: string;
  children: React.ReactNode;
  isTitleCentered?: boolean;
};
export const RentRideDialogComponent = ({
  title,
  subTitle,
  children,
  isTitleCentered,
}: RentRideDialogComponentProps) => {
  return (
    <div className='flex flex-col bg-background-1'>
      <div className='flex flex-col bg-primaryLight2 p-4'>
        <HeadingHeebo
          className={cn(
            "text-left font-semibold text-xl text-primary-deep",
            isTitleCentered && "text-center"
          )}
        >
          {title}
        </HeadingHeebo>
        <p className='text-[10px]'>{subTitle}</p>
      </div>
      {children}
    </div>
  );
};

const reviewDetails = [
  {
    title: "Rent Duration",
    value: "6 hours",
  },
  {
    title: "Pick up time",
    value: "18:35PM",
  },
  {
    title: "Time Flexibility",
    value: "Yes",
  },
];
