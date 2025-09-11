import { Button, Card, CardContent, HeadingHeebo } from "@/components";
import { RemoveCardIcon } from "@public/svgs";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Card Details</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-4'>
          <div className='flex gap-1 flex-col font-heebo text-black  text-sm border-b pb-4'>
            <p className=' font-light text-[#707072]'>Holder Name</p>
            <p className='font-semibold'>Michael Cynthia</p>
          </div>
          <div className='flex gap-1 flex-col font-heebo text-black  text-sm border-b pb-4'>
            <p className=' font-light text-[#707072]'>Card Number</p>
            <p className='font-semibold'>22344 5654 5664 6092</p>
          </div>
          <div className='flex justify-between gap-4'>
            <div className='flex gap-1 flex-col font-heebo text-black  text-sm'>
              <p className=' font-light text-[#707072]'>Exp Date</p>
              <p className='font-semibold'>07/29</p>
            </div>
            <div className='flex gap-1 flex-col font-heebo text-black  text-sm'>
              <p className=' font-light text-[#707072]'>Security Code</p>
              <p className='font-semibold'>322</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className='flex justify-between items-center w-full md:w-[446px] px-4'>
        <Button className='cursor-pointer text-sm rounded-full'>
          Add card
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
