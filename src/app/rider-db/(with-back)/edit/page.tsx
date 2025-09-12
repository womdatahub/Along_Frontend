"use client";
import { Button, CustomAuthInput, HeadingHeebo } from "@/components";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Edit</HeadingHeebo>
      <div className='flex flex-col gap-6'>
        <CustomAuthInput
          label='Phone number'
          placeholder='+1 67 988 90098'
          className='w-full md:w-[446px] '
          inputClassName='font-medium text-sm h-[45px]'
          labelClassName='font-light font-heebo text-sm'
        />
        <Button className='rounded-full px-8 text-xs cursor-pointer w-fit'>
          Save
        </Button>
      </div>
    </div>
  );
};
export default Page;
