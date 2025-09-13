import {
  Button,
  Card,
  CardContent,
  CustomAuthInput,
  HeadingHeebo,
} from "@/components";

const Page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>New Card</HeadingHeebo>
      <Card className='w-full md:w-[446px] rounded-2xl shadow-none'>
        <CardContent className='flex flex-col gap-4'>
          <CustomAuthInput
            label='Holder Name'
            placeholder='000 000 00000 0000'
            inputClassName='font-heebo placeholder:font-heebo rounded-2xl placeholder:font-light placeholder:text-[#707072] h-10 bg-[#C9C9C930]'
            labelClassName='font-heebo font-medium text-sm  ml-2 '
          />

          <CustomAuthInput
            label='Card Number'
            placeholder='000 000 00000 0000'
            inputClassName='font-heebo placeholder:font-heebo rounded-2xl placeholder:font-light placeholder:text-[#707072] h-10 bg-[#C9C9C930]'
            labelClassName='font-heebo font-medium text-sm  ml-2'
          />
          <div className='flex gap-4'>
            <CustomAuthInput
              label='Expiry Date'
              placeholder='MM/YY'
              className='flex-1'
              inputClassName='font-heebo placeholder:font-heebo rounded-2xl placeholder:font-light placeholder:text-[#707072] h-10 bg-[#C9C9C930]'
              labelClassName='font-heebo font-medium text-sm  ml-2'
            />

            <CustomAuthInput
              label='CVC'
              placeholder='000'
              inputClassName='font-heebo placeholder:font-heebo rounded-2xl placeholder:font-light placeholder:text-[#707072] h-10 bg-[#C9C9C930]'
              labelClassName='font-heebo font-medium text-sm  ml-2'
            />
          </div>
        </CardContent>
      </Card>
      <div className='flex justify-end items-center w-full md:w-[446px] px-4 '>
        <Button className='cursor-pointer text-sm rounded-full'>
          Add card
        </Button>
      </div>
    </div>
  );
};
export default Page;
