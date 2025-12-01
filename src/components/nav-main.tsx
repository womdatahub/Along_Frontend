"use client";

import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { AdminDashboardIcon } from "@public/svgs";

export const menuItems = [
  {
    icon: <AdminDashboardIcon isActive={false} />,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <AdminDashboardIcon isActive />,
    text: "User Management",
    path: "/dashboard/user-management",
  },
  // {
  //   text: "Case Management",
  //   path: "/dashboard/case-management",
  // },
  // {
  //   text: "Veterinary Directory",
  //   path: "/dashboard/veterinary-directory",
  // },
  // { text: "Report", path: "/dashboard/report" },
  // {
  //   text: "Agro Businesses",
  //   path: "/dashboard/agro-businesses",
  // },
  // {
  //   text: "Account Approvals",
  //   path: "/dashboard/account-approvals",
  // },
  // { text: "Community", path: "/dashboard/community" },
  // {
  //   text: "Audit Logs",
  //   path: "/dashboard/audit-logs",
  // },
  // {
  //   text: "Feedback & Reviews",
  //   path: "/dashboard/feedback-and-reviews",
  // },
];

export const NavMain = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu className="mt-6 px-4">
      {menuItems.map((item, index) => {
        const isActive = (() => {
          if (item.path === "/dashboard") {
            return pathname === "/dashboard";
          }
          return pathname === item.path || pathname.startsWith(item.path + "/");
        })();
        return (
          <SidebarMenuButton
            key={index}
            className={cn(
              "hover:bg-white text-white hover:text-primary h-12 rounded-full px-8",
              isActive && "bg-white text-primary"
            )}
            asChild
          >
            <Link href={item.path}>
              {item.icon}
              <span className="text-[15px]">{item.text}</span>
            </Link>
          </SidebarMenuButton>
        );
      })}
    </SidebarMenu>
  );
};
