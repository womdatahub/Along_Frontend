import { Button, LogoComponent } from "@/components";
import {
  WhiteFacebookIcon,
  WhiteForwardIcon,
  WhiteInstagramIcon,
  WhiteLinkedInIcon,
  WhiteXIcon,
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="flex flex-col">
      <div className="bg-teal-700 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex flex-col gap-11">
            <LogoComponent type2 />
            <div className="flex gap-4">
              <Button className="border-white border-2 flex items-center gap-8 justify-between bg-transparent hover:bg-transparent font-semibold text-lg h-12 rounded-full">
                <div className="flex gap-4 items-center">
                  <Image
                    src={"/images/android.png"}
                    alt="app-download"
                    width={28}
                    height={32}
                  />
                  {/* <AndroidWhiteIcon width={60} height={60} viewBox='0 0 60 60' /> */}
                  Android
                </div>
                <WhiteForwardIcon />
              </Button>
              <Button className="border-white border-2 flex items-center gap-8 justify-between bg-transparent hover:bg-transparent font-semibold text-lg h-12 rounded-full">
                <div className="flex gap-4 items-center">
                  <Image
                    src={"/images/ios.png"}
                    alt="app-download"
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

          <div className="flex flex-col gap-8">
            <div className="flex gap-20">
              <Link href="#" className="font-heebo text-sm font-semibold">
                About
              </Link>
              <Link href="#" className="font-heebo text-sm font-semibold">
                Ride
              </Link>
              <Link href="#" className="font-heebo text-sm font-semibold">
                Drive
              </Link>
              <Link href="#" className="font-heebo text-sm font-semibold">
                Support
              </Link>
            </div>
            <div className="self-end flex items-center gap-10">
              <Link href="https://www.x.com" target="_blank">
                <WhiteXIcon />
              </Link>
              <Link href="https://www.instagram.com" target="_blank">
                <WhiteInstagramIcon />
              </Link>
              <Link href="https://www.facebook.com" target="_blank">
                <WhiteFacebookIcon />
              </Link>
              <Link href="https://www.linkedin.com" target="_blank">
                <WhiteLinkedInIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white text-black px-6 py-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-4 items-center font-heebo text-xs">
          <p>©2025 Along Inc. All Rights Reserved</p>
          <div className="flex items-center gap-8">
            <p>Privacy & Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
