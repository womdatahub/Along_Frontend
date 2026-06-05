"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { LoadingComponent } from "@/components";
import { useShallow } from "zustand/shallow";
import { AUTH_ONLY_ROUTES, PUBLIC_ROUTES, ROLE_DASHBOARD_MAP } from "@/lib";
import type { DriverProfile, RiderProfile } from "@/types";
const getDriverOnboardingRedirect = (
  driverProfile:
    | {
        firstName?: string;
        driverProfilePictureUri?: string;
        isVehicleAdded?: boolean;
      }
    | undefined,
): string | null => {
  if (!driverProfile?.firstName) return "/onboarding/driver-info";
  if (!driverProfile?.driverProfilePictureUri) return "/onboarding/documents";
  if (!driverProfile?.isVehicleAdded) return "/onboarding/vehicle-info";
  return null;
};

/** Checks if the given path matches a route or any of its sub-routes */
const matchesRoute = (pathname: string, routes: readonly string[]): boolean =>
  routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const hasFetchedRef = useRef(false);

  const {
    userRole,
    isFetchingUserSessionLoading,
    currentUser,
    actions: {
      fetchUserDetails,
      setRouteBeforeRedirect,
      setIsFetchingUserSessionLoading,
    },
  } = useSession(
    useShallow((state) => ({
      userRole: state.userRole,
      isFetchingUserSessionLoading: state.isFetchingUserSessionLoading,
      currentUser: state.currentUser,
      actions: state.actions,
    })),
  );

  const driverProfile = currentUser as DriverProfile | undefined;
  const riderProfile = currentUser as RiderProfile | undefined;

  const isPublic = useMemo(
    () => PUBLIC_ROUTES.includes(pathname as (typeof PUBLIC_ROUTES)[number]),
    [pathname],
  );
  const isAuthOnly = useMemo(
    () => matchesRoute(pathname, AUTH_ONLY_ROUTES),
    [pathname],
  );
  const isProtected = !isPublic && !isAuthOnly;

  // Fetch user session once on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchUserDetails(false);
  }, [fetchUserDetails]);

  // Memoized redirect handler to keep the routing effect clean
  const handleRouteGuards = useCallback(() => {
    if (isFetchingUserSessionLoading) return;

    if (!userRole && isProtected) {
      // Persist intended destination in the URL so it survives page refreshes.
      // Zustand state is kept as a belt-and-suspenders fallback for the rare
      // case where the query param is stripped by an intermediate redirect.
      setRouteBeforeRedirect(pathname);
      toast.error("You are not logged in");
      router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (userRole) {
      // Driver onboarding checks
      if (userRole === "driver") {
        const redirect = getDriverOnboardingRedirect(driverProfile);
        if (redirect) {
          router.replace(redirect);
          return;
        }

        // Profile is fully complete — if still on an onboarding page, go to dashboard
        if (pathname.startsWith("/onboarding")) {
          router.replace(ROLE_DASHBOARD_MAP.driver);
          return;
        }
      }

      // Rider onboarding check (only on non-public routes)
      if (userRole === "rider" && !isPublic && !riderProfile?.firstName) {
        router.replace("/onboarding/rider");
        return;
      }

      // Redirect authenticated users away from auth-only routes to their dashboard
      if (isAuthOnly) {
        const dashboard = ROLE_DASHBOARD_MAP[userRole];
        if (dashboard) {
          router.replace(dashboard);
          return;
        }
      }
    }

    // "user" role = hasn't picked driver/rider yet → send back to onboarding
    if (userRole === "user" && isProtected) {
      toast.error(
        "Onboarding process incomplete. Please complete your onboarding process to continue!",
      );
      setIsFetchingUserSessionLoading(false);
      router.replace("/onboarding/account");
    }
  }, [
    isFetchingUserSessionLoading,
    userRole,
    isProtected,
    isPublic,
    isAuthOnly,
    pathname,
    driverProfile,
    riderProfile,
    router,
    setRouteBeforeRedirect,
    setIsFetchingUserSessionLoading,
  ]);

  useEffect(() => {
    handleRouteGuards();
  }, [handleRouteGuards]);

  // Show loader while session is being resolved on non-public routes
  if (isFetchingUserSessionLoading && !isPublic) return <LoadingComponent />;

  // Show loader while unauthenticated user is being redirected from a protected route
  if (!userRole && isProtected) return <LoadingComponent />;

  // Show loader while an authenticated user is being redirected away from auth-only pages
  if (userRole && isAuthOnly && userRole !== "user")
    return <LoadingComponent />;

  return <>{children}</>;
};
