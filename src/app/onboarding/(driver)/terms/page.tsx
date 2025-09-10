"use client";

const Page = () => {
  return (
    <div className='flex flex-col gap-10 rounded-[20px] w-[500px] px-8 py-10 bg-[#EFF1F1] text-black'>
      <p className='font-semibold text-2xl text-center'>Register a User</p>
      <div className='flex flex-col gap-4'>
        <p className='text-center text-sm'>
          Please select an option to register:
        </p>
        <div className='flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500'>
          <p>icon</p>
          <p className='font-semibold text-base'>Rider</p>
        </div>
        <div className='flex gap-4 px-4 py-7 bg-white rounded-lg cursor-pointer hover:bg-icons transition-colors duration-500'>
          <p>icon</p>
          <p className='font-semibold text-base'>Driver</p>
        </div>
      </div>
    </div>
  );
};
export default Page;
