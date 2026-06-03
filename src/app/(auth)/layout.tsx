"use client";

import { AuthNavbar } from "@/components";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-screen min-h-screen flex flex-col bg-white">
      <AuthNavbar />
      <div className="flex-1 flex flex-col pt-20 md:pt-24 pb-12">
        {children}
      </div>
    </section>
  );
};

export default Layout;
