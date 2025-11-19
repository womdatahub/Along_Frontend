"use client";
import { AuthNavbar } from "@/components";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <section className="w-screen min-h-screen flex flex-col">
      <AuthNavbar />
      <div className="flex-1 flex flex-col gap-2 justify-center items-center pt-44 lg:pt-32 pb-16">
        {children}
      </div>
    </section>
  );
};
export default Layout;
