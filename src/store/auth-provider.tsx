"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useMemo, useRef } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { LoadingComponent } from "@/components";
import { useShallow } from "zustand/shallow";

const Context = createContext({});
const { Provider } = Context;

// Public = accessible to everyone (even when logged in)
const publicRoutes = [
  "/",
  "/about",
  "/onboarding",
  "/onboarding/driver-info",
  "/onboarding/services",
  "/onboarding/documents",
  "/onboarding/vehicle-info",
];

// Auth-only = should NOT be accessible once logged in
const authOnlyRoutes = [
  "/sign-in",
  "/onboarding/otp",
  "/onboarding/rider",
  "/onboarding/user-type",
  "/onboarding/terms",
  // "/onboarding/services",
  // "/onboarding/driver-info",
  // "/onboarding/vehicle-info",
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
    riderProfile,
    services,
    actions: {
      fetchUserDetails,
      setRouteBeforeRedirect,
      setIsFetchingUserSessionLoading,
    },
  } = useSession(
    useShallow((state) => ({
      userRole: state.userRole,
      isFetchingUserSessionLoading: state.isFetchingUserSessionLoading,
      driverProfile: state.driverProfile,
      riderProfile: state.riderProfile,
      services: state.services,
      actions: state.actions,
    })),
  );

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

    if (userRole) {
      if (userRole === "driver") {
        if (!driverProfile?.firstName) {
          // toast.error("Your profile is incomplete!");
          router.replace("/onboarding/driver-info");
          return;
        }
        if (!driverProfile?.driverProfilePictureUri) {
          // toast.error("Your driver profile is incomplete!");
          if (services.length === 0)
            return router.replace("/onboarding/services");
          router.replace("/onboarding/documents");
          return;
        }
        if (!driverProfile?.vehicleFrontViewImageUri) {
          // console.log("driverProfile?.vehicleFrontViewImageUri");
          router.replace("/onboarding/vehicle-info");
          return;
        }
        // if (!driverProfile?.insuranceDocumentUri) {
        //   console.log("driverProfile?.insuranceDocumentUri");
        //   router.replace("/onboarding/vehicle-insurance");
        //   return;
        // }
      }
      if (userRole === "rider" && !isPublic) {
        if (!riderProfile?.firstName) {
          // toast.error("Your profile is incomplete!");
          router.replace("/onboarding/driver-info");
          return; // just testing this out for now
        }
      }
      if (isAuthOnly) {
        if (userRole === "driver") {
          router.replace("/driver-db");
          return;
        }
        if (userRole === "rider") {
          router.replace("/rider-db");
          return;
        }
        if (userRole === "admin") {
          router.replace("/admin");
          return;
        }
      }
    }

    // 🚫 Incomplete onboarding
    if (userRole === "user" && isProtected) {
      toast.error(
        "Onboarding process incomplete. Please complete your onboarding process to continue!!",
      );
      setIsFetchingUserSessionLoading(false);
      router.replace("/onboarding/user-type");
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isFetchingUserSessionLoading,
    userRole,
    pathname,
    riderProfile,
    driverProfile,
  ]);

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
