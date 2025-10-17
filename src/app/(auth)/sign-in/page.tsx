"use client";
import { AddInput, ButtonWithLoader } from "@/components";
import { signInSchema, TSignInValidator } from "@/lib";
import { DarkFacebookIcon, DarkGoogleIcon, DarkIosIcon } from "@public/svgs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "@/store";

const Page = () => {
  const router = useRouter();
  const {
    isLoading,
    actions: { login },
  } = useSession((state) => state);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSignInValidator>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: TSignInValidator) => {
    console.log(values, errors);
    await login(values).then((val) => {
      if (val === false) return;
      console.log("val from login", val);
      router.push("/rider-db");
    });
  };

  return (
    // px-4 md:px-0
    <div className='flex justify-center items-center h-full'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-6 rounded-[20px] w-[500px] px-4 md:px-8 py-10 bg-background-1 text-black text-4xl'
      >
        <p className='font-semibold text-2xl text-center'>
          Sign in to your account
        </p>
        <AddInput
          id='email'
          errors={errors}
          placeholder='Enter phone number, email'
          register={register}
          disabled={false}
          required
          type='text'
          // className='gap-2 w-full'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='text-center text-lg font-fustat focus:outline-none focus:ring-0 border-0'
        />
        <AddInput
          id='password'
          errors={errors}
          placeholder='Password'
          register={register}
          disabled={false}
          required
          type='password'
          iconAndInputWrapperClassName='bg-white rounded-2xl h-16'
          inputClassName='text-center text-lg font-fustat focus:outline-none focus:ring-0 border-0'
        />

        <ButtonWithLoader
          isLoading={isLoading}
          text='Continue'
          type='submit'
          variant='default'
          className='bg-primary rounded-2xl h-16 items-center w-full text-white text-lg hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'
        />

        <div className='flex flex-col gap-9 mt-5'>
          <p className='text-xs font-semibold text-center'>or continue with</p>
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
