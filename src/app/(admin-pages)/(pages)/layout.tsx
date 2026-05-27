"use client";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/store";
import { useShallow } from "zustand/shallow";
import { ROLE_DASHBOARD_MAP } from "@/lib";
import { requests } from "@/lib";
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  X,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldAlert,
  Car,
  UserCheck,
  Loader2,
} from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/drivers-and-fleets": "Drivers & Fleets",
  "/admin/riders": "Riders",
  "/admin/roles-and-permission": "Roles & Permissions",
  "/admin/sos": "SOS Console",
  "/admin/market-place": "Marketplace",
  "/admin/admins": "Admins",
  "/admin/profile": "Profile",
  "/admin/settings": "Settings",
  "/admin/analytics": "Analytics",
  "/admin/kyc": "KYC Management",
  "/admin/licenses": "License Approvals",
  "/admin/vehicles": "Vehicle Approvals",
  "/admin/active-trip": "Active Trips",
  "/admin/rentals": "Active Rentals",
  "/admin/payments": "Payments",
  "/admin/disputes": "Disputes",
  "/admin/audit-logs": "Audit Logs",
};

type AppNotification = {
  _id: string;
  title?: string;
  message?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

function notifIcon(type?: string) {
  const t = (type ?? "").toLowerCase();
  if (t.includes("sos") || t.includes("alert"))
    return <ShieldAlert size={15} className="text-rose-500" />;
  if (t.includes("driver") || t.includes("vehicle"))
    return <Car size={15} className="text-blue-500" />;
  if (t.includes("rider") || t.includes("user") || t.includes("kyc"))
    return <UserCheck size={15} className="text-violet-500" />;
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

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notification panel state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const notifPanelRef = useRef<HTMLDivElement>(null);

  const {
    adminProfile,
    actions: { logOut },
  } = useSession(
    useShallow((state) => ({
      actions: state.actions,
      adminProfile: state.adminProfile,
    })),
  );

  const { userRole } = useSession(
    useShallow((state) => ({ userRole: state.userRole })),
  );

  const router = useRouter();

  // Click-outside for user dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close notif panel on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

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
    if (unread.length === 0) return;
    setMarkingAll(true);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, read: true })),
    );
    await Promise.allSettled(
      unread.map((n) => requests.notification.markAsRead(n._id)),
    );
    setMarkingAll(false);
  };

  if (!userRole) {
    router.push("/");
    return null;
  }
  if (userRole === "rider" || userRole === "driver") {
    router.push(ROLE_DASHBOARD_MAP[userRole]);
    return null;
  }

  const initials =
    `${adminProfile?.firstName?.[0] ?? ""}${adminProfile?.lastName?.[0] ?? ""}`.toUpperCase();
  const pageTitle = PAGE_TITLES[pathname] ?? "Admin";
  const unreadCount = notifications.filter((n) => !n.isRead && !n.read).length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#f0f2f3] dark:bg-gray-900 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 md:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-xl p-1.5 transition-colors" />
            <div className="hidden md:flex items-center gap-1 text-gray-400 text-sm">
              <span>Admin</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">{pageTitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications bell */}
            <button
              onClick={openNotifications}
              className="size-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors relative"
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-1.5 bg-rose-500 rounded-full" />
              )}
              {unreadCount === 0 && notifications.length === 0 && (
                <span className="absolute top-1.5 right-1.5 size-1.5 bg-rose-500 rounded-full" />
              )}
            </button>

            {/* User menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 hover:bg-gray-50 rounded-xl px-2.5 py-1.5 transition-colors"
              >
                <div className="size-8 rounded-xl bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {initials || <User size={14} />}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {adminProfile?.firstName} {adminProfile?.lastName}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">
                    {adminProfile?.role}
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-gray-100 shadow-lg p-1.5 z-50">
                  <Link
                    href="/admin/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={15} className="text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    href="/admin/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings size={15} className="text-gray-400" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-50 my-1" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>

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
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markingAll}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 bg-primary/8 hover:bg-primary/15 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
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
              className="size-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors ml-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto">
          {notifLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-2xl">
                  <div className="size-8 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
                    <div className="h-2.5 bg-gray-100 rounded-full animate-pulse w-full" />
                    <div className="h-2 bg-gray-100 rounded-full animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 px-6 text-center">
              <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Bell size={26} className="text-gray-200" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  All caught up
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  No notifications yet. New activity will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 flex flex-col gap-1">
              {notifications.map((notif) => {
                const isRead = notif.isRead || notif.read;
                return (
                  <button
                    key={notif._id}
                    onClick={() => !isRead && markRead(notif._id)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-2xl transition-colors group ${
                      isRead
                        ? "hover:bg-gray-50"
                        : "bg-primary/5 hover:bg-primary/10"
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`size-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isRead ? "bg-gray-100" : "bg-white shadow-sm"
                      }`}
                    >
                      {notifIcon(notif.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {notif.title && (
                        <p
                          className={`text-sm leading-snug truncate ${
                            isRead
                              ? "font-medium text-gray-600"
                              : "font-semibold text-gray-900"
                          }`}
                        >
                          {notif.title}
                        </p>
                      )}
                      {notif.message && (
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {notif.message}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-300 mt-1.5">
                        {timeAgo(notif.createdAt ?? notif.updatedAt)}
                      </p>
                    </div>

                    {/* Unread dot */}
                    {!isRead && (
                      <span className="size-2 rounded-full bg-primary shrink-0 mt-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel footer */}
        {notifications.length > 0 && (
          <div className="shrink-0 px-5 py-3 border-t border-gray-50">
            <p className="text-xs text-center text-gray-400">
              {notifications.length} notification
              {notifications.length !== 1 ? "s" : ""} total
            </p>
          </div>
        )}
      </div>
    </SidebarProvider>
  );
}
