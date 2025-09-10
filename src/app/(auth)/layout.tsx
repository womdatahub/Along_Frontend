"use client";
import { AuthNavbar } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='w-screen h-screen overflow-y-'>
      <AuthNavbar />
      <div className='flex flex-col gap-2 justify-center items-center h-full mt-'>
        {children}
      </div>
    </section>
  );
};
export default Layout;
