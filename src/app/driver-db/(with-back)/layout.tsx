"use client";
import { Button } from "@/components";
import { WhiteForwardIcon } from "@public/svgs";
import { useRouter } from "next/navigation";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  return (
    <div className='px-4 md:px-0 max-w-7xl mx-auto w-full flex-1 pt-8 md:pt-14 flex gap-4 md:gap-12'>
      <Button
        variant={"default"}
        onClick={() => router.back()}
        className='bg-transparent hover:bg-transparent shadow-none border-none cursor-pointer flex items-center gap-3 px-0'
      >
        <div className='bg-primary rounded-full size-10 rotate-180 flex items-center justify-center'>
          <WhiteForwardIcon />
        </div>
        <p className='text-sm text-black'>Back</p>
      </Button>
      <div className='flex-1 h-full flex flex-col gap-2 pt-44 lg:pt-20'>
        {children}
      </div>
    </div>
  );
};
export default Layout;
