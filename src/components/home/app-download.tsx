import { Button, HeadingHeebo } from "@/components";
import {
  // AndroidWhiteIcon, IOSWhiteIcon,
  WhiteForwardIcon,
} from "@public/svgs";
import Image from "next/image";

export const AppDownload = () => {
  return (
    <section className='px-6 py-4 bg-primary text-white font-heebo'>
      <div className='flex items-center gap-10 max-w-6xl mx-auto'>
        <div className='flex flex-col gap-2 w-1/2'>
          <HeadingHeebo className='text-left font-extrabold text-4xl'>
            Get more from the app
          </HeadingHeebo>
          <p className='text-lg font-light'>
            Experience stress-free travel with fast bookings, <br /> reliable
            drivers, and comfortable rides.
          </p>
          <div className='flex gap-4'>
            <Button className='border-white border-2 flex items-center gap-4 justify-between bg-transparent hover:bg-transparent font-semibold text-2xl h-20 rounded-3xl'>
              <div className='flex gap-4 items-center'>
                <Image
                  src={"/images/android.png"}
                  alt='app-download'
                  width={38}
                  height={44}
                />
                {/* <AndroidWhiteIcon width={60} height={60} viewBox='0 0 60 60' /> */}
                Android
              </div>
              <WhiteForwardIcon />
            </Button>
            <Button className='border-white border-2 flex items-center gap-4 justify-between bg-transparent hover:bg-transparent font-semibold text-2xl h-20 rounded-3xl'>
              <div className='flex gap-4 items-center'>
                <Image
                  src={"/images/ios.png"}
                  alt='app-download'
                  width={38}
                  height={44}
                />
                {/* <IOSWhiteIcon width={60} height={60} viewBox='0 0 60 60' /> */}
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
        />
      </div>
    </section>
  );
};
