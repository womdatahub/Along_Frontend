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
  Filter,
} from "lucide-react";
import { requests } from "@/lib";
import { cn } from "@/lib";
import {
  PaymentFor,
  PaymentStatus,
  PaymentType,
  type PaginationMeta,
  type PaymentRecord,
} from "@/types";

const STATUS_STYLES: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
  refunded: "bg-blue-50 text-blue-700",
};

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

/** Helper — readable label from a snake_case or single-word enum value. */
const titleCase = (s: string) =>
  s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  // Filters — empty string means "All"
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [paymentForFilter, setPaymentForFilter] = useState<string>("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("");

  const loadRecords = useCallback(
    async (
      nextPage: number,
      size: number,
      filters: {
        status?: string;
        paymentFor?: string;
        paymentType?: string;
      },
    ) => {
      setIsLoading(true);
      const { data } = await requests.admin.getPaymentRecords({
        page: nextPage,
        pageSize: size,
        // Back-compat: also send limit/offset for any endpoint that still expects them
        limit: size,
        offset: (nextPage - 1) * size,
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.paymentFor ? { paymentFor: filters.paymentFor } : {}),
        ...(filters.paymentType ? { paymentType: filters.paymentType } : {}),
      });
      setIsLoading(false);
      if (data?.data) {
        setRecords(data.data as PaymentRecord[]);
        setMeta(data.meta ?? null);
      }
    },
    [],
  );

  // Initial load + reload when filters or page size change → reset to page 1
  useEffect(() => {
    setPage(1);
    loadRecords(1, pageSize, {
      status: statusFilter,
      paymentFor: paymentForFilter,
      paymentType: paymentTypeFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, paymentForFilter, paymentTypeFilter, pageSize]);

  // Page changes only (filters/size handled above)
  useEffect(() => {
    if (page === 1) return; // initial-load effect already covered page 1
    loadRecords(page, pageSize, {
      status: statusFilter,
      paymentFor: paymentForFilter,
      paymentType: paymentTypeFilter,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleRefresh = () => {
    loadRecords(page, pageSize, {
      status: statusFilter,
      paymentFor: paymentForFilter,
      paymentType: paymentTypeFilter,
    });
  };

  const clearFilters = () => {
    setStatusFilter("");
    setPaymentForFilter("");
    setPaymentTypeFilter("");
  };

  const hasActiveFilters = Boolean(
    statusFilter || paymentForFilter || paymentTypeFilter,
  );

  const filtered = records.filter(
    (r) =>
      (r.rider ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.driver ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalVolume = records.reduce((sum, r) => sum + (r.amount ?? 0), 0);
  const totalRevenue = records.reduce(
    (sum, r) => sum + (r.platformFee ?? 0),
    0,
  );

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">
            Payments
          </p>
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
            value: meta?.total ?? records.length,
            icon: CreditCard,
            color: "text-violet-600",
            bg: "bg-violet-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`size-10 rounded-xl ${s.bg} flex items-center justify-center`}
            >
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 font-heebo">
                {s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Records table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Search + filters */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
          <div className="relative max-w-xs flex-1 sm:flex-initial">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by rider or driver…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All statuses"
            options={Object.values(PaymentStatus)}
          />
          <FilterSelect
            value={paymentForFilter}
            onChange={setPaymentForFilter}
            placeholder="All categories"
            options={Object.values(PaymentFor)}
          />
          <FilterSelect
            value={paymentTypeFilter}
            onChange={setPaymentTypeFilter}
            placeholder="All types"
            options={Object.values(PaymentType)}
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Clear filters
            </button>
          )}
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
                  {[
                    "ID",
                    "Rider",
                    "Driver",
                    "For",
                    "Type",
                    "Amount",
                    "Platform Fee",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const id = r._id ?? r.id ?? String(i);
                  return (
                    <tr
                      key={id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        #{id.slice(-6) || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <ArrowUpRight
                            size={12}
                            className="text-blue-400 shrink-0"
                          />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-25">
                            {r.rider ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <ArrowDownLeft
                            size={12}
                            className="text-emerald-400 shrink-0"
                          />
                          <span className="text-sm text-gray-700 truncate max-w-25">
                            {r.driver ?? "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                          {r.paymentFor ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full capitalize">
                          {r.paymentType ?? "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-900">
                          {r.amount != null ? `$${r.amount.toFixed(2)}` : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {r.platformFee != null
                            ? `$${r.platformFee.toFixed(2)}`
                            : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "text-xs font-medium px-2.5 py-1 rounded-full capitalize",
                            r.status
                              ? (STATUS_STYLES[r.status] ??
                                  "bg-gray-100 text-gray-600")
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50 flex-wrap gap-3">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>
              Page {meta?.page ?? page}
              {meta?.total != null ? ` · ${meta.total} total` : ""}
            </span>
            <label className="flex items-center gap-1.5">
              <span className="text-gray-400">Per page</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!(meta?.hasPrevPage ?? page > 1) || isLoading}
              className="flex items-center gap-1 text-xs font-medium text-gray-600 disabled:text-gray-300 hover:text-gray-900 disabled:cursor-not-allowed px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!(meta?.hasNextPage ?? false) || isLoading}
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

/** Compact filter dropdown shared by the three transaction filters. */
function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <div className="relative">
      <Filter
        size={12}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "text-xs font-medium pl-7 pr-7 py-2 border rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer transition-colors",
          value
            ? "border-primary/30 bg-primary/5 text-primary"
            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
        )}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {titleCase(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Page;
