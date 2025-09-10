"use client";
import { AuthNavbar } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='w-screen h-screen'>
      <AuthNavbar />
      <div className='flex flex-col gap-2 justify-center items-center h-full pt-44 lg:pt-32 pb-16 overflow-y-scroll'>
        {children}
      </div>
    </section>
  );
};
export default Layout;
