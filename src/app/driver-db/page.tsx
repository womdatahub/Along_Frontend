"use client";
import {
  Button,
  HeadingHeebo,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";
import { LocationPointerSvg } from "@public/svgs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession, useRental, useRadarMap } from "@/store";
import { useShallow } from "zustand/shallow";
import Image from "next/image";

const DynamicDriversChart = dynamic(
  () => import("../../components/shared/drivers-chart"),
  { ssr: false },
);
const Page = () => {
  const router = useRouter();

  const {
    driverProfile,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      driverProfile: state.driverProfile,
      actions: state.actions,
    })),
  );

  const {
    actions: { listVehicleForRental },
  } = useRental(
    useShallow((state) => ({
      actions: state.actions,
    })),
  );

  const { autoCompleteAddress } = useRadarMap(
    useShallow((state) => ({ autoCompleteAddress: state.autoCompleteAddress })),
  );

  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex- py-8 md:py-14 h-[calc(100vh-80px)] overflow-hidden'>
      <div className='flex flex-col gap-4'>
        <div className='flex justify-between gap-5'>
          <div />

          <div className='flex gap-4 items-center'>
            <Image
              alt={`${driverProfile?.firstName}-${driverProfile?.lastName}`}
              src={
                driverProfile?.driverProfilePictureUri ?? "/images/camry.png"
              }
              width={96}
              height={96}
              className='size-24 rounded-full object-cover bg-gray-200'
            />
            <Popover>
              <PopoverTrigger asChild>
                <p className='text-lg  cursor-pointer'>
                  {driverProfile?.firstName}
                </p>
              </PopoverTrigger>
              <PopoverContent className='w-[270px] p-0'>
                <div className='flex rounded-t-2xl overflow-hidden flex-col bg-white w-[270px] pt-4'>
                  <div className='flex flex-col gap-4 px-4 pb-4'>
                    <div className='flex gap-3 items-center'>
                      <Image
                        alt={`${driverProfile?.firstName}-${driverProfile?.lastName}`}
                        src={
                          driverProfile?.driverProfilePictureUri ??
                          "/images/camry.png"
                        }
                        width={32}
                        height={32}
                        className='size-8 rounded-full object-cover bg-gray-200'
                      />
                      <p className='font-semibold text-base'>
                        {driverProfile?.firstName} {driverProfile?.lastName}
                      </p>
                    </div>
                    <p
                      className='pl-11 cursor-pointer text-sm'
                      onClick={() => router.push("/driver-db/account")}
                    >
                      Profile
                    </p>
                  </div>
                  <div
                    onClick={async () => {
                      const link = await listVehicleForRental({
                        address: autoCompleteAddress?.formattedAddress ?? "",
                        latitude: autoCompleteAddress?.latitude ?? 0,
                        longitude: autoCompleteAddress?.longitude ?? 0,
                        vehicleId: driverProfile?.vehicleId ?? "",
                      });
                      console.log(`link gotten from api call is this: ${link}`);
                      router.push(link);
                    }}
                    className='text-center cursor-pointer font-bold'
                  >
                    List vehicle for Rent
                  </div>
                  <div
                    onClick={logOut}
                    className='p-3 bg-[#768B8F] rounded-b-2xl text-center cursor-pointer text-white font-bold'
                  >
                    Sign out
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <HeadingHeebo className='text-left mt-5'>Menu</HeadingHeebo>
        <div className='flex gap-10 items-stretch h-[calc(100vh-200px)]'>
          <div className='flex flex-col gap-10 border-r border-r-gray-5 pr-10 mb-32 w-fit whitespace-nowrap'>
            <div className='flex gap-2 justify-between flex-col'>
              <div className='flex flex-col gap-10'>
                <Link href={"/driver-db/vehicle"}>Vehicle</Link>
                <Link href={"/driver-db/ride-details"}>TBC</Link>
                <Link href={"/onboarding"}>Ride</Link>
              </div>
              <div className='flex items-center gap-3'>
                <p>Driver rating</p>
                <p>Star</p>
                <p>4.8%</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-20 overflow-y-auto mb-32'>
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
              <HeadingHeebo className='w-fit text-left'>Earnings</HeadingHeebo>

              <DynamicDriversChart />
            </div>
          </div>
          <div className='flex flex-col gap-4 mr-5 w-full md:w-[260px] overflow-y-auto relative pb-32'>
            <HeadingHeebo className='text-left sticky top-0 bg-background-1 pb-2'>
              Activities
            </HeadingHeebo>
            {Array(10)
              .fill(0)
              .map((item) => (
                <div
                  key={item}
                  className='flex gap-3 pb-5 border-b border-b-[#D3D3D3]'
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
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
