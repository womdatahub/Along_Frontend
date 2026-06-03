"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import {
  Car,
  Users,
  ShieldAlert,
  DollarSign,
  Clock,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

type DashboardMetrics = {
  totals: {
    totalRiders: number;
    totalDrivers: number;
    totalRentals: number;
    totalRides: number;
    totalRevenue: number;
    totalSos: number;
  };
  operationalMetrics: {
    rushSlaMet: number;
    availabilityRate: number;
    incidentRate: number;
  };
  queueOverview: {
    rushRequests: number;
    scheduledRentals: number;
    instantRentals: number;
    pendingRefunds: number;
    pendingKycs: number;
  };
};

function castMetrics(
  raw: Record<string, unknown> | null,
): DashboardMetrics | null {
  if (!raw) return null;
  return raw as unknown as DashboardMetrics;
}

const Page = () => {
  const {
    dashboardMetrics: rawMetrics,
    isLoading,
    actions: { getAdminDashboardDetails },
  } = useAdmin(
    useShallow((state) => ({
      dashboardMetrics: state.dashboardMetrics,
      isLoading: state.isLoading,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    getAdminDashboardDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const m = castMetrics(rawMetrics);

  const totalDrivers = m?.totals.totalDrivers ?? 0;
  const totalRiders = m?.totals.totalRiders ?? 0;
  const totalRentals = m?.totals.totalRentals ?? 0;
  const totalSos = m?.totals.totalSos ?? 0;
  const totalRevenue = m?.totals.totalRevenue ?? 0;

  const rushSlaMet = m?.operationalMetrics.rushSlaMet ?? 0;
  const availabilityRate = m?.operationalMetrics.availabilityRate ?? 0;
  const incidentRate = m?.operationalMetrics.incidentRate ?? 0;

  const rushRequests = m?.queueOverview.rushRequests ?? 0;
  const scheduledRentals = m?.queueOverview.scheduledRentals ?? 0;
  const pendingRefunds = m?.queueOverview.pendingRefunds ?? 0;
  const pendingKycs = m?.queueOverview.pendingKycs ?? 0;

  const dash = (v: number | string) => (isLoading ? "—" : v);

  const stats = [
    {
      label: "Total Drivers",
      value: dash(totalDrivers),
      icon: Car,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: isLoading ? "Loading…" : `${totalDrivers} registered`,
      trendUp: true,
    },
    {
      label: "Total Riders",
      value: dash(totalRiders),
      icon: Users,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      trend: isLoading ? "Loading…" : `${totalRiders} registered`,
      trendUp: true,
    },
    {
      label: "Total Revenue",
      value: isLoading
        ? "—"
        : `$${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-violet-600",
      bg: "bg-violet-50",
      trend: isLoading
        ? "Loading…"
        : `${totalRentals} rental${totalRentals !== 1 ? "s" : ""}`,
      trendUp: totalRevenue > 0,
    },
    {
      label: "Open SOS",
      value: dash(totalSos),
      icon: ShieldAlert,
      color: "text-rose-600",
      bg: "bg-rose-50",
      trend: isLoading
        ? "Loading…"
        : totalSos > 0
          ? `${totalSos} unresolved`
          : "All resolved",
      trendUp: totalSos === 0,
    },
  ];

  const queueItems = [
    {
      label: "Rush requests",
      description: "Approaching SLA deadline",
      count: rushRequests,
      dotColor: "bg-rose-500",
      countColor: "text-rose-600",
    },
    {
      label: "Scheduled rentals",
      description: "Need assignment in 48h",
      count: scheduledRentals,
      dotColor: "bg-amber-400",
      countColor: "text-amber-600",
    },
    {
      label: "Pending refunds",
      description: "Awaiting approval",
      count: pendingRefunds,
      dotColor: "bg-gray-400",
      countColor: "text-gray-600",
    },
    {
      label: "KYC reviews",
      description: "Documents awaiting verification",
      count: pendingKycs,
      dotColor: "bg-blue-500",
      countColor: "text-blue-600",
    },
  ];

  const operationalItems = [
    {
      title: "Rush SLA Met",
      value: isLoading ? "—" : String(rushSlaMet),
      subtitle: "Rush SLA performance",
      icon: Clock,
      iconColor: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100",
      titleColor: "text-amber-800",
    },
    {
      title: "Availability Rate",
      value: isLoading ? "—" : `${availabilityRate}%`,
      subtitle: "Active driver availability",
      icon: Activity,
      iconColor: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100",
      titleColor: "text-blue-800",
    },
    {
      title: "Incident Rate",
      value: isLoading ? "—" : String(incidentRate),
      subtitle:
        incidentRate === 0
          ? "Zero incidents in last 24h"
          : `${incidentRate} incident(s) recorded`,
      icon: AlertTriangle,
      iconColor: incidentRate === 0 ? "text-emerald-600" : "text-rose-600",
      bg: incidentRate === 0 ? "bg-emerald-50" : "bg-rose-50",
      border: incidentRate === 0 ? "border-emerald-100" : "border-rose-100",
      titleColor: incidentRate === 0 ? "text-emerald-800" : "text-rose-800",
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
                {isLoading ? "—" : q.count}
              </span>
            </div>
          ))}
        </div>

        {/* Recent activity placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900">Recent Activity</p>
            <TrendingUp size={14} className="text-gray-400" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-2">
            <Activity size={32} className="text-gray-300" />
            <p className="text-sm text-gray-400">
              {isLoading ? "Loading activity…" : "No recent activity"}
            </p>
            {!isLoading && (
              <p className="text-xs text-gray-300">
                Activity will appear here as events occur
              </p>
            )}
          </div>
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
