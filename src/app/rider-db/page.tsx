import {
  Button,
  Card,
  CardContent,
  CardFooter,
  HeadingHeebo,
} from "@/components";
import { cn } from "@/lib";
import { AccuracyIcon, RemoveCardIcon, WhiteForwardIcon } from "@public/svgs";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex-1 py-8 md:py-14'>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2 w-fit'>
          <HeadingHeebo className='text-left'>Quick trip</HeadingHeebo>
          <div className='flex items-center gap-8'>
            <div className='flex gap-4 items-center px-4 py-3 bg-white rounded-2xl'>
              <AccuracyIcon />
              <input
                className={cn(
                  "text-sm focus:outline-none focus:ring-0 placeholder:text-placeholder w-full md:w-[375px]"
                )}
                placeholder='Pick up location'
              />
            </div>
            <Button
              variant={"default"}
              className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
            >
              <div className='bg-primary rounded-full size-10 flex items-center justify-center'>
                <WhiteForwardIcon />
              </div>
            </Button>
          </div>
        </div>
        <HeadingHeebo className='text-left mt-5'>Menu</HeadingHeebo>
        <div className='flex gap-10 items-stretch'>
          <div className='flex flex-col gap-10 border-r border-r-[#707072] pr-10 w-fit'>
            <Link href={"/rider-db/ride-details"}>Rent a car</Link>
            <Link href={"/rider-db/ride-details"}>Schedule a ride</Link>
            <Link href={"/onboarding"}>Drive</Link>
          </div>
          <div className='flex flex-col gap-20'>
            <div className='flex flex-1 flex-col gap-4 w-full md:max-w-1/3'>
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
            <HeadingHeebo className='w-fit text-left'>Payment</HeadingHeebo>
            <div className='flex gap-4'>
              <Card className='flex flex-col gap-14 bg-[#1F364B] rounded-2xl justify-between w-full md:w-fit'>
                <CardContent>
                  <div className='flex gap-5'>
                    <div className='rounded-2xl flex flex-col justify-between  p-3 w-[384px] gap-14'>
                      <div className='flex justify-between items-center'>
                        <div className='flex flex-col'>
                          <HeadingHeebo className='text-xl w-fit text-left font-bold text-white'>
                            Mastercard
                          </HeadingHeebo>
                          <p className='text-white text-lg font-medium'>
                            ***** ***** 3762
                          </p>
                          <p className='text-lightgreen text-xs'>
                            Card details
                          </p>
                        </div>
                        <Image
                          src={"/images/credit-cards.png"}
                          alt='credit-cards'
                          width={61}
                          height={77}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex items-center justify-between'>
                  <Button className='cursor-pointer rounded-full'>
                    Add card
                  </Button>
                  <Button
                    variant={"ghost"}
                    className='flex gap-3 items-center text-destructive bg-transparent hover:bg-transparent cursor-pointer'
                  >
                    <RemoveCardIcon />
                    Remove card
                  </Button>
                </CardFooter>
              </Card>
              <Card className='flex gap-4 justify-between rounded-2xl w-full md:w-fit bg-gray'>
                <div className='flex flex-col gap-11'>
                  <HeadingHeebo className='text-sm'>Along wallet</HeadingHeebo>
                  <div className='flex gap-2 flex-col'>
                    <p>Balance</p>
                    <HeadingHeebo className='text-2xl'>$4652.98</HeadingHeebo>
                  </div>
                  <Button> Add fund</Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
