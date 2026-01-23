"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { LoadingComponent } from "@/components";

const Context = createContext({});
const { Provider } = Context;

// Public = accessible to everyone (even when logged in)
const publicRoutes = [
  "/",
  "/about",
  "/onboarding",
  "/onboarding/services",
  "/onboarding/documents",
];

// Auth-only = should NOT be accessible once logged in
const authOnlyRoutes = [
  "/sign-in",
  "/onboarding/otp",
  "/onboarding/rider",
  "/onboarding/user-type",
  "/onboarding/terms",
  // "/onboarding/services",
  "/onboarding/driver-info",
  "/onboarding/vehicle-info",
  // "/onboarding/documents",
  // "/rider-db",
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const hasFetchedRef = useRef(false);

  const {
    userRole,
    isFetchingUserSessionLoading,
    driverProfile,
    actions: {
      fetchUserDetails,
      setRouteBeforeRedirect,
      setIsFetchingUserSessionLoading,
    },
  } = useSession((state) => state);

  const isPublic = useMemo(() => publicRoutes.includes(pathname), [pathname]);

  const isAuthOnly = useMemo(
    () =>
      authOnlyRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
      ),
    [pathname],
  );

  const isProtected = !isPublic && !isAuthOnly;

  useEffect(() => {
    // if (isPublic) return;
    // if (userRole) return;
    // if (isAuthOnly) return;

    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;
    fetchUserDetails(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFetchingUserSessionLoading) return;

    // 🚫 Logged out → protected route
    if (!userRole && isProtected) {
      setRouteBeforeRedirect(pathname);
      // setIsFetchingUserSessionLoading(false);
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
        if (!driverProfile?.driverProfilePictureUri) {
          router.replace("/onboarding/services");
          return;
        }
        router.replace("/driver-db");
        return;
      }
      if (userRole === "admin") {
        router.replace("/admin");
        return;
      }
    }

    // 🚫 Incomplete onboarding
    if (userRole === "user" && isProtected) {
      // console.log("onboarding process incomplete");
      toast.error(
        "Onboarding process incomplete. Please complete your onboarding process to continue!!",
      );
      setIsFetchingUserSessionLoading(false);
      router.replace("/onboarding/user-type");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingUserSessionLoading, userRole, pathname]);

  if (isFetchingUserSessionLoading && !isPublic) {
    return <LoadingComponent />;
  }

  if (!userRole && isProtected) {
    return <LoadingComponent />;
  }

  if (userRole && isAuthOnly && userRole !== "user") {
    return <LoadingComponent />;
  }

  return <Provider value={{}}>{children}</Provider>;
};
