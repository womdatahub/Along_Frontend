"use client";

import { useEffect } from "react";
import { Navbar } from "@/components";
import { ROLE_DASHBOARD_MAP } from "@/lib";
import { useSession } from "@/store";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userRole } = useSession(
    useShallow((state) => ({ userRole: state.userRole })),
  );
  const router = useRouter();

  useEffect(() => {
    if (!userRole) {
      router.push("/");
    } else if (userRole === "driver" || userRole === "admin") {
      router.push(ROLE_DASHBOARD_MAP[userRole]);
    }
  }, [userRole, router]);

  if (!userRole || userRole === "driver" || userRole === "admin") {
    return null;
  }

  return (
    <section className="w-screen min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 pt-18">{children}</div>
    </section>
  );
};

export default Layout;
