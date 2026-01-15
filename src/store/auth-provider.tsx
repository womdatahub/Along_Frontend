"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { LoadingComponent } from "@/components";

const Context = createContext({});
const { Provider } = Context;

// Public = accessible to everyone (even when logged in)
const publicRoutes = ["/", "/about"];

// Auth-only = should NOT be accessible once logged in
const authOnlyRoutes = [
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
  const pathname = usePathname();
  const router = useRouter();

  const {
    userRole,
    isFetchingUserSessionLoading,
    actions: { fetchUserDetails, setRouteBeforeRedirect },
  } = useSession((state) => state);

  const isPublic = useMemo(() => publicRoutes.includes(pathname), [pathname]);

  const isAuthOnly = useMemo(
    () =>
      authOnlyRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      ),
    [pathname]
  );

  const isProtected = !isPublic && !isAuthOnly;

  // Fetch session once (only when needed)
  // useEffect(() => {
  //   console.log("userRole", userRole);
  //   if (isPublic || userRole) return;
  //   fetchUserDetails();

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (isPublic) return;
    if (userRole) return;
    // if (isFetchingUserSessionLoading) return;

    fetchUserDetails();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPublic, userRole]);

  useEffect(() => {
    if (isFetchingUserSessionLoading) return;

    // 🚫 Logged out → protected route
    if (!userRole && isProtected) {
      setRouteBeforeRedirect(pathname);
      toast.error("You are not logged in");
      router.replace("/sign-in");
      return;
    }

    // 🚫 Logged in → auth-only routes
    if (userRole && isAuthOnly) {
      if (userRole === "rider") {
        router.replace("/rider-db");
        return;
      }
      if (userRole === "driver") {
        router.replace("/driver-db");
        return;
      }
    }

    // 🚫 Incomplete onboarding
    if (userRole === "user") {
      toast.error(
        "Onboarding process incomplete. Please complete your onboarding process to continue!!"
      );
      router.replace("/onboarding/user-type");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUserSessionLoading, userRole, pathname]);

  // if (isFetchingUserSessionLoading && !isPublic) {
  //   return <LoadingComponent />;
  // }
  // if (!userRole && isProtected) {
  //   return <LoadingComponent />;
  // }
  // if (userRole && isAuthOnly) {
  //   return <LoadingComponent />;
  // }

  if (isFetchingUserSessionLoading && !isPublic) {
    return <LoadingComponent />;
  }

  if (!userRole && isProtected) {
    return <LoadingComponent />;
  }

  if (userRole && isAuthOnly) {
    return <LoadingComponent />;
  }

  return <Provider value={{}}>{children}</Provider>;
};
