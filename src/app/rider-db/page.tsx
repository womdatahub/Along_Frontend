"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CompleteHeroServiceDialog,
  Empty,
  EmptyHeader,
  EmptyTitle,
  HeadingHeebo,
  NameAvatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadarAutocomplete,
} from "@/components";
import { useRadarMap, useSession } from "@/store";
import {
  AccuracyIcon,
  // LocationPointerSvg,
  RemoveCardIcon,
  WhiteForwardIcon,
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

const Page = () => {
  const router = useRouter();
  const {
    riderProfile,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      riderProfile: state.riderProfile,
      actions: state.actions,
    })),
  );

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      autoCompleteAddress: state.autoCompleteAddress,
      actions: state.actions,
    })),
  );

  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full md:py-14 md:h-[calc(100vh-80px)] md:overflow-hidden'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col-reverse md:flex-row justify-between gap-5'>
          <div className='flex flex-col gap-2 w-full md:w-fit'>
            <HeadingHeebo className='text-left'>Quick trip</HeadingHeebo>
            <div className='flex items-center gap-4 md:gap-8'>
              <div className='flex gap-2 md:gap-4 items-center px-2 md:px-4 py-3 bg-white rounded-2xl w-full md:w-93.75'>
                <AccuracyIcon />
                <RadarAutocomplete
                  setAutoCompleteAddress={setAutoCompleteAddress}
                  placeholder='Enter your location'
                  defaultValue={
                    autoCompleteAddress &&
                    `${autoCompleteAddress?.formattedAddress}`
                  }
                />
              </div>

              <CompleteHeroServiceDialog
                trigger={
                  <Button
                    variant={"default"}
                    className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
                  >
                    <div className='bg-primary rounded-full size-10 flex items-center justify-center'>
                      <WhiteForwardIcon />
                    </div>
                  </Button>
                }
              />
            </div>
          </div>

          <div className='flex gap-4 items-center self-end'>
            <NameAvatar
              value={`${riderProfile?.firstName[0] ?? ""}${riderProfile?.lastName[0] ?? ""}`}
            />
            <Popover>
              <PopoverTrigger asChild>
                <p className='text-lg  cursor-pointer'>
                  {riderProfile?.firstName}
                </p>
              </PopoverTrigger>
              <PopoverContent className='w-67.5 p-0'>
                <div className='flex rounded-t-2xl overflow-hidden flex-col bg-white w-67.5 pt-4'>
                  <div className='flex flex-col gap-4 px-4 pb-4'>
                    <div className='flex gap-3 items-center'>
                      <NameAvatar
                        value={`${riderProfile?.firstName[0] ?? ""}${riderProfile?.lastName[0] ?? ""}`}
                        className='size-8 md:size-8 md:text-sm text-sm'
                      />
                      <p className='font-semibold text-base'>
                        {riderProfile?.firstName} {riderProfile?.lastName}
                      </p>
                    </div>
                    <p
                      className='pl-11 cursor-pointer text-sm'
                      onClick={() => router.push("/rider-db/account")}
                    >
                      Profile
                    </p>
                  </div>
                  <div
                    onClick={logOut}
                    className='p-3 bg-icons rounded-b-2xl text-center cursor-pointer text-white font-bold'
                  >
                    Sign out
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <HeadingHeebo className='text-left mt-5'>Menu</HeadingHeebo>
        <div className='flex flex-col md:flex-row gap-10 md:items-stretch md:h-[calc(100vh-200px)]'>
          <div className='flex flex-row md:flex-col gap-3 md:gap-10 md:border-r md:border-r-gray-5 pr-10 md:mb-32 w-fit whitespace-nowrap'>
            <Link href={"/rent-ride"}>Rent a car</Link>
            <Link href={"#"}>Schedule a ride</Link>
            {/* <Link href={"/onboarding"}>Drive</Link> */}
          </div>
          <div className='flex flex-col gap-10 md:gap-20 overflow-y-auto md:mb-32'>
            <div className='flex flex-col gap-4 w-full md:max-w-1/3 '>
              <HeadingHeebo className='text-3xl text-left'>
                Start your day the right way
              </HeadingHeebo>
              <p className=''>
                Lets make the right match. Fill out the form to explore talent
                or opportunities that align perfectly with your goals
              </p>
              <Button className='w-fit rounded-full cursor-pointer'>
                Learn more
              </Button>
            </div>
            <div className='flex gap-3 flex-col'>
              <HeadingHeebo className='w-fit text-left'>Payment</HeadingHeebo>
              <div className='flex flex-col md:flex-row gap-4'>
                <Card className='flex flex-col gap-14 bg-[#1F364B] rounded-2xl justify-between w-full md:w-fit border-0 shadow-none'>
                  <CardContent className='flex gap-5'>
                    <div className='flex flex-col justify-between w-[384px] gap-14'>
                      <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                          <HeadingHeebo className='text-xl w-fit text-left font-bold text-white'>
                            Mastercard
                          </HeadingHeebo>
                          <p className='text-white text-lg font-medium'>
                            ***** ***** 3762
                          </p>
                          <Link href='/rider-db/cards'>
                            <p className='text-lightgreen text-xs'>
                              Card details
                            </p>
                          </Link>
                        </div>
                        <Image
                          src={"/images/credit-cards.png"}
                          alt='credit-cards'
                          width={61}
                          height={77}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className='flex items-center justify-between'>
                    <Button className='cursor-pointer rounded-full' asChild>
                      <Link href='/rider-db/new-card'>Add card</Link>
                    </Button>
                    <Button
                      variant={"destructive"}
                      className='bg-transparent hover:bg-transparent text-destructive cursor-pointer border-none shadow-none p-0 text-xs font-heebo flex items-center gap-2'
                    >
                      <RemoveCardIcon />
                      Remove card
                    </Button>
                  </CardFooter>
                </Card>
                <Card className='flex gap-4 justify-between rounded-2xl w-full  bg-gray-2 border-0 shadow-none px-6'>
                  <div className='flex flex-col gap-11'>
                    <HeadingHeebo className='text-sm text-left'>
                      Along wallet
                    </HeadingHeebo>
                    <div className='flex gap-4 justify-between'>
                      <div className='flex flex-col'>
                        <p>Balance</p>
                        <HeadingHeebo className='text-2xl text-left'>
                          $0.00
                        </HeadingHeebo>
                      </div>
                      <Image
                        src='/images/wallet.png'
                        alt='wallet'
                        width={56}
                        height={56}
                        className={"w-14 h-fit -mt-10"}
                      />
                    </div>
                    <Button
                      asChild
                      className='cursor-pointer rounded-full w-fit'
                    >
                      <Link href='/rider-db/wallets'>Add fund</Link>
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4 mr-5 w-full md:w-65 overflow-y-auto md:relative pb-16 md:pb-32'>
            <HeadingHeebo className='text-left md:sticky md:top-0 bg-background-1 pb-2'>
              Activities
            </HeadingHeebo>
            {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <div
                key={item}
                className='flex gap-3 pb-5 border-b border-b-[#D3D3D3] hover:cursor-pointer'
                onClick={() => router.push("/rider-db/ride-details")}
              >
                <div className='mt-5'>
                  <LocationPointerSvg />
                </div>
                <div className='flex flex-col font-heebo'>
                  <p className='text-[8px] font-medium'>Ride rental</p>
                  <HeadingHeebo className='text-left text-sm'>
                    Monte Calo Crescent, New Jersey
                  </HeadingHeebo>
                  <p className='text-[9px] text-icons flex gap-3'>
                    Mon 23, August 2025 <span>12 : 35</span>
                  </p>
                  <p className='text-green-600 text-[9px]'>Completed</p>
                  <HeadingHeebo className='text-left text-sm'>
                    $45.99
                  </HeadingHeebo>
                </div>
              </div>
            ))} */}
            <div className='flex py-10 items-center justify-center'>
              <Empty>
                <EmptyHeader>
                  <EmptyTitle className='font-bold text-xl'>
                    No recent activities
                  </EmptyTitle>
                </EmptyHeader>
              </Empty>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
