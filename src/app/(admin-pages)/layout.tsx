import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DarkOrLightModeIcon,
  GlobalIcon,
  HelpCenterIcon,
  NotificationIcon,
  SearchIcon,
} from "@/public/svg";
import Image from "next/image";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#F7F7F7]">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center flex-1 gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex gap-4 items-center justify-between flex-1">
              <div className="flex min-w-1/2 items-center gap-2 p-3 rounded-full bg-white">
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 outline-0"
                />
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex gap-1 items-center">
                  <HelpCenterIcon />
                  <p className="text-sm text-red-500 font-normal mr-6">
                    Help Center
                  </p>
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-6"
                  />
                  <div className="flex gap-3 items-center">
                    <NotificationIcon />
                    <DarkOrLightModeIcon />
                    <GlobalIcon />
                    <div className="flex gap-3 items-center">
                      <Image
                        src="/images/1.jpg"
                        alt="User Avatar"
                        width={32}
                        height={32}
                        className="rounded-full size-8 object-cover"
                      />
                      <p>Rosie</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
