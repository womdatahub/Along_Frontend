"use client";

import { Badge, Button, HeadingHeebo } from "@/components";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className='font-fustat bg-background-1 min-h-[calc(100vh-80px)]'>
      <section className='px-4 py-12 md:py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center'>
        <div className='flex flex-col gap-5'>
          <Badge className='w-fit bg-primaryLight2 text-primary hover:bg-primaryLight2'>
            Coming soon
          </Badge>
          <HeadingHeebo className='font-extrabold text-5xl md:text-[67px] text-left'>
            Ride-hailing
          </HeadingHeebo>
          <p className='font-heebo font-light text-lg text-left'>
            Point-to-point ride-hailing will return when dispatch, driver
            matching, and live trip tracking are available through the backend.
            Vehicle rental is live today.
          </p>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button asChild className='rounded-full w-fit'>
              <Link href='/rent-ride'>Rent a vehicle</Link>
            </Button>
            <Button asChild variant='secondary' className='rounded-full w-fit'>
              <Link href='/'>Back home</Link>
            </Button>
          </div>
        </div>
        <Image
          src='/images/rental.png'
          alt='Along vehicle rental'
          width={560}
          height={420}
          className='w-full rounded-2xl object-cover bg-white'
          priority
        />
      </section>
    </div>
  );
};

export default Page;
