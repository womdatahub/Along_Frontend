"use client";
import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4 mb-11'>Vehicle</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-4'>
          <Image
            alt='camry'
            src='/images/camry.png'
            width={446}
            height={446}
            className='-mt-20 max-w-[302px]'
          />
          {items.map((i) => {
            return (
              <div
                key={i.title}
                className='flex gap-4 justify-between items-center border-b last:mb-10 pb-4 border-b-[#D0DCDD] text-sm'
              >
                <p className='font-medium text-placeholder'>{i.title}</p>
                <p className='font-bold'>{i.value}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
      <div className='flex justify-between items-center w-full md:w-[446px]'>
        <Button className='cursor-pointer text-sm rounded-full' asChild>
          <Link href='/driver-db/vehicle-reg'>Add vehicle</Link>
        </Button>
      </div>
    </div>
  );
};
export default Page;

const items = [
  {
    title: "Car make",
    value: "Toyota",
  },
  {
    title: "Model",
    value: "Camry",
  },
  {
    title: "Year",
    value: "2023",
  },
  {
    title: "Color",
    value: "Blue",
  },
  {
    title: "License number",
    value: "LK 238 90",
  },
];
