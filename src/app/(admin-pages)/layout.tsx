import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

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
          <div className="flex items-center gap-10"></div>
        </div>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
