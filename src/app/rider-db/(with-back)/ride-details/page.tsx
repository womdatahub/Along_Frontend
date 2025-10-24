"use client";
import { Card, CardContent, HeadingHeebo } from "@/components";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Ride details</HeadingHeebo>
      <Card className='w-full md:w-[422px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-3 px-0'>
          <p className='font-heebo font-semibold text-xl text-primary px-6'>
            Scheduled Ride
          </p>
          <div className='flex flex-col gap-1 px-6'>
            <div className='flex gap-2'>
              <div className='flex self-end'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M7.5 0C7.88463 0 8.20163 0.28953 8.24495 0.662534L8.25 0.75L8.25026 1.73547C10.8607 2.07188 12.9286 4.13999 13.2646 6.7505L14.25 6.75C14.6642 6.75 15 7.08579 15 7.5C15 7.88463 14.7105 8.20163 14.3375 8.24495L14.25 8.25L13.2645 8.25026C12.9282 10.8604 10.8604 12.9282 8.25026 13.2645L8.25 14.25C8.25 14.6642 7.91421 15 7.5 15C7.11537 15 6.79837 14.7105 6.75505 14.3375L6.75 14.25L6.7505 13.2646C4.13999 12.9286 2.07188 10.8607 1.73547 8.25026L0.75 8.25C0.335786 8.25 0 7.91421 0 7.5C0 7.11537 0.28953 6.79837 0.662534 6.75505L0.75 6.75L1.73538 6.7505C2.07148 4.13974 4.13974 2.07148 6.7505 1.73538L6.75 0.75C6.75 0.335786 7.08579 0 7.5 0ZM7.5 3.1875C5.11827 3.1875 3.1875 5.11827 3.1875 7.5C3.1875 9.88173 5.11827 11.8125 7.5 11.8125C9.88173 11.8125 11.8125 9.88173 11.8125 7.5C11.8125 5.11827 9.88173 3.1875 7.5 3.1875ZM7.5 4.5C9.15685 4.5 10.5 5.84315 10.5 7.5C10.5 9.15685 9.15685 10.5 7.5 10.5C5.84315 10.5 4.5 9.15685 4.5 7.5C4.5 5.84315 5.84315 4.5 7.5 4.5Z'
                    fill='black'
                  />
                </svg>
              </div>

              <div className='font-fustat'>
                <p className='font-light text-[10px] text-gray-5'>
                  Pick up location
                </p>
                <p className='font-bold text-xs'>
                  Mountain Hills Boulevard, Texas
                </p>
              </div>
            </div>
            <div className='w-[1px] h-4 bg-[#3F3F3F] ml-[7px]' />
            <div className='flex gap-2'>
              <div className='flex self-end'>
                <svg
                  width='15'
                  height='15'
                  viewBox='0 0 15 15'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect width='13' height='13' rx='2' fill='black' />
                </svg>
              </div>

              <div className='font-fustat -mt-[14px]'>
                <p className='font-light text-[10px] text-gray-5'>
                  Drop off location
                </p>
                <p className='font-bold text-xs'>St Louise Avenue, Florida</p>
              </div>
            </div>
          </div>

          <div className='flex flex-col'>
            <div className='flex items-center gap-4 border-y h-15 font-fustat px-6'>
              <p className='text-gray-5 text-xs flex-1'>Date</p>
              <div className='flex flex-col'>
                <p className='text-gray-3 font-light text-[10px]'>Depart</p>
                <p className='font-bold text-xs'>01 Apr 2025</p>
              </div>
              <div className='flex flex-col'>
                <p className='text-gray-3 font-light text-[10px]'>Return</p>
                <p className='font-bold text-xs'>06 Apr 2025</p>
              </div>
            </div>
            <div className='flex items-center gap-4 border-b h-15 font-fustat px-6 justify-between'>
              <p className='text-gray-5 text-xs'>Pick up time</p>
              <p className='font-bold text-xs'>12 : 35 PM</p>
            </div>
            <div className='flex items-center gap-4 border-b h-15 font-fustat px-6 justify-between'>
              <div className='flex flex-col'>
                <p className='text-gray-3 font-light text-[10px]'>
                  Vehicle type
                </p>
                <p className='font-bold text-xs'>Economy</p>
              </div>{" "}
              <div className='flex flex-col'>
                <p className='text-gray-3 font-light text-[10px]'>Pet</p>
                <p className='font-bold text-xs'>Dog</p>
              </div>
              <div className='flex flex-col'>
                <p className='text-gray-3 font-light text-[10px]'>Luggage</p>
                <p className='font-bold text-xs'>Yes</p>
              </div>
            </div>
            <div className='flex items-center gap-4 border-b h-15 font-fustat px-6 justify-between'>
              <p className='text-gray-5 text-xs'>Ride amount</p>
              <p className='font-bold text-xl'>$45.99</p>
            </div>
          </div>
          <div className='flex gap-4 justify-between items-center px-6 mt-2'>
            <p className='text-[10px] text-gray-5'>
              Request Status:{" "}
              <span className='text-pending font-semibold'>Pending</span>
            </p>
            <p className='font-heebo font-semibold text-xs text-danger'>
              Cancel
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default Page;
