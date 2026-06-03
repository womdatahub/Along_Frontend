"use client";

import { SidebarMenu, SidebarMenuButton, useSidebar } from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import {
  LayoutDashboard,
  Car,
  Users,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  UserCog,
  Settings,
  User,
  BadgeCheck,
  FileCheck,
  Truck,
  Activity,
  CreditCard,
  Scale,
  BarChart3,
  ScrollText,
  Radio,
} from "lucide-react";
import { useSession } from "@/store";
import type { AdminProfile } from "@/types";
import { useShallow } from "zustand/shallow";
// Menu structure

type MenuItem = {
  icon: React.ElementType;
  text: string;
  path: string;
};

type MenuGroup = {
  label: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    label: "Overview",
    items: [
      { icon: LayoutDashboard, text: "Dashboard", path: "/admin" },
      { icon: BarChart3, text: "Analytics", path: "/admin/analytics" },
    ],
  },
  {
    label: "User Management",
    items: [
      {
        icon: Car,
        text: "Drivers & Fleets",
        path: "/admin/drivers-and-fleets",
      },
      { icon: Users, text: "Riders", path: "/admin/riders" },
      { icon: UserCog, text: "Admins", path: "/admin/admins" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { icon: BadgeCheck, text: "KYC Management", path: "/admin/kyc" },
      { icon: FileCheck, text: "License Approvals", path: "/admin/licenses" },
      { icon: Truck, text: "Vehicle Approvals", path: "/admin/vehicles" },
      {
        icon: ShieldCheck,
        text: "Roles & Permissions",
        path: "/admin/roles-and-permission",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Radio, text: "Active Trips", path: "/admin/active-trip" },
      { icon: Activity, text: "Active Rentals", path: "/admin/rentals" },
      { icon: AlertTriangle, text: "SOS Console", path: "/admin/sos" },
    ],
  },
  {
    label: "Financial",
    items: [
      { icon: ShoppingBag, text: "Marketplace", path: "/admin/market-place" },
      { icon: CreditCard, text: "Payments", path: "/admin/payments" },
      { icon: Scale, text: "Disputes", path: "/admin/disputes" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: ScrollText, text: "Audit Logs", path: "/admin/audit-logs" },
    ],
  },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { icon: User, text: "Profile", path: "/admin/profile" },
  { icon: Settings, text: "Settings", path: "/admin/settings" },
];
// Component

export const NavMain = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { currentUser } = useSession(
    useShallow((s) => ({ currentUser: s.currentUser })),
  );
  const adminProfile = currentUser as AdminProfile | undefined;

  const isSuperAdmin = adminProfile?.role === "admin";
  // Future: filter groups/items by role
  const visibleGroups = isSuperAdmin ? MENU_GROUPS : MENU_GROUPS;

  return (
    <div className={cn("flex flex-col h-full", isCollapsed ? "px-2" : "px-3")}>
      <div className="flex-1 mt-4 flex flex-col gap-1 overflow-y-auto scrollbar-none">
        {visibleGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {/* Group label — hidden when collapsed */}
            {!isCollapsed && (
              <p className="text-[10px] font-semibold text-white/35 uppercase tracking-widest px-3 py-2 select-none">
                {group.label}
              </p>
            )}
            <SidebarMenu className="gap-0.5">
              {group.items.map((item) => (
                <SMenuButton
                  key={item.path}
                  item={item}
                  isCollapsed={isCollapsed}
                />
              ))}
            </SidebarMenu>
          </div>
        ))}
      </div>

      {/* Bottom fixed items */}
      <SidebarMenu className="mt-auto mb-4 border-t border-white/10 pt-4 gap-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <SMenuButton key={item.path} item={item} isCollapsed={isCollapsed} />
        ))}
      </SidebarMenu>
    </div>
  );
};

//
// Single menu button
//

type SMenuButtonProps = {
  item: MenuItem;
  isCollapsed: boolean;
};

const SMenuButton = ({ item, isCollapsed }: SMenuButtonProps) => {
  const pathname = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  const isActive = (() => {
    if (item.path === "/admin") return pathname === "/admin";
    return pathname === item.path || pathname.startsWith(item.path + "/");
  })();

  return (
    <SidebarMenuButton
      className={cn(
        "group hover:bg-white/10 text-white/70 hover:text-white h-10 rounded-xl px-3 transition-all duration-150",
        isActive && "bg-white/15 text-white",
        isCollapsed && "justify-center",
      )}
      onClick={() => {
        if (isMobile) setOpenMobile(false);
      }}
      asChild
    >
      <Link href={item.path} title={isCollapsed ? item.text : undefined}>
        <item.icon
          size={17}
          className={cn(
            "shrink-0 transition-colors",
            isActive ? "text-white" : "text-white/60 group-hover:text-white",
          )}
        />
        {!isCollapsed && (
          <span className="text-[13.5px] font-medium">{item.text}</span>
        )}
      </Link>
    </SidebarMenuButton>
  );
};
