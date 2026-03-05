"use client";

import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useSession } from "./use-session";
import { LoadingComponent } from "@/components";
import { useShallow } from "zustand/shallow";

// Routes accessible to everyone (logged-in or not)
const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/onboarding",
  "/onboarding/driver-info",
  "/onboarding/services",
  "/onboarding/documents",
  "/onboarding/vehicle-info",
] as const;

// Routes that authenticated users should be redirected away from
const AUTH_ONLY_ROUTES = [
  "/sign-in",
  "/onboarding/otp",
  "/onboarding/rider",
  "/onboarding/user-type",
  "/onboarding/terms",
] as const;

// Dashboard landing pages per role
const ROLE_DASHBOARD_MAP: Record<string, string> = {
  driver: "/driver-db",
  rider: "/rider-db",
  admin: "/admin",
};

/**
 * Determines the onboarding redirect for a driver based on profile completeness.
 * Returns a path string if the driver needs to complete a step, or null if fully onboarded.
 */
const getDriverOnboardingRedirect = (
  driverProfile: { firstName?: string; driverProfilePictureUri?: string; vehicleFrontViewImageUri?: string } | undefined,
  servicesCount: number,
): string | null => {
  if (!driverProfile?.firstName) return "/onboarding/driver-info";
  if (!driverProfile?.driverProfilePictureUri) {
    return servicesCount === 0 ? "/onboarding/services" : "/onboarding/documents";
  }
  if (!driverProfile?.vehicleFrontViewImageUri) return "/onboarding/vehicle-info";
  return null;
};

/** Checks if the given path matches a route or any of its sub-routes */
const matchesRoute = (pathname: string, routes: readonly string[]): boolean =>
  routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));

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
    actions: { fetchUserDetails, setRouteBeforeRedirect, setIsFetchingUserSessionLoading },
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

  const isPublic = useMemo(() => PUBLIC_ROUTES.includes(pathname as typeof PUBLIC_ROUTES[number]), [pathname]);
  const isAuthOnly = useMemo(() => matchesRoute(pathname, AUTH_ONLY_ROUTES), [pathname]);
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

    // Guest trying to access a protected route → redirect to sign-in
    if (!userRole && isProtected) {
      setRouteBeforeRedirect(pathname);
      toast.error("You are not logged in");
      router.replace("/sign-in");
      return;
    }

    if (userRole) {
      // Driver onboarding checks
      if (userRole === "driver") {
        const redirect = getDriverOnboardingRedirect(driverProfile, services.length);
        if (redirect) {
          router.replace(redirect);
          return;
        }
      }

      // Rider onboarding check (only on non-public routes)
      if (userRole === "rider" && !isPublic && !riderProfile?.firstName) {
        router.replace("/onboarding/driver-info");
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
      toast.error("Onboarding process incomplete. Please complete your onboarding process to continue!");
      setIsFetchingUserSessionLoading(false);
      router.replace("/onboarding/user-type");
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
    services.length,
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
  if (userRole && isAuthOnly && userRole !== "user") return <LoadingComponent />;

  return <>{children}</>;
};
