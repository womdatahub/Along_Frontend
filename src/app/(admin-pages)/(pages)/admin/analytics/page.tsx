"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Users,
  Car,
  DollarSign,
  Activity,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { requests } from "@/lib";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Period = "7d" | "30d" | "90d" | "1y";

type AnalyticsData = {
  revenue?: { labels: string[]; values: number[] };
  rentals?: { labels: string[]; values: number[] };
  riders?: { labels: string[]; values: number[] };
  drivers?: { labels: string[]; values: number[] };
  summary?: {
    totalRevenue?: number;
    totalRentals?: number;
    activeRiders?: number;
    activeDrivers?: number;
    revenueGrowth?: number;
    rentalGrowth?: number;
    riderGrowth?: number;
    driverGrowth?: number;
  };
};

const PERIODS: { key: Period; label: string }[] = [
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "90d", label: "90 days" },
  { key: "1y", label: "1 year" },
];

// Placeholder data rendered while real API data loads or is empty
const PLACEHOLDER_REVENUE = [
  { name: "Jan", value: 0 },
  { name: "Feb", value: 0 },
  { name: "Mar", value: 0 },
  { name: "Apr", value: 0 },
  { name: "May", value: 0 },
  { name: "Jun", value: 0 },
  { name: "Jul", value: 0 },
];

const PLACEHOLDER_RENTALS = [
  { name: "Mon", value: 0 },
  { name: "Tue", value: 0 },
  { name: "Wed", value: 0 },
  { name: "Thu", value: 0 },
  { name: "Fri", value: 0 },
  { name: "Sat", value: 0 },
  { name: "Sun", value: 0 },
];

const Page = () => {
  const [period, setPeriod] = useState<Period>("30d");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadAnalytics = async () => {
    setIsLoading(true);
    const { data } = await requests.admin.getAnalytics(period);
    setIsLoading(false);
    if (data?.data) {
      setAnalytics(data.data as AnalyticsData);
    }
  };

  useEffect(() => {
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const summary = analytics?.summary;

  const revenueData =
    analytics?.revenue?.labels?.map((label, i) => ({
      name: label,
      value: analytics.revenue!.values[i] ?? 0,
    })) ?? PLACEHOLDER_REVENUE;

  const rentalData =
    analytics?.rentals?.labels?.map((label, i) => ({
      name: label,
      value: analytics.rentals!.values[i] ?? 0,
    })) ?? PLACEHOLDER_RENTALS;

  const stats = [
    {
      label: "Total Revenue",
      value:
        summary?.totalRevenue != null
          ? `$${summary.totalRevenue.toLocaleString()}`
          : "—",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      growth: summary?.revenueGrowth,
    },
    {
      label: "Total Rentals",
      value: summary?.totalRentals?.toLocaleString() ?? "—",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      growth: summary?.rentalGrowth,
    },
    {
      label: "Active Riders",
      value: summary?.activeRiders?.toLocaleString() ?? "—",
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      growth: summary?.riderGrowth,
    },
    {
      label: "Active Drivers",
      value: summary?.activeDrivers?.toLocaleString() ?? "—",
      icon: Car,
      color: "text-amber-600",
      bg: "bg-amber-50",
      growth: summary?.driverGrowth,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">
            Analytics
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Platform performance metrics and growth trends
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Period selector */}
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-2 text-xs font-semibold transition-colors ${
                  period === p.key
                    ? "bg-primary text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <button
            onClick={loadAnalytics}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between">
              <div
                className={`size-10 rounded-xl ${s.bg} flex items-center justify-center`}
              >
                <s.icon size={18} className={s.color} />
              </div>
              {s.growth != null && (
                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold ${
                    s.growth >= 0 ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {s.growth >= 0 ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {Math.abs(s.growth).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold font-heebo text-gray-900">
                {s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={15} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Revenue</p>
              <p className="text-xs text-gray-400">
                Platform earnings over time
              </p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  tickFormatter={(v: number) =>
                    `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f3f4f6",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) =>
                    value != null
                      ? [`$${Number(value).toLocaleString()}`, "Revenue"]
                      : ["—", "Revenue"]
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#revenueGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rentals chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Activity size={15} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Rental Volume
              </p>
              <p className="text-xs text-gray-400">
                Number of completed rentals
              </p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={rentalData}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f3f4f6",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [value ?? 0, "Rentals"]}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Bar
                  dataKey="value"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User growth row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Rider growth */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-violet-50 flex items-center justify-center">
              <Users size={15} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Rider Growth
              </p>
              <p className="text-xs text-gray-400">New rider registrations</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  analytics?.riders?.labels?.map((label, i) => ({
                    name: label,
                    value: analytics.riders!.values[i] ?? 0,
                  })) ?? PLACEHOLDER_REVENUE
                }
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="riderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={0}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f3f4f6",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [value ?? 0, "Riders"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#riderGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Driver growth */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Car size={15} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Driver Growth
              </p>
              <p className="text-xs text-gray-400">New driver registrations</p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={
                  analytics?.drivers?.labels?.map((label, i) => ({
                    name: label,
                    value: analytics.drivers!.values[i] ?? 0,
                  })) ?? PLACEHOLDER_REVENUE
                }
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="driverGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={0}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #f3f4f6",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value) => [value ?? 0, "Drivers"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fill="url(#driverGrad)"
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
