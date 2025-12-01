"use client";

import * as React from "react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";

export const TeamSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex justify-between items-center gap-4">
          <Image
            src="/images/vetwiz-logo.png"
            alt="Team Logo"
            width={65}
            height={65}
          />
          {/* <SidebarTrigger className="-ml-1" /> */}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
