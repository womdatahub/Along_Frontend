"use client";

import { Badge, Button, HeadingHeebo } from "@/components";
import { CalendarClock } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full py-8 md:py-14 min-h-[calc(100vh-80px)]'>
      <div className='grid md:grid-cols-[0.9fr_1.1fr] gap-8 items-center'>
        <section className='flex flex-col gap-5'>
          <Badge className='w-fit bg-primaryLight2 text-primary hover:bg-primaryLight2'>
            Coming soon
          </Badge>
          <HeadingHeebo className='text-left font-extrabold text-4xl md:text-5xl'>
            Scheduled ride-hailing
          </HeadingHeebo>
          <p className='text-sm md:text-base text-gray-5'>
            Scheduled point-to-point rides are inactive while dispatch and
            driver matching are being completed. Scheduled vehicle rental remains
            available from the rental flow.
          </p>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button asChild className='rounded-full w-fit'>
              <Link href='/rent-ride?isLater=true'>Schedule a rental</Link>
            </Button>
            <Button asChild variant='secondary' className='rounded-full w-fit'>
              <Link href='/rider-db'>Go to dashboard</Link>
            </Button>
          </div>
        </section>
        <section className='rounded-2xl bg-white p-6 md:p-10 flex flex-col gap-5'>
          <div className='size-14 rounded-full bg-primaryLight2 flex items-center justify-center text-primary'>
            <CalendarClock />
          </div>
          <div className='grid sm:grid-cols-3 gap-3 text-sm'>
            {["Dispatch", "Live matching", "Trip tracking"].map((item) => (
              <div key={item} className='rounded-2xl bg-background-1 p-4'>
                <p className='font-bold'>{item}</p>
                <p className='text-gray-5'>Unavailable</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
