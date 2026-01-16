"use client";
import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import { RemoveCardIcon } from "@public/svgs";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Card Details</HeadingHeebo>
      {/* <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex gap-1 flex-col font-heebo text-black  text-sm border-b pb-4'>
            <p className=' font-light text-gray-5'>Holder Name</p>
            <p className='font-semibold'>Michael Cynthia</p>
          </div>
          <div className='flex gap-1 flex-col font-heebo text-black  text-sm border-b pb-4'>
            <p className=' font-light text-gray-5'>Card Number</p>
            <p className='font-semibold'>22344 5654 5664 6092</p>
          </div>
          <div className='flex justify-between gap-4'>
            <div className='flex gap-1 flex-col font-heebo text-black  text-sm'>
              <p className=' font-light text-gray-5'>Exp Date</p>
              <p className='font-semibold'>07/29</p>
            </div>
            <div className='flex gap-1 flex-col font-heebo text-black  text-sm'>
              <p className=' font-light text-gray-5'>Security Code</p>
              <p className='font-semibold'>322</p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      <Card className='flex flex-col gap-14 bg-[#1F364B] rounded-2xl justify-between w-full md:w-fit border-0 shadow-none'>
        <CardContent className='flex gap-5'>
          <div className='flex flex-col justify-between w-[384px] gap-14'>
            <div className='flex justify-between items-center'>
              <div className='flex flex-col gap-5 justify-between'>
                <div className='flex flex-col'>
                  <p className='text-[#C5C5C5] text-base font-light'>
                    Holders Name
                  </p>
                  <HeadingHeebo className='text-lg w-fit text-left font-semibold text-white'>
                    Micheal Cynthia
                  </HeadingHeebo>
                </div>
                <div className='flex flex-col'>
                  <p className='text-[#C5C5C5] text-base font-light'>
                    Card Number
                  </p>
                  <HeadingHeebo className='text-lg w-fit text-left font-semibold text-white'>
                    ***** ***** 6092
                  </HeadingHeebo>
                </div>
                <div className='flex flex-col'>
                  <p className='text-[#C5C5C5] text-base font-light'>
                    Exp Date
                  </p>
                  <HeadingHeebo className='text-lg w-fit text-left font-semibold text-white'>
                    ********
                  </HeadingHeebo>
                </div>
              </div>
              <div className='flex h-full justify-between flex-col gap-5'>
                <Image
                  src={"/images/credit-cards.png"}
                  alt='credit-cards'
                  width={61}
                  height={77}
                />
                <div className='flex flex-col'>
                  <p className='text-[#C5C5C5] text-base font-light'>
                    Security Code
                  </p>
                  <HeadingHeebo className='text-lg w-fit text-left font-semibold text-white'>
                    ***
                  </HeadingHeebo>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex justify-between items-center w-full md:w-[446px] px-4'>
        <Button asChild className='cursor-pointer text-sm rounded-full'>
          <Link href='/rider-db/new-card'>Add card</Link>
        </Button>
        <Button
          variant={"destructive"}
          className='bg-transparent hover:bg-transparent text-destructive cursor-pointer border-none shadow-none p-0 text-xs font-heebo flex items-center gap-1'
        >
          <RemoveCardIcon />
          Remove card
        </Button>
      </div>
    </div>
  );
};
export default Page;
