"use client";
import { Button, Card, CardContent, HeadingHeebo } from "@/components";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Wallet</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-12 p-0 items-center'>
          <div className='flex flex-col gap-1 font-heebo'>
            <p className='text-base text-center'>Balance</p>
            <p className='font-semibold font-heebo text-4xl'>$4652.98</p>
          </div>
        </CardContent>
        <div className='text-base h-11 bg-gray-2 text-black flex gap-3 items-center justify-center'>
          <p>Bonus Bal:</p>
          <p className='font-heebo font-medium text-2xl'>$98</p>
        </div>
        <Button
          variant='default'
          className='cursor-pointer self-center rounded-xl h-11'
        >
          Credit with debit card
        </Button>
      </Card>
    </div>
  );
};
export default Page;
