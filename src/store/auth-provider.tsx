"use client";

import { LogoComponent } from "@/components";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { useShallow } from "zustand/shallow";

const Context = createContext({});
const { Provider } = Context;

const unprotectedRoutes = [
  "/",
  "/about",
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
  const pathName = usePathname();
  const router = useRouter();

  const {
    user,
    isLoading,
    actions: { fetchUserDetails },
  } = useSession(
    useShallow((state) => ({
      user: state.user,
      isLoading: state.isLoading,
      actions: state.actions,
    }))
  );

  // call getSession on mount once
  useEffect(() => {
    fetchUserDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isLoading) return;

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
  }, [isLoading, user, pathName, router]);

  if (isLoading)
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
