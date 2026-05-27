"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import {
  Car,
  Users,
  ShieldAlert,
  Clock,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const Page = () => {
  const {
    allDrivers,
    allRiders,
    sosAlerts,
    activeRentals,
    pendingKyc,
    actions: {
      getAllDrivers,
      getAllRiders,
      getSOSAlerts,
      getActiveRentals,
      getpendingKyc,
    },
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allDrivers: state.allDrivers,
      allRiders: state.allRiders,
      sosAlerts: state.sosAlerts,
      activeRentals: state.activeRentals,
      pendingKyc: state.pendingKyc,
    })),
  );

  useEffect(() => {
    getAllDrivers();
    getAllRiders();
    getSOSAlerts();
    getActiveRentals();
    getpendingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openSOSCount = sosAlerts.filter(
    (a) => !a.status || a.status === "open" || a.status === "active",
  ).length;

  const pendingKycRecord = pendingKyc as unknown as Record<
    string,
    unknown[]
  > | null;
  const kycCount =
    (Array.isArray(pendingKycRecord?.riderLicenses)
      ? pendingKycRecord.riderLicenses.length
      : 0) +
    (Array.isArray(pendingKycRecord?.vehicles)
      ? pendingKycRecord.vehicles.length
      : 0);

  // Derive recent activity from live store data
  type ActivityItem = {
    title: string;
    description: string;
    time: string;
    icon: React.ElementType;
    iconBg: string;
    iconColor: string;
  };

  const recentActivity: ActivityItem[] = [
    ...sosAlerts
      .filter((a) => a.status === "resolved" || a.status === "closed")
      .slice(0, 2)
      .map((a) => ({
        title: "SOS alert resolved",
        description: `Alert #${a._id ?? a.id ?? "—"} cleared`,
        time: a.timeStamp
          ? new Date(a.timeStamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
        icon: ShieldAlert,
        iconBg: "bg-rose-50",
        iconColor: "text-rose-600",
      })),
    ...sosAlerts
      .filter((a) => !a.status || a.status === "open" || a.status === "active")
      .slice(0, 2)
      .map((a) => ({
        title: "Open SOS alert",
        description: `Alert #${a._id ?? a.id ?? "—"} requires attention`,
        time: a.timeStamp
          ? new Date(a.timeStamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "—",
        icon: ShieldAlert,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
      })),
  ].slice(0, 4);

  const stats = [
    {
      label: "Total Drivers",
      value: allDrivers.length,
      icon: Car,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: `${allDrivers.length} registered`,
      trendUp: true,
    },
    {
      label: "Total Riders",
      value: allRiders.length,
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: `${allRiders.length} registered`,
      trendUp: true,
    },
    {
      label: "Active Rentals",
      value: activeRentals.length,
      icon: Activity,
      color: "text-violet-600",
      bg: "bg-violet-50",
      trend:
        activeRentals.length > 0
          ? `${activeRentals.length} ongoing`
          : "None ongoing",
      trendUp: activeRentals.length > 0,
    },
    {
      label: "Open SOS",
      value: openSOSCount,
      icon: ShieldAlert,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trend: openSOSCount > 0 ? `${openSOSCount} unresolved` : "All resolved",
      trendUp: openSOSCount === 0,
    },
  ];

  const queueItems = [
    {
      label: "Rush requests",
      description: "Approaching SLA deadline",
      count: 0,
      dotColor: "bg-rose-500",
      countColor: "text-rose-600",
    },
    {
      label: "Scheduled rentals",
      description: "Need assignment in 48h",
      count: activeRentals.length,
      dotColor: "bg-amber-400",
      countColor: "text-amber-600",
    },
    {
      label: "Pending refunds",
      description: "Awaiting approval",
      count: 0,
      dotColor: "bg-gray-400",
      countColor: "text-gray-600",
    },
    {
      label: "KYC reviews",
      description: "Documents awaiting verification",
      count: kycCount,
      dotColor: "bg-blue-500",
      countColor: "text-blue-600",
    },
  ];

  const operationalItems = [
    {
      title: "Rush SLA Met",
      value: "—",
      subtitle: "No rush rides in window",
      icon: Clock,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      titleColor: "text-amber-800",
    },
    {
      title: "Availability Rate",
      value: "—",
      subtitle: "Driver availability data pending",
      icon: Activity,
      iconColor: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      titleColor: "text-blue-800",
    },
    {
      title: "Incident Rate",
      value: openSOSCount === 0 ? "0" : String(openSOSCount),
      subtitle:
        openSOSCount === 0
          ? "Zero incidents in last 24h"
          : `${openSOSCount} open incident(s)`,
      icon: AlertTriangle,
      iconColor: openSOSCount === 0 ? "text-emerald-600" : "text-rose-600",
      bg: openSOSCount === 0 ? "bg-emerald-50" : "bg-rose-50",
      border: openSOSCount === 0 ? "border-emerald-100" : "border-rose-100",
      titleColor: openSOSCount === 0 ? "text-emerald-800" : "text-rose-800",
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div
                className={`${s.bg} ${s.color} size-10 rounded-xl flex items-center justify-center`}
              >
                <s.icon size={18} />
              </div>
              <span
                className={`text-xs font-medium flex items-center gap-1 ${s.trendUp ? "text-emerald-600" : "text-rose-600"}`}
              >
                <ArrowUpRight size={12} />
                {s.trend}
              </span>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900 font-heebo">
                {s.value}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue overview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">Queue Overview</p>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          {queueItems.map((q) => (
            <div key={q.label} className="flex items-center gap-3">
              <div className={`size-2 rounded-full ${q.dotColor} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{q.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{q.description}</p>
              </div>
              <span className={`text-sm font-bold ${q.countColor}`}>
                {q.count}
              </span>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">Recent Activity</p>
            <TrendingUp size={14} className="text-gray-400" />
          </div>
          {recentActivity.length > 0 ? (
            <div className="flex flex-col gap-1">
              {recentActivity.map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-b-0"
                >
                  <div
                    className={`size-8 rounded-xl ${a.iconBg} flex items-center justify-center shrink-0 mt-0.5`}
                  >
                    <a.icon size={14} className={a.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {a.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {a.description}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-2">
              <Activity size={32} className="text-gray-300" />
              <p className="text-sm text-gray-400">No recent activity</p>
              <p className="text-xs text-gray-300">
                Activity will appear here as events occur
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Operational summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {operationalItems.map((item) => (
          <div
            key={item.title}
            className={`${item.bg} rounded-2xl p-5 border ${item.border}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <item.icon size={16} className={item.iconColor} />
              <p className={`text-sm font-semibold ${item.titleColor}`}>
                {item.title}
              </p>
            </div>
            <p className="text-2xl font-bold font-heebo text-gray-900">
              {item.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Page;
