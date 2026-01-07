"use client";

import { ButtonWithLoader, HeadingHeebo, AddInput } from "@/components";
import { cn, onboardingSchema, TOnboardingValidator } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { DarkFacebookIcon, DarkGoogleIcon, DarkIosIcon } from "@public/svgs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const {
    isLoading,
    // actions: { registerUser },
  } = useSession((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TOnboardingValidator>({
    defaultValues: {
      phoneNumber: "",
      email: "",
      password: "",
      referralCode: "",
    },
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: TOnboardingValidator) => {
    console.log(values, errors);
    // await registerUser({ ...values, type: "email" }).then((val) => {
    //   if (val === false) return;
    //   router.push("/onboarding/otp?email=" + values.email);
    // });
    router.push("/onboarding/otp?email=" + values.email);
  };

  return (
    <div className='flex justify-center items-center h-full px-4 md:px-0'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 rounded-[20px] max-w-[500px] px-4 md:px-8 py-6 md:py-10 bg-background-1 text-black text-4xl'
      >
        <HeadingHeebo>Let’s get you onboard</HeadingHeebo>
        <AddInput
          id='email'
          errors={errors}
          placeholder='Email'
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
        />
        <AddInput
          id='phoneNumber'
          errors={errors}
          placeholder='Phone Number'
          register={register}
          disabled={false}
          required
          type='text'
          icon={
            <svg
              width='13'
              height='24'
              viewBox='0 0 13 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M12.4928 5.33887H0V18.4654H12.4928V5.33887Z'
                fill='#B2B2B2'
              />
              <path
                d='M10.177 0H2.31577C1.03884 0 0 1.03884 0 2.31577V3.86939H12.4928V2.31577C12.4928 1.03884 11.4539 0 10.177 0ZM7.24997 2.4338H3.5775V1.55217H7.24997V2.4338ZM8.91525 2.4338H8.03461V1.55217H8.91525V2.4338Z'
                fill='#B2B2B2'
              />
              <path
                d='M0 19.9346V21.6841C0 22.961 1.03884 23.9999 2.31577 23.9999H10.177C11.4539 23.9999 12.4928 22.9611 12.4928 21.6841V19.9346H0ZM7.44441 22.6289H5.04834V21.1596H7.44441V22.6289Z'
                fill='#B2B2B2'
              />
            </svg>
          }
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />

        <AddInput
          id='password'
          errors={errors}
          placeholder='Password'
          register={register}
          disabled={false}
          required
          type='password'
          icon={
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                fill-rule='evenodd'
                clip-rule='evenodd'
                d='M4.8 9.6V5.6C4.8 2.5072 7.3072 0 10.4 0C13.4928 0 16 2.5072 16 5.6V9.6H18.4C19.7254 9.6 20.8 10.6745 20.8 12V12.88C22.6258 13.2506 24 14.8648 24 16.8C24 18.7352 22.6258 20.3494 20.8 20.72V21.6C20.8 22.9254 19.7254 24 18.4 24H2.4C1.07452 24 0 22.9254 0 21.6V12C0 10.6745 1.07452 9.6 2.4 9.6H4.8ZM6.4 5.6C6.4 3.39086 8.19086 1.6 10.4 1.6C12.6091 1.6 14.4 3.39086 14.4 5.6V9.6H6.4V5.6ZM13.6 14.4C12.2745 14.4 11.2 15.4745 11.2 16.8C11.2 18.1254 12.2745 19.2 13.6 19.2H20C21.3254 19.2 22.4 18.1254 22.4 16.8C22.4 15.4745 21.3254 14.4 20 14.4H13.6Z'
                fill='#B2B2B2'
              />
            </svg>
          }
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />
        <AddInput
          id='referralCode'
          errors={errors}
          placeholder='Referral Code (Optional)'
          register={register}
          disabled={false}
          required
          type='text'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
        />

        <div className='flex flex-col gap-9 mt-5'>
          <p className='text-xs font-semibold text-center'>or sign in with</p>
          <div className='flex gap-14 items-center justify-center'>
            {icons.map((icon, i) => {
              return (
                <button key={i} className='flex flex-col gap-1 cursor-pointer'>
                  {icon.icon}
                  <p className='text-xs text-icons font-semibold'>
                    {icon.name}
                  </p>
                </button>
              );
            })}
          </div>
          <div className='flex gap-3 items-center justify-center'>
            <div
              className={cn(
                "size-3 bg-white rounded-[2px] cursor-pointer",
                isTermsAccepted && "bg-primary"
              )}
              onClick={() => setIsTermsAccepted((prev) => !prev)}
            />
            <p className='font-fustat text-xs text-center text-primary'>
              Terms and Conditions apply
            </p>
          </div>

          <p className='text-gray text-xs font-light text-center'>
            By continuing, you agree that Along and its affiliates may contact
            you at the number you provide via calls, WhatsApp, or SMS/RCS
            messages, which may sometimes be sent automatically.
          </p>
        </div>
        <ButtonWithLoader
          isLoading={isLoading}
          text='Continue'
          type='submit'
          variant='default'
          className='bg-primary rounded-2xl h-16 items-center w-full text-white text-lg hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'
        />
        <Link href='/sign-in' className='text-primary text-sm w-fit mx-auto'>
          Sign in
        </Link>
      </form>
    </div>
  );
};
export default Page;

const icons = [
  {
    icon: <DarkIosIcon />,
    name: "Apple",
  },
  {
    icon: <DarkGoogleIcon />,
    name: "Google",
  },
  {
    icon: <DarkFacebookIcon />,
    name: "Facebook",
  },
];
