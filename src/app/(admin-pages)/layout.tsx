import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminNotificationIcon, AdminSearchIcon } from "@public/svgs";
import Image from "next/image";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F7F7F7] flex flex-col gap-10 p-16">
        <div className="flex justify-between items-center gap-5">
          <p className="text-xl font-medium text-primary">Hello, David</p>
          <div className="flex items-center gap-5">
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
            <AdminNotificationIcon />
            <div className="flex items-center gap-2">
              <Image
                src="/images/about-vision.png"
                alt="Profile image"
                className="rounded-full size-8 object-cover"
                width={32}
                height={32}
              />
              <p className="text-base font-medium">David Junior</p>
            </div>
          </div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
