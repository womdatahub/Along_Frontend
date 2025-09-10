"use client";
import { LogoComponent } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='w-screen h-screen overflow-hidden bg-white'>
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
