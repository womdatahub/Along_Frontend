"use client";
import { LogoComponent } from "@/components";
import { LogoIcon } from "@public/svgs";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='w-screen h-screen overflow-x-hidden overflow-y-scroll bg-white'>
      <div className='px-32 pt-5'>
        <LogoComponent />
      </div>
      <div className='flex flex-col gap-2 justify-center items-center h-full'>
        {children}
      </div>
    </section>
  );
};
export default Layout;
