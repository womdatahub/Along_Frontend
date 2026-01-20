"use client";

import {
  AddInput,
  AuthBackAndContinueButton,
  DatePicker,
  SelectDropdown,
} from "@/components";
import { HeadingHeebo } from "@/components";
import { TRegisterRiderValidator, registerRiderSchema } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selected, setSelected] = useState<string>("");

  const router = useRouter();

  const {
    userProfile,
    actions: { registerRider },
  } = useSession((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterRiderValidator>({
    defaultValues: {
      firstName: "",
      lastName: "",
      mobileNumber: userProfile?.mobileNumber ?? "",
    },
    resolver: zodResolver(registerRiderSchema),
  });

  const onSubmit = async (values: TRegisterRiderValidator) => {
    if (!date || !selected) return;
    console.log({
      ...values,
      dateOfBirth: date.toISOString(),
      gender: selected,
    });
    const isSuccess = await registerRider({
      ...values,
      dateOfBirth: date.toISOString(),
      gender: selected as "male" | "female",
    });
    if (isSuccess === false) return;
    router.push("/rider-db");
  };

  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] -mt-10 px-8 py-10 bg-background-1 text-black'>
      <div className='flex flex-col gap-1'>
        <HeadingHeebo>Lets get you started</HeadingHeebo>
        <p className='text-sm text-center'>
          Tell us a bit about yourself to help us set up your account.
        </p>
      </div>
      <div className='flex gap-4 px-4 py-7 rounded-lg bg-[#87C4C4] items-center'>
        <Image
          src='/images/passenger.png'
          alt={"driver"}
          width={40}
          height={40}
        />
        <p className='font-semibold text-base'>Rider</p>
      </div>

      <div className='flex flex-col gap-4'>
        <AddInput
          id='firstName'
          errors={errors}
          placeholder='John'
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          label='First Name'
        />
        <AddInput
          id='lastName'
          errors={errors}
          placeholder='Doe'
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
          label='Last Name'
        />
        <AddInput
          id='mobileNumber'
          errors={errors}
          placeholder='+234 000 000 0000'
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          label='Mobile Number'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />

        <DatePicker
          date={date}
          open={open}
          setOpen={setOpen}
          setDate={setDate}
          label='Date of birth'
          placeholder='MM/DD/YYYY'
        />

        <div className='flex flex-col gap-1'>
          <p className='font-medium text-sm ml-5'>Gender</p>
          <SelectDropdown
            triggerLabel='Select gender'
            options={["Male", "Female"]}
            selected={selected}
            setSelected={setSelected}
          />
        </div>
      </div>

      <AuthBackAndContinueButton
        backActive
        continueActive
        continueFnc={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </div>
  );
};
export default Page;
