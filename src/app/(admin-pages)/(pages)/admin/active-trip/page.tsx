"use client";

import { Card, CardContent } from "@/components";
import { cn } from "@/lib";
import {
  AdminSearchIcon,
  BlackCalenderIcon,
  BlackClockIcon,
  BlackCurrentLocationIcon,
  BlackCurrentSpeedIcon,
  BlackDistanceToLocationIcon,
} from "@public/svgs";
import { useState } from "react";

const Page = () => {
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  return (
    <section className='flex flex-col gap-8'>
      <p className='text-4xl font-heebo'>Active Trip</p>
      <div className='flex gap-7'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4 items-center'>
            <div className='flex gap-3 items-center px-3 py-2 rounded-full bg-white shadow-md min-w-[250px]'>
              <AdminSearchIcon />
              <input
                type='text'
                name='search'
                id='search'
                className='bg-transparent focus:outline-none'
                placeholder='Search'
              />
            </div>
          </div>
          {trips.map((trip, id) => (
            <Card
              key={id}
              className={cn(
                "w-full md:w-[350px] rounded-2xl shadow-none border",
                selectedTripIndex === id && "bg-[#EFF1F1]"
              )}
              onClick={() => setSelectedTripIndex(id)}
            >
              <CardContent className='flex flex-col gap-3 px-0'>
                <div className='font-heebo flex justify-between items-center font-semibold text-sm text-primary px-4'>
                  <p>Scheduled Trip</p>
                  <p className='text-black text-xs'>Trip ID: {trip.tripId}</p>
                </div>
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
                      <p className='font-bold text-xs'>{trip.pickup.address}</p>
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
                      <p className='font-bold text-xs'>
                        {trip.dropoff.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div className='flex gap-4 justify-between items-center px-4 mt-6 pt-4 border-t-2'>
                  <p className='text-[10px] text-gray-5'>Vehicle type</p>
                  <p className='font-heebo font-semibold text-xs'>
                    {trip.vehicleType}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className='w-full rounded-2xl shadow-none border'>
          <CardContent className='flex flex-col gap-10'>
            <div className='flex flex-col gap-3'>
              <p className='font-semibold text-lg'>Map overview</p>
              <div className='border border-blue-400 h-[430px]'></div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2'>
                <p className='font-semibold text-xl'>Driver</p>
                <div className='flex items-start gap-4 rounded-2xl border p-5'>
                  <div className='flex-1'>
                    <div className='flex gap-3 items-center '>
                      <div className='size-10 rounded-full bg-gray-300 shrink-0' />
                      <div className='flex flex-col'>
                        <p className='font-bold text-lg'>Mark Spencer</p>
                        <p className='text-xs font-medium text-gray-500'>
                          SSN: 1908 8665 000
                        </p>
                      </div>
                      <button className='ml-auto h-9 px-4 rounded-full border text-sm'>
                        Contact
                      </button>
                    </div>

                    <div className='grid grid-cols-4 gap-y-2 gap-x-4 mt-4 text-sm'>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          Vehicle model
                        </p>
                        <p className='font-medium text-xs'>Tesla Model Y</p>
                      </div>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          License
                        </p>
                        <p className='font-medium text-xs'>LA23 76 NYC</p>
                      </div>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          Phone number
                        </p>
                        <p className='font-medium text-xs'>+1 764 009 099</p>
                      </div>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          Vehicle colour
                        </p>
                        <p className='font-medium text-xs'>White</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <p className='font-semibold text-xl'>Rider</p>
                <div className='flex items-start gap-4 rounded-2xl border p-5'>
                  <div className='flex-1'>
                    <div className='flex gap-3 items-center '>
                      <div className='size-10 rounded-full bg-gray-300 shrink-0' />
                      <div className='flex flex-col'>
                        <p className='font-bold text-lg'>Anna Emperon</p>
                        <p className='text-xs font-medium text-gray-500'>
                          annaemperon@gmail.com
                        </p>
                      </div>
                      <button className='ml-auto h-9 px-4 rounded-full border text-sm'>
                        Contact
                      </button>
                    </div>

                    <div className='flex gap-10 mt-4 text-sm'>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          Phone number
                        </p>
                        <p className='font-medium text-xs'>+ 1 764 009 099</p>
                      </div>
                      <div>
                        <p className='text-gray-400 font-medium text-xs'>
                          Email address
                        </p>
                        <p className='font-medium text-xs'>
                          annaempron@gmail.com
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex flex-col'>
              <div className='flex flex-wrap text-xs items-center justify-between gap-14 rounded-t-xl border p-5'>
                <div className='flex items-center gap-2.5'>
                  <BlackCalenderIcon />
                  <div>
                    <p className='text-gray-400 text-sm font-medium'>Date</p>
                    <p className='font-bold text-base'>12-December-2025</p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <BlackClockIcon />
                  <div>
                    <p className='text-gray-400 text-sm font-medium '>
                      Start time
                    </p>
                    <p className='font-bold text-base'>3 : 30 PM</p>
                  </div>
                </div>

                <div className='flex items-center gap-2.5'>
                  <BlackClockIcon />
                  <div>
                    <p className='text-gray-400 text-sm font-medium '>
                      End Location
                    </p>
                    <p className='font-bold text-base'>St Louise Avenue</p>
                  </div>
                </div>

                <button className='ml-auto bg-red-600 text-white px-6 py-2 rounded-full text-sm'>
                  Terminate this trip
                </button>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 rounded-b-xl border p-5'>
                <div className='flex items-center gap-2.5'>
                  <BlackCurrentLocationIcon />
                  <div>
                    <p className='font-bold text-base'>Current location</p>
                    <p className='text-sm text-gray-500 font-medium'>
                      Mountain Hills Boulevard, Texas
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2.5'>
                  <BlackDistanceToLocationIcon />
                  <div>
                    <p className='font-bold text-base'>
                      Distance to destination
                    </p>
                    <p className='text-sm text-gray-500 font-medium'>
                      1.6 miles / 5 miles
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-2.5'>
                  <BlackCurrentSpeedIcon />
                  <div>
                    <p className='font-bold text-base'>Current speed</p>
                    <p className='text-sm text-gray-500 font-medium'>68 mph</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default Page;
const trips = [
  {
    title: "Scheduled Trip",
    tripId: "109934",
    pickup: {
      label: "Pick up location",
      address: "Mountain Hills Boulevard, Texas",
    },
    dropoff: {
      label: "Drop off location",
      address: "St Louise Avenue, Florida",
    },
    vehicleType: "Economy",
  },
  {
    title: "Scheduled Trip",
    tripId: "884201",
    pickup: {
      label: "Pick up location",
      address: "Lekki Phase 1, Lagos",
    },
    dropoff: {
      label: "Drop off location",
      address: "Ikeja GRA, Lagos",
    },
    vehicleType: "SUV",
  },
  {
    title: "Scheduled Trip",
    tripId: "552781",
    pickup: {
      label: "Pick up location",
      address: "Allen Avenue, Ikeja",
    },
    dropoff: {
      label: "Drop off location",
      address: "Ajah Roundabout, Lagos",
    },
    vehicleType: "Premium",
  },
  {
    title: "Scheduled Trip",
    tripId: "773490",
    pickup: {
      label: "Pick up location",
      address: "Yaba Tech Road, Lagos",
    },
    dropoff: {
      label: "Drop off location",
      address: "Victoria Island, Lagos",
    },
    vehicleType: "Economy",
  },
];
