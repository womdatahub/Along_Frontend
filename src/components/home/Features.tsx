import Image from "next/image";

// import { FastHeroIcon } from "@public/svgs";
export const Features = () => {
  return (
    <section className='pt-36 pb-16 px-6 text-center bg-white'>
      <div className='flex gap-20 max-w-5xl mx-auto items-center justify-between'>
        <div className='flex flex-col gap-4 text-left w-full md:w-1/2'>
          <h2 className='text-4xl font-extrabold text-black'>Fast</h2>
          <p className='text-black font-light text-xl'>
            Instant booking, rapid confirmations, and on-the-dot pickups keep
            you moving without delay.
          </p>
        </div>
        <Image src={"/images/young-man.png"} alt='' width={237} height={337} />
        {/* <FastHeroIcon /> */}
      </div>
    </section>
  );
};
