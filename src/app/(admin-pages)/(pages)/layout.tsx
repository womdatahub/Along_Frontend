"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AdminNotificationIcon,
  //  AdminSearchIcon
} from "@public/svgs";
// import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import {
  NameAvatar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const {
    adminProfile,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      adminProfile: state.adminProfile,
    })),
  );

  // function showMenu() {
  //   const menu = document.getElementById("admin-profile-menu");
  //   menu?.classList.toggle("hidden");
  // }

  async function logoutUser() {
    await logOut();
    // window.location.href = "/sign-in";
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='bg-[#e1e3e3] flex flex-col gap-10 p-16'>
        <div className='flex justify-between items-center gap-5'>
          <p className='text-xl font-medium text-primary'>
            {pathname === "/admin" && `Hello, ${adminProfile?.firstName}`}
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
            <Popover>
              <PopoverTrigger asChild>
                <div className='flex items-center gap-2 cursor-pointer'>
                  <NameAvatar
                    value={`${adminProfile?.firstName[0] ?? ""}${adminProfile?.lastName[0] ?? ""}`}
                    className='size-8 text-sm'
                  />
                  <p className='text-base font-medium'>
                    {adminProfile?.firstName} {adminProfile?.lastName}
                  </p>
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-[200px] p-0'>
                <div className='shadow-md rounded-md'>
                  <div className='flex flex-col p-4 gap-3'>
                    <p className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer'>
                      <Link href='/admin/profile'>Profile</Link>
                    </p>
                    <p className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer'>
                      <Link href='/admin/settings'>Settings</Link>
                    </p>
                    <p
                      className='hover:bg-gray-100 px-3 py-2 rounded-md cursor-pointer'
                      onClick={() => logoutUser()}
                    >
                      Logout
                    </p>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
