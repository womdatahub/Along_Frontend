"use client";
import { AddInput, Button, HeadingHeebo } from "@/components";
import {
  TUpdateMobileNumberSchemaValidator,
  updateMobileNumberSchema,
} from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TUpdateMobileNumberSchemaValidator>({
    defaultValues: {
      mobileNumber: "",
    },
    resolver: zodResolver(updateMobileNumberSchema),
  });

  const onSubmit = async (values: TUpdateMobileNumberSchemaValidator) => {
    console.log(values, errors);
  };

  return (
    <div className='flex flex-col gap-5'>
      <HeadingHeebo className='text-start pl-4'>Edit</HeadingHeebo>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
        {/* <CustomAuthInput
          label='Phone number'
          placeholder='+1 67 988 90098'
          className='w-full md:w-[446px] '
          inputClassName='font-medium text-sm h-[45px]'
          labelClassName='font-light font-heebo text-sm'
        /> */}

        <AddInput
          id='mobileNumber'
          errors={errors}
          placeholder='+1 67 988 90098'
          register={register}
          disabled={false}
          required
          type='text'
          label='Phone number'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-[45px]'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <Button
          type='submit'
          className='rounded-full px-8 text-xs cursor-pointer w-fit'
        >
          Save
        </Button>
      </form>
    </div>
  );
};
export default Page;
