"use client";
import { Button } from "@/components";
import { HeadingHeebo } from "@/components";
import { DarkFacebookIcon, DarkGoogleIcon, DarkIosIcon } from "@public/svgs";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  return (
    <div className='flex justify-center items-center h-full'>
      <div className='flex flex-col gap-6 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black text-4xl'>
        <HeadingHeebo>Let’s get you onboard</HeadingHeebo>
        <input
          className='bg-white h-16 rounded-2xl text-center text-lg focus:outline-none focus:ring-0'
          placeholder='Enter phone number, email'
        />
        <Button
          variant='default'
          onClick={() => router.push("/onboarding/otp")}
          className='bg-primary rounded-2xl h-16 items-center w-full text-white text-lg hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'
        >
          Continue
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
      </div>
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
