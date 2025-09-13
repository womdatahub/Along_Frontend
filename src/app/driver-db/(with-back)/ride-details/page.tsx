"use client";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  HeadingHeebo,
} from "@/components";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Ride details</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-3'>
          <div className='flex flex-col gap-1 font-heebo'>
            <p className='text-[10px] text-[#707072] font-heebo'>
              Pick up location
            </p>
            <p className='font-bold text-lg'>Monte Calo Crescent, New Jersey</p>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='flex flex-col gap-1 font-heebo'>
              <p className='text-[10px] text-[#707072] font-heebo'>Date</p>
              <p className='font-bold text-sm'>Mon 23, August 2025 </p>
            </div>
            <div className='flex flex-col gap-1 font-heebo'>
              <p className='text-[10px] text-[#707072] font-heebo'>
                Pick up time
              </p>
              <p className='font-bold text-sm'>12 : 35 PM</p>
            </div>
          </div>
          <p className='font-bold text-lg mt-2'>$45.99</p>
        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          <div className='flex justify-between items-center gap-8'>
            <Button className='cursor-pointer text-sm rounded-full h-11 px-8'>
              Book again
            </Button>
            <Button
              variant={"ghost"}
              className='cursor-pointer hover:bg-transparent p-0 h-fit'
            >
              Report
            </Button>
          </div>
          <p className='text-green-600 text-xs'>Completed</p>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Page;
