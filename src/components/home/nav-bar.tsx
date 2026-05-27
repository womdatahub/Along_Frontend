"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { LogoIcon } from "@public/svgs";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Menu,
  ChevronRight,
  Bell,
  Info,
  AlertTriangle,
  ShieldAlert,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { ROLE_DASHBOARD_MAP } from "@/lib/const";
import { requests } from "@/lib";

//  Notification helpers
type AppNotification = {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
};

function notifIcon(type?: string) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("sos") || t.includes("alert"))
    return <ShieldAlert size={15} className="text-rose-500" />;
  if (t.includes("warn"))
    return <AlertTriangle size={15} className="text-amber-500" />;
  return <Info size={15} className="text-gray-400" />;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Help", href: "/help" },
];

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Notification panel
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const { userRole } = useSession(
    useShallow((state) => ({ userRole: state.userRole })),
  );

  const dashboardHref = userRole
    ? (ROLE_DASHBOARD_MAP[userRole] ?? "/sign-in")
    : "/sign-in";

  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const { data } = await requests.notification.getNotifications();
      const raw = data as
        | { data?: AppNotification[] }
        | AppNotification[]
        | null;
      const list: AppNotification[] = Array.isArray(raw)
        ? raw
        : ((raw as { data?: AppNotification[] })?.data ?? []);
      setNotifications(list);
    } catch {
      setNotifications([]);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  const openNotifications = () => {
    setNotifOpen(true);
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true, read: true } : n)),
    );
    await requests.notification.markAsRead(id);
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead && !n.read);
    if (!unread.length) return;
    setMarkingAll(true);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, read: true })),
    );
    await Promise.allSettled(
      unread.map((n) => requests.notification.markAsRead(n._id)),
    );
    setMarkingAll(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-2/60"
            : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center h-18 px-5 md:px-8 max-w-7xl mx-auto">
          <Link href="/" className="shrink-0">
            <LogoIcon />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
            {userRole && userRole !== "driver" && (
              <Link
                href="/rent-ride"
                className="hover:text-primary transition-colors duration-200"
              >
                Rent a Ride
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification bell — only for logged-in non-admin users */}
            {userRole && userRole !== "admin" && userRole !== "SUPER_ADMIN" && (
              <button
                type="button"
                onClick={openNotifications}
                className="relative size-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={17} />
                {(unreadCount > 0 || notifications.length === 0) && (
                  <span className="absolute top-1.5 right-1.5 size-1.5 bg-rose-500 rounded-full" />
                )}
              </button>
            )}

            {userRole && userRole !== "user" ? (
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-deep transition-colors duration-200"
              >
                Dashboard
                <ChevronRight size={14} />
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-gray-4 hover:text-primary transition-colors duration-200"
                >
                  Sign in
                </Link>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-primary-deep transition-colors duration-200"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-background transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X size={20} className="text-gray-4" />
            ) : (
              <Menu size={20} className="text-gray-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-72 bg-white z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-5 border-b border-gray-2">
                  <LogoIcon />
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-xl hover:bg-background transition-colors"
                  >
                    <X size={18} className="text-gray-4" />
                  </button>
                </div>

                <nav className="flex flex-col p-5 gap-1 flex-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-medium text-gray-4 hover:bg-background hover:text-primary transition-all duration-200"
                    >
                      {link.label}
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  ))}
                  {userRole && userRole !== "driver" && (
                    <Link
                      href="/rent-ride"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between py-3.5 px-4 rounded-xl text-sm font-medium text-gray-4 hover:bg-background hover:text-primary transition-all duration-200"
                    >
                      Rent a Ride
                      <ChevronRight size={14} className="opacity-40" />
                    </Link>
                  )}
                </nav>

                <div className="p-5 border-t border-gray-2 flex flex-col gap-3">
                  {userRole && userRole !== "user" ? (
                    <Link
                      href={dashboardHref}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 bg-primary text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-primary-deep transition-colors duration-200"
                    >
                      Go to Dashboard
                      <ChevronRight size={14} />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/onboarding"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center bg-primary text-white text-sm font-semibold py-3.5 rounded-2xl hover:bg-primary-deep transition-colors duration-200"
                      >
                        Get started
                      </Link>
                      <Link
                        href="/sign-in"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center justify-center text-sm font-medium text-gray-4 py-3.5 rounded-2xl hover:bg-background transition-colors duration-200"
                      >
                        Sign in
                      </Link>
                    </>
                  )}
                </div>

                <div className="px-5 pb-8 flex items-center gap-2">
                  <Image
                    src="/images/account.png"
                    alt="Along Cities"
                    width={20}
                    height={20}
                    className="opacity-40"
                  />
                  <p className="text-xs text-gray font-medium">Along Cities</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification backdrop */}
      {notifOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-[2px]"
          onClick={() => setNotifOpen(false)}
        />
      )}

      {/* Notification slide-in panel */}
      <div
        ref={notifPanelRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-100 z-40 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          notifOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl bg-gray-50 flex items-center justify-center">
              <Bell size={15} className="text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Notifications</p>
              {unreadCount > 0 && (
                <p className="text-xs text-gray-400">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-primary/5"
              >
                {markingAll ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <CheckCheck size={13} />
                )}
                Mark all read
              </button>
            )}
            <button
              onClick={() => setNotifOpen(false)}
              className="size-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto">
          {notifLoading ? (
            <div className="flex flex-col gap-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 px-5 py-4 border-b border-gray-50"
                >
                  <div className="size-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Bell size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-500">
                No notifications yet
              </p>
              <p className="text-xs text-gray-400">
                You&#39;ll see updates about your rides and account here
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => {
                const isUnread = !n.isRead && !n.read;
                return (
                  <button
                    key={n._id}
                    type="button"
                    onClick={() => markRead(n._id)}
                    className={`flex items-start gap-3 px-5 py-4 border-b border-gray-50 last:border-b-0 text-left hover:bg-gray-50 transition-colors w-full ${
                      isUnread ? "bg-blue-50/40" : ""
                    }`}
                  >
                    <div className="size-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                      {notifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {n.title ?? "Notification"}
                        </p>
                        {isUnread && (
                          <span className="size-1.5 bg-primary rounded-full shrink-0" />
                        )}
                      </div>
                      {n.message && (
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                          {n.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {timeAgo(n.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};;
