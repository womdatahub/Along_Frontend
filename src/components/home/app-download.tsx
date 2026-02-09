"use client";
import { Button, HeadingHeebo } from "@/components";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  // AndroidWhiteIcon, IOSWhiteIcon,
  WhiteForwardIcon,
} from "@public/svgs";
import Image from "next/image";

export const AppDownload = () => {
  const isMobile = useIsMobile();
  return (
    <section className='px-6 py-4 bg-primary text-white font-heebo'>
      <div className='flex items-center gap-10 max-w-6xl mx-auto'>
        <div className='flex flex-col gap-2 md:w-1/2'>
          <HeadingHeebo className='text-left font-extrabold text-2xl md:text-4xl'>
            Get more from the app
          </HeadingHeebo>
          <p className='text-lg font-light'>
            Experience stress-free travel with fast bookings,{" "}
            <br className='hidden md:flex' /> reliable drivers, and comfortable
            rides.
          </p>
          <div
            className='flex
           gap-2 md:gap-4'
          >
            <Button className='border-white border-2 flex items-center gap-2 md:gap-4 justify-between bg-transparent hover:bg-transparent font-semibold text-xl md:text-2xl rounded-xl md:rounded-3xl py-8'>
              <div className='flex gap-2 md:gap-4 items-center'>
                <Image
                  src={"/images/android.png"}
                  alt='app-download'
                  width={isMobile ? 20 : 38}
                  height={isMobile ? 20 : 38}
                  className='w-auto'
                />
                Android
              </div>
              <WhiteForwardIcon />
            </Button>
            <Button className='border-white border-2 flex items-center gap-2 md:gap-4 justify-between bg-transparent hover:bg-transparent font-semibold text-xl md:text-2xl rounded-xl md:rounded-3xl py-8'>
              <div className='flex gap-2 md:gap-4 items-center'>
                <Image
                  src={"/images/ios.png"}
                  alt='app-download'
                  width={isMobile ? 20 : 38}
                  height={isMobile ? 20 : 38}
                  className='w-auto'
                />
                Apple
              </div>
              <WhiteForwardIcon />
            </Button>
          </div>
        </div>

        <Image
          src={"/images/iphone-15.png"}
          alt='app-download'
          width={528}
          height={589}
          className='hidden md:flex'
        />
      </div>
    </section>
  );
};
