"use client";

import { AddInput, AddTextarea, Button, HeadingHeebo } from "@/components";
import {
  THearFromYouValidator,
  // TOnboardingValidator,
  hearFromYouSchema,
  // onboardingSchema,
} from "@/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<THearFromYouValidator>({
    defaultValues: {
      email: "",
      fullName: "",
      mobileNumber: "",
      yourMessage: "",
    },
    resolver: zodResolver(hearFromYouSchema),
  });

  const onSubmit = async (values: THearFromYouValidator) => {
    console.log(values, errors);
    // await registerUser({ ...values, type: "email" }).then((val) => {
    //   if (val === false) return;
    //   router.push("/onboarding/otp?email=" + values.email);
    // });
  };

  return (
    <div className='font-fustat'>
      <section className='pt-14 px-4 md:px-6 text-center bg-background-1 h-fit md:h-[844px'>
        <div className='flex  gap-20 max-w-6xl mx-auto items-center justify-between'>
          <div className='flex flex-col gap-10 w-1/2'>
            <HeadingHeebo className='font-extrabold text-[67px] text-left'>
              About Us
            </HeadingHeebo>
            <p className='font-heebo font-light text-lg text-left'>
              At Along, we care about bridging the gap between smaller towns,
              suburbs, and major cities by connecting local residents with
              drivers already traveling those routes. For communities without
              access to robust public transportation or airports, Along creates
              a reliable, convenient, and affordable way to move across cities
              and regions. Beyond shared rides, we make mobility even simpler
              with Along Rentals—customers can book professional drivers with
              vehicles on an hourly, daily, or longer basis, giving them the
              freedom to travel on their own schedule.
            </p>
          </div>
          <div className='flex'>
            <Image
              src='/images/about-us-woman.png'
              alt='woman-bg'
              width={710}
              height={863}
              className='z-10 object-contain w-full h-[863px]'
            />
          </div>
        </div>
      </section>
      <section className='py-14 md:py-36 md:px-6 text-center bg-gradient-to-b from-[#8DC13D] via-[#026270] to-[#0E4A7A]'>
        <div className='flex flex-col gap-16 max-w-6xl mx-auto items-center justify-between'>
          <div className='flex gap-20 items-center text-white justify-between'>
            <div className='flex flex-col gap-1 w-1/2'>
              <HeadingHeebo className='text-left text-[40px]'>
                Our Mission
              </HeadingHeebo>
              <p className='text-left font-light text-lg'>
                Our mission is to provide safe, customizable, and cost-effective
                intercity travel solutions across the United States and
                worldwide. Whether you’re planning ahead or need a last-minute
                ride, Along is your trusted partner for flexible, comfortable,
                and secure travel — all at your fingertips.
              </p>
            </div>
            <Image
              src='/images/about-mission.png'
              alt='mission'
              width={606}
              height={732}
              className='object-contain w-[50%] h-[732px]'
            />
          </div>
          <div className='flex gap-20 items-center text-white justify-between'>
            <Image
              src='/images/about-vision.png'
              alt='mission'
              width={606}
              height={732}
              className='object-contain w-[50%] h-[732px]'
            />
            <div className='flex flex-col gap-1 w-1/2'>
              <HeadingHeebo className='text-left text-[40px]'>
                Our Vision
              </HeadingHeebo>
              <p className='text-left  font-light text-lg'>
                To shape the future of mobility in the U.S. — one that’s
                eco-friendly, inclusive, and tailored to the needs of both
                individuals and communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className='py-14 md:py-36 md:px-6 relative text-white flex items-center justify-center'
        style={{
          backgroundImage: "url('/images/what-makes-us.png')",
          height: "80vh",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className='absolute inset-0 bg-black/40' />

        <div className='flex flex-col gap-8 max-w-6xl items-center justify-center'>
          <HeadingHeebo className='text-[40px] font-extrabold z-10'>
            What makes us different
          </HeadingHeebo>
          <div className='flex flex-col gap-1 max-w-[400px] z-10'>
            <HeadingHeebo className='text-center text-lg'>
              Inclusive Services
            </HeadingHeebo>
            <p className='text-center  font-light text-lg'>
              We don’t just focus on rides; we also offer logistics, package
              delivery, and rental options.
            </p>
          </div>
        </div>
      </section>

      <section className='py-14 md:py-36 md:px-6 bg-background-1 flex items-center justify-center'>
        <div className='flex flex-col gap-6 max-w-6xl items-center justify-center'>
          <HeadingHeebo className='text-[40px] font-extrabold z-10'>
            Have a question?
          </HeadingHeebo>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-6 max-w-[400px] z-10'
          >
            <HeadingHeebo className='text-center text-lg font-normal'>
              Please fill out the form. We’d love to hear from you
            </HeadingHeebo>
            <div className='flex flex-col gap-6'>
              <AddInput
                id='fullName'
                errors={errors}
                placeholder='Full Name'
                register={register}
                disabled={false}
                required
                type='text'
                iconAndInputWrapperClassName='bg-white rounded-none h-13 px-2'
                inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
              />
              <div className='flex gap-4'>
                <AddInput
                  id='mobileNumber'
                  errors={errors}
                  placeholder='Phone Number'
                  register={register}
                  disabled={false}
                  required
                  type='text'
                  className='flex-1'
                  iconAndInputWrapperClassName='bg-white rounded-none h-13 px-2'
                  inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
                />
                <AddInput
                  id='email'
                  errors={errors}
                  placeholder='Email'
                  register={register}
                  disabled={false}
                  required
                  type='text'
                  className='flex-1'
                  iconAndInputWrapperClassName='bg-white rounded-none h-13 px-2'
                  inputClassName='placeholder:text-placeholder text-sm font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
                />
              </div>

              <AddTextarea
                id='yourMessage'
                errors={errors}
                placeholder='Your Message'
                register={register}
                disabled={false}
                required
                type='text'
                className=''
                iconAndInputWrapperClassName='bg-white rounded-none px-2'
                inputClassName='placeholder:text-placeholder text-sm  h-30 font-medium font-fustat focus:outline-none focus:ring-0 border-0  shadow-none'
              />
              <Button type='submit' className='rounded-none w-2/3 self-center'>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
export default Page;
