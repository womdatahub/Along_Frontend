"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
  NavMain,
} from "@/components";
import { AdminLogoIcon } from "@public/svgs";
import Link from "next/link";
import { cn } from "@/lib";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader
        className={cn(
          "bg-[#768B8F] pt-9 px-12",
          isCollapsed && "w-full flex justify-center items-center px-0",
        )}
      >
        <Link href='/'>
          {isCollapsed ? (
            <p className='text-lg text-white font-bold'>AL</p>
          ) : (
            <AdminLogoIcon />
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className='bg-[#768B8F]'>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
};
