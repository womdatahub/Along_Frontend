"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AdminNotificationIcon,
  //  AdminSearchIcon
} from "@public/svgs";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-[#EFF1F1] flex flex-col gap-10 p-16'>
        <div className='flex justify-between items-center gap-5'>
          <p className='text-xl font-medium text-primary'>
            {pathname === "/admin" && "Hello, David"}
          </p>
          <div className='flex items-center gap-5'>
            {/* {pathname === "/admin" && (
              <div className="shadow-md flex bg-white gap-3 items-center px-3 py-2 rounded-full min-w-[325px]">
                <AdminSearchIcon />
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="bg-transparent focus:outline-none flex-1"
                  placeholder="Search"
                />
              </div>
            )} */}
            <AdminNotificationIcon />
            <div className='flex items-center gap-2'>
              <Image
                src='/images/about-vision.png'
                alt='Profile image'
                className='rounded-full size-8 object-cover'
                width={32}
                height={32}
              />
              <p className='text-base font-medium'>David Junior</p>
            </div>
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
