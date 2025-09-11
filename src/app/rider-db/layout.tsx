"use client";
import { DBNavbar } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className='w-screen min-h-screen flex flex-col'>
      <DBNavbar />
      <div className='flex-1 h-full flex flex-col gap-2 pt-44 lg:pt-20'>
        {children}
      </div>
    </section>
  );
};
export default Layout;
