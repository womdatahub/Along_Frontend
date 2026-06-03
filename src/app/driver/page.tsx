"use client";

import { Button, ProfileAvatar } from "@/components";
import { FilledGreenStarIcon } from "@public/svgs";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession, useRental } from "@/store";
import type { DriverProfile } from "@/types";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import {
  Car,
  FileText,
  MessageSquare,
  MapPin,
  ChevronRight,
  Clock,
  LogOut,
  Smartphone,
  Star,
  User,
  Settings,
} from "lucide-react";

const DynamicDriversChart = dynamic(
  () => import("../../components/shared/drivers-chart"),
  { ssr: false },
);

const NAV_ITEMS = [
  { label: "My Vehicle", href: "/driver/vehicle", icon: Car },
  { label: "Rental Bookings", href: "/driver/rentals", icon: FileText },
  { label: "Messages", href: "/driver/messages", icon: MessageSquare },
  { label: "Profile", href: "/driver/profile", icon: User },
  { label: "Settings", href: "/driver/settings", icon: Settings },
];

const Page = () => {
  const router = useRouter();

  const {
    currentUser,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      currentUser: state.currentUser,
      actions: state.actions,
    })),
  );
  const driverProfile = currentUser as DriverProfile | undefined;

  const {
    rentalHistory,
    actions: { fetchRentals },
  } = useRental(
    useShallow((state) => ({
      rentalHistory: state.rentalHistory,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const rating = driverProfile?.rating?.numberOfRatings ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/*  Sidebar  */}
          <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
            {/* Driver profile card */}
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
              <ProfileAvatar
                src={driverProfile?.driverProfilePictureUri}
                firstName={driverProfile?.firstName}
                lastName={driverProfile?.lastName}
                size={48}
                className="size-12 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-black truncate font-heebo">
                  {driverProfile?.firstName} {driverProfile?.lastName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star size={11} className="text-yellow-400 fill-yellow-400" />
                  <p className="text-xs text-gray font-light">
                    {rating}% rating
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-2xl overflow-hidden">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors duration-200 group border-b border-gray-2 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={16}
                      className="text-gray group-hover:text-primary transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-4 group-hover:text-primary transition-colors">
                      {label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-gray opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
              <button
                className="flex items-center gap-3 px-5 py-3.5 w-full hover:bg-red-50 transition-colors duration-200 group text-left"
                onClick={logOut}
              >
                <LogOut
                  size={16}
                  className="text-gray group-hover:text-red-500 transition-colors"
                />
                <span className="text-sm font-medium text-gray-4 group-hover:text-red-500 transition-colors">
                  Sign out
                </span>
              </button>
            </nav>

            {/* Rating card */}
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center shrink-0">
                <FilledGreenStarIcon />
              </div>
              <div>
                <p className="text-xs text-gray font-light">Driver Rating</p>
                <p className="text-lg font-bold text-black font-heebo">
                  {rating}%
                </p>
              </div>
            </div>
          </aside>

          {/*  Main content  */}
          <main className="flex-1 flex flex-col gap-5">
            {/* CTA */}
            <div className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <div className="w-10 h-10 rounded-xl bg-primaryLight2 flex items-center justify-center">
                <Car size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-black font-heebo mb-1">
                  Manage Rental Demand
                </h3>
                <p className="text-gray text-sm font-light leading-relaxed">
                  Keep your vehicle listed, update availability, and manage
                  incoming rental bookings in one place.
                </p>
              </div>
              <Button
                asChild
                className="bg-primary hover:bg-primary-deep text-white rounded-xl px-5 py-2.5 h-auto text-sm font-semibold w-fit transition-colors duration-200 cursor-pointer"
              >
                <Link href="/driver/rentals">View bookings</Link>
              </Button>
            </div>

            {/* Mobile-app listing notice */}
            <div className="bg-white rounded-2xl p-6 flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone size={18} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base text-black font-heebo mb-1">
                  Vehicle Listing &amp; Availability
                </h3>
                <p className="text-gray text-sm font-light leading-relaxed">
                  List your vehicle for rentals and manage your driver
                  availability through the{" "}
                  <strong className="text-primary font-semibold">
                    Along mobile app
                  </strong>
                  . You can view and edit vehicle details (colour, photos) from
                  the{" "}
                  <Link
                    href="/driver/vehicle"
                    className="text-primary font-semibold hover:underline"
                  >
                    My Vehicle
                  </Link>{" "}
                  page.
                </p>
              </div>
            </div>

            {/* Earnings chart */}
            <div className="bg-white rounded-2xl p-6">
              <p className="font-semibold text-sm text-black font-heebo mb-4">
                Earnings Overview
              </p>
              <DynamicDriversChart />
            </div>

            {/* Activity feed */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-black font-heebo">
                  Recent Bookings
                </p>
                <Link
                  href="/driver/rentals"
                  className="text-xs text-primary font-medium hover:text-primary-deep transition-colors"
                >
                  View all
                </Link>
              </div>

              {rentalHistory.length > 0 ? (
                <div className="flex flex-col divide-y divide-gray-2">
                  {rentalHistory.slice(0, 5).map((rental) => {
                    const rentalId = rental._id ?? rental.id ?? "";
                    const date = rental.pickUpTime ?? rental.createdAt;
                    return (
                      <button
                        key={rentalId}
                        className="flex items-center gap-4 py-3.5 hover:bg-background -mx-2 px-2 rounded-xl transition-colors text-left w-full"
                        onClick={() =>
                          router.push(
                            `/driver/ride-details?rentalId=${rentalId}`,
                          )
                        }
                      >
                        <div className="w-9 h-9 rounded-xl bg-primaryLight2 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate font-heebo">
                            {rental.pickUpAddress ?? "Pickup pending"}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Clock size={10} className="text-gray" />
                            <p className="text-xs text-gray font-light">
                              {date
                                ? new Date(date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "Pending"}
                            </p>
                            <span className="text-xs text-gray">·</span>
                            <p className="text-xs text-gray capitalize">
                              {rental.bookingType === "SELF_DRIVE"
                                ? "Self-drive"
                                : "With driver"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-black font-heebo">
                            ${rental.cost?.total ?? "0.00"}
                          </p>
                          <p
                            className={`text-xs capitalize font-medium ${
                              rental.status === "completed"
                                ? "text-green-600"
                                : rental.status === "cancelled"
                                  ? "text-red-500"
                                  : "text-pending"
                            }`}
                          >
                            {rental.status ?? "pending"}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center">
                    <Car size={24} className="text-gray" />
                  </div>
                  <p className="text-sm font-medium text-gray-4">
                    No rental bookings yet
                  </p>
                  <p className="text-xs text-gray font-light text-center max-w-xs">
                    List your vehicle to start receiving rental bookings.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
