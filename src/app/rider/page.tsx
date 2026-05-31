"use client";

import { Button, NameAvatar } from "@/components";
import { useEffect } from "react";
import { usePayment, useRadarMap, useRental, useSession } from "@/store";
import { WhiteForwardIcon } from "@public/svgs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

// Radar SDK is large — lazy-load the autocomplete so it doesn't block the
// rider dashboard initial paint.
const RadarAutocomplete = dynamic(
  () =>
    import("@/components/shared/radar-map").then((m) => ({
      default: m.RadarAutocomplete,
    })),
  { ssr: false, loading: () => <span className="text-gray-400 text-sm">Where to?</span> },
);
import {
  Car,
  FileText,
  MessageSquare,
  MapPin,
  ChevronRight,
  Clock,
  Wallet,
  LogOut,
  User,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Rent a Car", href: "/rent-ride", icon: Car },
  { label: "My Rentals", href: "/rider/rentals", icon: FileText },
  { label: "License", href: "/rider/license", icon: FileText },
  { label: "Messages", href: "/rider/messages", icon: MessageSquare },
  { label: "Profile", href: "/rider/profile", icon: User },
  { label: "Settings", href: "/rider/settings", icon: Settings },
];

const Page = () => {
  const router = useRouter();

  const {
    riderProfile,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      riderProfile: state.riderProfile,
      actions: state.actions,
    })),
  );

  const {
    autoCompleteAddress,
    actions: { setAutoCompleteAddress },
  } = useRadarMap(
    useShallow((state) => ({
      autoCompleteAddress: state.autoCompleteAddress,
      actions: state.actions,
    })),
  );

  const {
    rentalHistory,
    actions: { fetchRentals },
  } = useRental(
    useShallow((state) => ({
      rentalHistory: state.rentalHistory,
      actions: state.actions,
    })),
  );

  const {
    walletDetails,
    actions: { fetchWalletDetails },
  } = usePayment(
    useShallow((state) => ({
      walletDetails: state.walletDetails,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    fetchRentals();
    fetchWalletDetails();
  }, [fetchRentals, fetchWalletDetails]);

  const initials = `${riderProfile?.firstName?.[0] ?? ""}${riderProfile?.lastName?.[0] ?? ""}`;
  const walletBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(walletDetails?.mainBalance ?? 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/*  Sidebar  */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full lg:w-64 shrink-0 flex flex-col gap-4"
          >
            {/* Profile card */}
            <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
              <NameAvatar
                value={initials}
                className="size-12 text-base shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-black truncate font-heebo">
                  {riderProfile?.firstName} {riderProfile?.lastName}
                </p>
                <p className="text-xs text-gray font-light truncate">
                  {riderProfile?.email ?? "Rider"}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-background transition-colors duration-200 group border-b border-gray-100 last:border-0"
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

            {/* Wallet card */}
            <div className="bg-primary-deep text-white rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet size={16} className="text-white/60" />
                  <p className="text-xs font-medium text-white/60">
                    Along Wallet
                  </p>
                </div>
                <Image
                  src="/images/wallet.png"
                  alt="wallet"
                  width={32}
                  height={32}
                />
              </div>
              <div>
                <p className="text-xs text-white/50 font-light mb-1">Balance</p>
                <p className="text-2xl font-bold font-heebo">{walletBalance}</p>
              </div>
              <Link
                href="/rider/wallets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-lightgreen hover:text-white transition-colors"
              >
                View wallet
                <ChevronRight size={12} />
              </Link>
            </div>
          </motion.aside>

          {/*  Main content  */}
          <main className="flex-1 flex flex-col gap-5">
            {/* Quick trip bar */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <p className="text-xs font-semibold text-gray uppercase tracking-wider mb-3 font-heebo">
                Quick Trip
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 flex-1 bg-background rounded-xl px-4 py-3">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <div className="flex-1 text-sm text-gray-700">
                    <RadarAutocomplete
                      setAutoCompleteAddress={setAutoCompleteAddress}
                      placeholder="Where to?"
                      defaultValue={
                        autoCompleteAddress
                          ? `${autoCompleteAddress.formattedAddress}`
                          : undefined
                      }
                    />
                  </div>
                </div>
                <Button
                  variant="default"
                  disabled={!autoCompleteAddress}
                  onClick={() => router.push("/rent-ride")}
                  className="bg-primary hover:bg-primary-deep rounded-xl size-11 flex items-center justify-center p-0 shrink-0 shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <WhiteForwardIcon />
                </Button>
              </div>
            </motion.div>

            {/* CTA + Payment cards */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 rounded-xl bg-primaryLight2 flex items-center justify-center">
                  <Car size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-black font-heebo mb-1">
                    Rental Ready When You Are
                  </h3>
                  <p className="text-gray text-sm font-light leading-relaxed">
                    Browse vehicles, choose self-drive or with-driver, and pay
                    securely via Stripe.
                  </p>
                </div>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary-deep text-white rounded-xl px-5 py-2.5 h-auto text-sm font-semibold w-fit transition-colors duration-200 cursor-pointer"
                >
                  <Link href="/rent-ride">Book now</Link>
                </Button>
              </motion.div>

              {/* Stripe card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut", delay: 0.15 }}
                className="rounded-2xl p-6 flex flex-col gap-4 shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, #1F364B 0%, #0E252F 100%)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-bold text-base font-heebo">
                      Stripe
                    </p>
                    <p className="text-white/60 text-xs font-light">
                      Secure checkout
                    </p>
                  </div>
                  <Image
                    src="/images/credit-cards.png"
                    alt="credit-cards"
                    width={48}
                    height={60}
                    style={{ height: "auto" }}
                  />
                </div>
                <Link
                  href="/rider/cards"
                  className="text-lightgreen text-xs font-medium hover:text-white transition-colors"
                >
                  Payment details →
                </Link>
                <Button
                  asChild
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl h-auto py-2.5 text-sm font-semibold w-fit transition-all duration-200 cursor-pointer"
                >
                  <Link href="/rider/new-card">Add card</Link>
                </Button>
              </motion.div>
            </div>

            {/* Activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-sm text-black font-heebo">
                  Recent Activity
                </p>
                <Link
                  href="/rider/rentals"
                  className="text-xs text-primary font-medium hover:text-primary-deep transition-colors"
                >
                  View all
                </Link>
              </div>

              {rentalHistory.length > 0 ? (
                <div className="flex flex-col divide-y divide-gray-100">
                  {rentalHistory.slice(0, 6).map((rental) => {
                    const rentalId = rental._id ?? rental.id ?? "";
                    const date = rental.pickUpTime ?? rental.createdAt;
                    return (
                      <button
                        key={rentalId}
                        className="flex items-center gap-4 py-3.5 hover:bg-background -mx-3 px-3 rounded-xl transition-all duration-200 text-left w-full group"
                        onClick={() =>
                          router.push(
                            `/rider/ride-details?rentalId=${rentalId}`,
                          )
                        }
                      >
                        <div className="w-9 h-9 rounded-xl bg-primaryLight2 group-hover:bg-primary/10 flex items-center justify-center shrink-0 transition-colors duration-200">
                          <MapPin size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-black truncate font-heebo group-hover:text-primary transition-colors duration-200">
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
                                ? "text-emerald-600"
                                : rental.status === "cancelled"
                                  ? "text-rose-500"
                                  : "text-amber-600"
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
                    No recent rentals
                  </p>
                  <p className="text-xs text-gray font-light text-center max-w-xs">
                    Book your first ride to see your activity here.
                  </p>
                  <Link
                    href="/rent-ride"
                    className="mt-2 text-sm font-semibold text-primary hover:text-primary-deep transition-colors"
                  >
                    Book a ride →
                  </Link>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Page;
