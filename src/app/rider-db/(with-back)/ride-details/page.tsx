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
        <CardContent className='flex flex-col gap-12'>
          <div className='flex flex-col gap-1 font-heebo'>
            <p className='text-base'>Balance</p>
            <p className='font-semibold font-heebo text-4xl'>$4652.98</p>
          </div>
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
