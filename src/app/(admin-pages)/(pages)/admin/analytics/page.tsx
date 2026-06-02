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

type Point = { period: string; value: number };

type AnalyticsData = {
  revenue?: Point[];
  rentalVolume?: Point[];
  riderSignups?: Point[];
  driverSignups?: Point[];
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Backend periods are "YYYY-MM" (monthly series) or "YYYY-MM-DD" (daily series).
const formatPeriod = (period: string): string => {
  const parts = period.split("-");
  if (parts.length === 3) {
    return `${MONTHS[Number(parts[1]) - 1] ?? ""} ${Number(parts[2])}`;
  }
  if (parts.length === 2) {
    return MONTHS[Number(parts[1]) - 1] ?? period;
  }
  return period;
};

const sumValues = (points?: Point[]) =>
  (points ?? []).reduce((acc, p) => acc + (p.value ?? 0), 0);

// Period-over-period growth from the last two entries in a zero-filled series.
const growthOf = (points?: Point[]): number | undefined => {
  if (!points || points.length < 2) return undefined;
  const last = points[points.length - 1].value ?? 0;
  const prev = points[points.length - 2].value ?? 0;
  if (prev === 0) return undefined;
  return ((last - prev) / prev) * 100;
};

const toChart = (points?: Point[]) =>
  (points ?? []).map((p) => ({ name: formatPeriod(p.period), value: p.value }));

const Page = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAnalytics = async () => {
    setIsLoading(true);
    const { data } = await requests.admin.getAnalytics();
    setIsLoading(false);
    if (data?.data) {
      setAnalytics(data.data as AnalyticsData);
    }
  };

  useEffect(() => {
    let active = true;
    requests.admin.getAnalytics().then(({ data }) => {
      if (!active) return;
      if (data?.data) setAnalytics(data.data as AnalyticsData);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const revenueData = toChart(analytics?.revenue);
  const rentalData = toChart(analytics?.rentalVolume);
  const riderData = toChart(analytics?.riderSignups);
  const driverData = toChart(analytics?.driverSignups);

  const stats = [
    {
      label: "Revenue (6 mo)",
      value: `$${sumValues(analytics?.revenue).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      growth: growthOf(analytics?.revenue),
    },
    {
      label: "Rentals (7 days)",
      value: sumValues(analytics?.rentalVolume).toLocaleString(),
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
      growth: growthOf(analytics?.rentalVolume),
    },
    {
      label: "New Riders (6 mo)",
      value: sumValues(analytics?.riderSignups).toLocaleString(),
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      growth: growthOf(analytics?.riderSignups),
    },
    {
      label: "New Drivers (6 mo)",
      value: sumValues(analytics?.driverSignups).toLocaleString(),
      icon: Car,
      color: "text-amber-600",
      bg: "bg-amber-50",
      growth: growthOf(analytics?.driverSignups),
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
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
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
              <p className="text-xs text-gray-400">Last 6 months</p>
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
              <p className="text-xs text-gray-400">Last 7 days</p>
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
              <p className="text-xs text-gray-400">
                New rider registrations · last 6 months
              </p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={riderData}
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
              <p className="text-xs text-gray-400">
                New driver registrations · last 6 months
              </p>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={driverData}
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
