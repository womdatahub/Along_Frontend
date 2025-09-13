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
      <HeadingHeebo className='text-start pl-4'>Wallet</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-12'>
          <div className='flex flex-col gap-1 font-heebo'>
            <p className='text-base'>Balance</p>
            <p className='font-semibold font-heebo text-4xl'>$4652.98</p>
          </div>
        </CardContent>
        <CardFooter>
          <div className='flex justify-between items-center gap-8'>
            <Button className='cursor-pointer text-sm rounded-2xl h-11 bg-gray-2 text-black hover:bg-gray-2/90'>
              Credit with debit card
            </Button>
            <Button
              variant={"ghost"}
              className='cursor-pointer hover:bg-transparent p-0 h-fit'
            >
              Bank transfer
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
export default Page;
