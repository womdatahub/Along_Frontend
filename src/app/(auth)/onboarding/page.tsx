"use client";
import { AddInput, Button } from "@/components";
import { HeadingHeebo } from "@/components";
import { BtnLoader } from "@/components";
import { onboardingSchema, TOnboardingValidator } from "@/lib";
import { useSession } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { DarkFacebookIcon, DarkGoogleIcon, DarkIosIcon } from "@public/svgs";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const {
    isLoading,
    actions: { registerUser },
  } = useSession((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TOnboardingValidator>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: TOnboardingValidator) => {
    console.log(values, errors);
    await registerUser({ ...values, type: "email" }).then((val) => {
      if (val === false) return;
      router.push("/onboarding/otp");
    });
  };

  return (
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 rounded-[20px] w-[500px] px-8 py-10 bg-background-1 text-black text-4xl'
      >
        <HeadingHeebo>Let’s get you onboard</HeadingHeebo>
        <AddInput
          id='email'
          errors={errors}
          placeholder='Enter phone number, email'
          register={register}
          disabled={false}
          required
          type='text'
          inputClassName='bg-white h-16 rounded-2xl text-center text-lg focus:outline-none focus:ring-0'
        />
        <AddInput
          id='password'
          errors={errors}
          placeholder='Password'
          register={register}
          disabled={false}
          required
          type='password'
          inputClassName='bg-white h-16 rounded-2xl text-center text-lg focus:outline-none focus:ring-0'
        />

        <Button
          type='submit'
          variant='default'
          disabled={isLoading}
          className='bg-primary rounded-2xl h-16 items-center w-full text-white text-lg hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'
        >
          <BtnLoader isLoading={isLoading}>Continue</BtnLoader>
        </Button>
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
          <p className='text-gray text-xs font-light text-center'>
            By continuing, you agree that Along and its affiliates may contact
            you at the number you provide via calls, WhatsApp, or SMS/RCS
            messages, which may sometimes be sent automatically.
          </p>
        </div>
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
