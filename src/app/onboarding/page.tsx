import { LogoIcon } from "@public/svgs";

const Page = () => {
  return (
    <section className='w-screen h-screen overflow-hidden bg-white'>
      <div className='px-32 pt-5'>
        <LogoIcon />
      </div>
      <div className='flex justify-center items-center h-full'>
        <div className='flex flex-col gap-6 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black text-4xl'>
          <p className='font-semibold text-2xl text-center'>
            Let’s get you onboard
          </p>
          <input
            className='bg-white h-16 rounded-2xl text-center text-lg focus:outline-none focus:ring-0'
            placeholder='Enter phone number, email'
          />
          <button className='bg-primary rounded-2xl h-16 items-center w-full text-white text-lg hover:bg-teal-700 hover:cursor-pointer transition-colors duration-500'>
            Continue
          </button>
          <div className='flex flex-col gap-9 mt-5'>
            <p className='text-xs font-semibold text-center'>or sign in with</p>
            <p className='text-gray text-xs font-light text-center'>
              By continuing, you agree that Along and its affiliates may contact
              you at the number you provide via calls, WhatsApp, or SMS/RCS
              messages, which may sometimes be sent automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Page;
