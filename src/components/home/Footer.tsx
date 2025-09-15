import { Button, LogoComponent } from "@/components";
import { WhiteForwardIcon } from "@public/svgs";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className='bg-teal-700 text-white py-10 px-6'>
      <div className='max-w-7xl mx-auto grid md:grid-cols-3 gap-8'>
        <div className='flex flex-col gap-11'>
          <LogoComponent type2 />
          <div className='flex gap-4'>
            <Button className='border-white border-2 flex items-center gap-8 justify-between bg-transparent hover:bg-transparent font-semibold text-lg h-12 rounded-full'>
              <div className='flex gap-4 items-center'>
                <Image
                  src={"/images/android.png"}
                  alt='app-download'
                  width={28}
                  height={32}
                />
                {/* <AndroidWhiteIcon width={60} height={60} viewBox='0 0 60 60' /> */}
                Android
              </div>
              <WhiteForwardIcon />
            </Button>
            <Button className='border-white border-2 flex items-center gap-8 justify-between bg-transparent hover:bg-transparent font-semibold text-lg h-12 rounded-full'>
              <div className='flex gap-4 items-center'>
                <Image
                  src={"/images/ios.png"}
                  alt='app-download'
                  width={28}
                  height={32}
                />
                {/* <IOSWhiteIcon width={60} height={60} viewBox='0 0 60 60' /> */}
                Apple
              </div>
              <WhiteForwardIcon />
            </Button>
          </div>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>Quick Links</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Ride</a>
            </li>
            <li>
              <a href='#'>Drive</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold mb-3'>Get in Touch</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#'>About</a>
            </li>
            <li>
              <a href='#'>Ride</a>
            </li>
            <li>
              <a href='#'>Drive</a>
            </li>
          </ul>
        </div>
      </div>
      <div className='text-center text-sm mt-8 opacity-75'>
        ©2025 Along Inc. All Rights Reserved | <a href='#'>Privacy Policy</a> |{" "}
        <a href='#'>Terms</a>
      </div>
    </footer>
  );
};
