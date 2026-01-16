"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AdminNotificationIcon,
  //  AdminSearchIcon
} from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/store";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { actions: { logOut } } = useSession((state) => state);

  function showMenu() {
    const menu = document.getElementById("admin-profile-menu");
    menu?.classList.toggle("hidden");
  }

  async function logoutUser() {
    await logOut();
    console.log("User logged out");
    window.location.href = "/sign-in";
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-[#e1e3e3] flex flex-col gap-10 p-16'>
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
                onClick={() => showMenu()}
              />
              <p className='text-base font-medium'>David Junior</p>
            </div>
            <div id='admin-profile-menu' className='hidden absolute top-16 right-16 bg-white shadow-md rounded-md'>
              <div className='flex flex-col p-4 gap-3'>
                <p className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer'>
                  <Link href="/admin/profile">Profile</Link>
                </p>
                <p className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer'>
                  <Link href="/admin/settings">Settings</Link>
                </p>
                <p className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer' onClick={() => logoutUser()}>
                  Logout
                </p>
              </div>
            </div>
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
