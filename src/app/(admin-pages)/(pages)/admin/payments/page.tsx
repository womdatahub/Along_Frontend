"use client";

import { useEffect, useState, useCallback } from "react";
import {
  CreditCard,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { requests } from "@/lib";
import { cn } from "@/lib";

type PaymentRecord = {
  id: string;
  rider?: string;
  driver?: string;
  amount?: number;
  platformFee?: number;
  status?: "completed" | "pending" | "refunded" | "disputed" | string;
  type?: "rental" | "ride" | string;
  createdAt?: string;
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  refunded: "bg-blue-50 text-blue-700",
  disputed: "bg-rose-50 text-rose-700",
};

const PAGE_SIZE = 20;

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadRecords = useCallback(async (pageIndex: number) => {
    setIsLoading(true);
    const { data } = await requests.admin.getPaymentRecords({
      limit: PAGE_SIZE,
      offset: pageIndex * PAGE_SIZE,
    });
    setIsLoading(false);
    if (data?.data) {
      const incoming = data.data as PaymentRecord[];
      setRecords(incoming);
      setHasMore(incoming.length === PAGE_SIZE);
    }
  }, []);

  useEffect(() => {
    loadRecords(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => {
    setPage(0);
    loadRecords(0);
  };

  const filtered = records.filter(
    (r) =>
      (r.rider ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.driver ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalVolume = records.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const totalRevenue = records.reduce((sum, r) => sum + (r.platformFee ?? 0), 0);

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">Payments</p>
          <p className="text-sm text-gray-500 mt-0.5">
            View all platform transactions and payment records
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Volume",
            value: `$${totalVolume.toFixed(2)}`,
            icon: TrendingUp,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Platform Revenue",
            value: `$${totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Total Transactions",
            value: records.length,
            icon: CreditCard,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className={`size-10 rounded-xl ${s.bg} flex items-center justify-center`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 font-heebo">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search bar */}
        <div className="px-6 py-4 border-b border-gray-50">
          <div className="relative max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by rider or driver…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <CreditCard size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">
              {isLoading ? "Loading records…" : "No payment records found"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["ID", "Rider", "Driver", "Type", "Amount", "Platform Fee", "Status", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r.id ?? i}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      #{(r.id ?? "").slice(-6) || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <ArrowUpRight size={12} className="text-blue-400 shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                          {r.rider ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <ArrowDownLeft size={12} className="text-emerald-400 shrink-0" />
                        <span className="text-sm text-gray-700 truncate max-w-[100px]">
                          {r.driver ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {r.type ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {r.amount != null ? `$${r.amount.toFixed(2)}` : "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">
                        {r.platformFee != null ? `$${r.platformFee.toFixed(2)}` : "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                          r.status
                            ? (STATUS_STYLES[r.status] ?? "bg-gray-100 text-gray-600")
                            : "bg-gray-100 text-gray-400",
                        )}
                      >
                        {r.status ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-gray-400 font-mono whitespace-nowrap">
                        {r.createdAt ?? "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50">
          <p className="text-xs text-gray-400">
            Page {page + 1} · {filtered.length} records
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:text-gray-300 hover:text-gray-900 disabled:cursor-not-allowed px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasMore || isLoading}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:text-gray-300 hover:text-gray-900 disabled:cursor-not-allowed px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
