"use client";

import * as React from "react";
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { AdminLogoIcon } from "@public/svgs";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-[#768B8F] pt-9 px-12">
        <AdminLogoIcon />
      </SidebarHeader>
      <SidebarContent className="bg-[#768B8F]">
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
};
