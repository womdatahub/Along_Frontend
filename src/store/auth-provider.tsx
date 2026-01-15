"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { useShallow } from "zustand/shallow";
import { LoadingComponent } from "@/components";

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
  "/onboarding/terms",
  "/onboarding/services",
  "/onboarding/driver-info",
  "/onboarding/vehicle-info",
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathName = usePathname();
  const router = useRouter();

  const {
    user,
    isFetchingUserSessionLoading,
    actions: { fetchUserDetails, setRouteBeforeRedirect },
  } = useSession((state) => state);

  console.log(user, "user");

  // call getSession on mount once
  useEffect(() => {
    if (unprotectedRoutes.includes(pathName)) return;
    fetchUserDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetchingUserSessionLoading) return;

    if (unprotectedRoutes.includes(pathName) && user) {
      router.push("/");
      return;
    }

    if (
      !user &&
      !unprotectedRoutes.includes(pathName) &&
      pathName !== "/sign-in"
    ) {
      console.log("entered here oo", user, pathName);
      toast.error("You are not logged in");
      setRouteBeforeRedirect(pathName);
      router.push("/sign-in");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUserSessionLoading, user, pathName, router]);

  if (isFetchingUserSessionLoading) return <LoadingComponent />;

  // if (!user) {
  //   toast.error("You are not logged in");
  //   setRouteBeforeRedirect(pathName);
  //   router.push("/sign-in");
  //   return null;
  // }

  return <Provider value={{}}>{children}</Provider>;
};
