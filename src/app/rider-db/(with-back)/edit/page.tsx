"use client";
import { AddInput, Button, CustomAuthInput, HeadingHeebo } from "@/components";

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

        {/* <AddInput
                  id='email'
                  errors={errors}
                  placeholder='Email or Phone Number'
                  register={register}
                  disabled={false}
                  required
                  type='text'
                  icon={
                    <svg
                      width='24'
                      height='18'
                      viewBox='0 0 24 18'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M20.668 0H3.33202C1.49189 0 0 1.49189 0 3.33202V14.3C0 16.1401 1.49189 17.632 3.33202 17.632H20.668C22.5081 17.632 24 16.1401 24 14.3V3.33202C24 1.49189 22.5081 0 20.668 0ZM8.35153 11.8966L3.68559 15.8773C3.35648 16.1581 2.86172 16.1191 2.58089 15.7897C2.30002 15.4605 2.33906 14.9658 2.66855 14.685L7.33448 10.7043C7.66355 10.4235 8.15827 10.4625 8.43914 10.792C8.72002 11.121 8.68097 11.6158 8.35153 11.8966ZM12 10.3833C11.3759 10.3818 10.7709 10.1744 10.298 9.76537L10.2983 9.76575L10.2968 9.76462C10.2972 9.765 10.2976 9.765 10.298 9.76537L3.13884 3.55167C2.81166 3.2677 2.77683 2.77298 3.06038 2.44622C3.3443 2.11903 3.83906 2.0842 4.16578 2.36775L11.3269 8.583C11.48 8.71922 11.7322 8.81756 12 8.81602C12.2675 8.81681 12.5154 8.72114 12.6769 8.58033L12.6803 8.57728L19.8342 2.3678C20.1609 2.08425 20.6557 2.11908 20.9396 2.44627C21.2231 2.77298 21.1883 3.26775 20.8612 3.55172L13.7001 9.7673C13.2286 10.1721 12.6245 10.3825 12 10.3833ZM21.4194 15.7897C21.1386 16.1191 20.6438 16.1581 20.3148 15.8773L15.6488 11.8966C15.3194 11.6158 15.2804 11.121 15.5612 10.792C15.8421 10.4625 16.3368 10.4235 16.6659 10.7043L21.3318 14.685C21.6613 14.9658 21.7003 15.4605 21.4194 15.7897Z'
                        fill='#B2B2B2'
                      />
                    </svg>
                  }
                  iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
                  inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
                /> */}
        <Button className='rounded-full px-8 text-xs cursor-pointer w-fit'>
          Save
        </Button>
      </div>
    </div>
  );
};
export default Page;
