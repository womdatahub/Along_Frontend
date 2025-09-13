"use client";

import { LogoComponent } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";
import { toast } from "sonner";

const Context = createContext({});
const { Provider } = Context;

const unprotectedRoutes = [
  "/",
  "/sign-in",
  "/onboarding",
  "/onboarding/otp",
  "/onboarding/rider",
  "/onboarding/user-type",
  "/onboarding/driver/terms",
  "/onboarding/driver/services",
  "/onboarding/driver/driver-info",
  "/onboarding/driver/vehicle-info",
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = "";
  const loading = false;
  const pathName = usePathname();
  const router = useRouter();

  // call getSession on mount once
  useEffect(() => {
    // getSession();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (unprotectedRoutes.includes(pathName) && user) {
      router.push("/");
      return;
    }

    if (
      !user &&
      !unprotectedRoutes.includes(pathName) &&
      pathName !== "/sign-in"
    ) {
      toast.error("You are not logged in");
      router.push("/sign-in");
      return;
    }
  }, [loading, user, pathName, router]);

  if (loading)
    return (
      <div className='flex items-center justify-center w-screen h-screen'>
        <div className='flex flex-col items-center space-y-3'>
          <LogoComponent withoutLink />
          <p className='text-sm animate-pulse'>Loading Account...</p>
        </div>
      </div>
    );

  return <Provider value={{}}>{children}</Provider>;
};
