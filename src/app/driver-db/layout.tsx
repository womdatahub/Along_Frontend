"use client";
import { DBNavbar } from "@/components";
import { AuthProvider } from "@/store";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AuthProvider>
      <section className='w-screen min-h-screen flex flex-col bg-background-1'>
        <DBNavbar />
        <div className='flex-1 h-full flex flex-col gap-2 pt-44 lg:pt-20'>
          {children}
        </div>
      </section>
    </AuthProvider>
  );
};
export default Layout;
