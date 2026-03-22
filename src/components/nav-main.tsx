"use client";

import { SidebarMenu, SidebarMenuButton, useSidebar } from "@/components";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import {
  AdminDashboardIcon,
  AdminRiderssIcon,
  AdminDriversAndFleetsIcon,
  AdminRulesAndPermissionsIcon,
} from "@public/svgs";
import { JSX, SVGProps, useState } from "react";

export const NavMain = () => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  return (
    <SidebarMenu className={cn("mt-6 px-4", isCollapsed && "px-2")}>
      {menuItems.map(({ icon: Icon, path, text }, index) => {
        return <SMenuButton key={index} Icon={Icon} path={path} text={text} />;
      })}
    </SidebarMenu>
  );
};

type SMenuButtonProps = {
  path: string;
  Icon: (props: SVGProps<SVGElement>) => JSX.Element;
  text: string;
};
const SMenuButton = ({ path, Icon, text }: SMenuButtonProps) => {
  const pathname = usePathname();
  let isActive = (() => {
    if (path === "/admin") {
      return pathname === "/admin";
    }
    return pathname === path || pathname.startsWith(path + "/");
  })();
  const [hover, setHover] = useState(false);
  isActive = isActive || hover;

  return (
    <SidebarMenuButton
      className={cn(
        "group hover:bg-white text-white hover:text-primary h-12 rounded-full px-4",
        isActive && "bg-white text-primary",
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      asChild
    >
      <Link href={path}>
        <Icon
          fill={isActive ? "#0E696A" : "white"}
          className='group-hover:fill-[#0E696A]'
        />
        <span className='text-[15px]'>{text}</span>
      </Link>
    </SidebarMenuButton>
  );
};

const menuItems = [
  {
    icon: AdminDashboardIcon,
    text: "Dashboard",
    path: "/admin",
  },
  {
    icon: AdminDriversAndFleetsIcon,
    text: "Drivers & Fleets",
    path: "/admin/drivers-and-fleets",
  },
  {
    icon: AdminRiderssIcon,
    text: "Riders",
    path: "/admin/riders",
  },
  {
    icon: AdminRulesAndPermissionsIcon,
    text: "Roles and permission",
    path: "/admin/roles-and-permission",
  },
  {
    icon: AdminRulesAndPermissionsIcon,
    text: "SOS",
    path: "/admin/sos",
  },
  {
    icon: AdminRulesAndPermissionsIcon,
    text: "Active trip",
    path: "/admin/active-trip",
  },
  {
    icon: AdminRulesAndPermissionsIcon,
    text: "Market Place",
    path: "/admin/market-place",
  },
  {
    icon: AdminRulesAndPermissionsIcon,
    text: "Users",
    path: "/admin/users",
  },
];
