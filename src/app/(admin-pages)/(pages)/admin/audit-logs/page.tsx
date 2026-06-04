"use client";

import { useEffect, useState, useCallback } from "react";
import { ScrollText, RefreshCw, Search, Filter } from "lucide-react";
import { requests } from "@/lib";
import { cn } from "@/lib";
import { PaginationBar } from "@/components";

/** Shape returned by GET /admin/api/v1/activities/recent */
type ActivityLog = {
  _id: string;
  actorId: string;
  actorType: string;
  actorRole: string;
  action: string;
  category: string;
  targetType?: string;
  metadata?: Record<string, unknown>;
  requestMetadata?: {
    ip?: string;
    userAgent?: string;
    requestId?: string;
    path?: string;
    method?: string;
  };
  sourceService?: string;
  createdAt: string;
};

type CategoryFilter = "all" | string;

/** Map the dot-notation action (e.g. "kyc.ssn.viewed") to a badge style */
const ACTION_STYLES: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-700",
  created: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  deleted: "bg-rose-50 text-rose-700",
  suspended: "bg-amber-50 text-amber-700",
  updated: "bg-blue-50 text-blue-700",
  viewed: "bg-gray-50 text-gray-600",
  login: "bg-gray-50 text-gray-600",
  exported: "bg-violet-50 text-violet-700",
  reactivated: "bg-teal-50 text-teal-700",
};

const CATEGORY_FILTER_OPTIONS = [
  "COMPLIANCE",
  "USER_MANAGEMENT",
  "SYSTEM",
  "PAYMENTS",
  "OPERATIONS",
];

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

function actionStyle(action: string): string {
  const verb = action.split(".").pop()?.toLowerCase() ?? "";
  const key = Object.keys(ACTION_STYLES).find((k) => verb.includes(k));
  return key ? ACTION_STYLES[key] : "bg-gray-50 text-gray-600";
}

function fmtTs(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

const Page = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState<{
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Pure fetch — no setState; all state updates happen in .then() callbacks
  const fetchLogs = useCallback(async (nextPage: number, size: number) => {
    const { data } = await requests.admin.getAuditLogs({
      page: nextPage,
      pageSize: size,
      limit: size,
      offset: (nextPage - 1) * size,
    });
    return data;
  }, []);

  // Re-fetch from page 1 when category filter or page-size changes
  useEffect(() => {
    let alive = true;
    fetchLogs(1, pageSize).then((data) => {
      if (!alive) return;
      setIsLoading(false);
      setPage(1);
      if (data?.data) {
        const raw = Array.isArray(data.data)
          ? data.data
          : (((data.data as Record<string, unknown>)
              .activities as ActivityLog[]) ?? []);
        setLogs(raw as ActivityLog[]);
        setMeta((data.pagination ?? data.meta) ?? null);
      }
    });
    return () => {
      alive = false;
    };
  }, [categoryFilter, pageSize, fetchLogs]);

  // Re-fetch when the user navigates to a different page
  useEffect(() => {
    if (page === 1) return;
    let alive = true;
    fetchLogs(page, pageSize).then((data) => {
      if (!alive) return;
      setIsLoading(false);
      if (data?.data) {
        const raw = Array.isArray(data.data)
          ? data.data
          : (((data.data as Record<string, unknown>)
              .activities as ActivityLog[]) ?? []);
        setLogs(raw as ActivityLog[]);
        setMeta((data.pagination ?? data.meta) ?? null);
      }
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchLogs(page, pageSize).then((data) => {
      setIsLoading(false);
      if (data?.data) {
        const raw = Array.isArray(data.data)
          ? data.data
          : (((data.data as Record<string, unknown>)
              .activities as ActivityLog[]) ?? []);
        setLogs(raw as ActivityLog[]);
        setMeta((data.pagination ?? data.meta) ?? null);
      }
    });
  };

  const filtered = logs.filter((l) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      l.actorRole.toLowerCase().includes(q) ||
      l.actorId.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      (l.category ?? "").toLowerCase().includes(q) ||
      (l.targetType ?? "").toLowerCase().includes(q);
    const matchesCategory =
      categoryFilter === "all" || l.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">
            Audit Logs
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Track all administrative actions across the platform
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 px-5 py-4 border-b border-gray-50">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by actor, action, category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm pl-8 pr-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl border transition-colors",
              showFilters
                ? "border-primary text-primary bg-primary/5"
                : "border-gray-200 text-gray-600 hover:bg-gray-50",
            )}
          >
            <Filter size={13} />
            Filter
            {categoryFilter !== "all" && (
              <span className="size-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                1
              </span>
            )}
          </button>
        </div>

        {/* Filter bar */}
        {showFilters && (
          <div className="px-5 py-3 flex flex-wrap gap-2 border-b border-gray-50 bg-gray-50/40">
            <button
              onClick={() => {
                setIsLoading(true);
                setCategoryFilter("all");
              }}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                categoryFilter === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
              )}
            >
              All categories
            </button>
            {CATEGORY_FILTER_OPTIONS.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setIsLoading(true);
                  setCategoryFilter(c);
                }}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                  categoryFilter === c
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
                )}
              >
                {c.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        )}

        {/* Table */}
        {isLoading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw size={22} className="text-gray-300 animate-spin" />
            <p className="text-sm text-gray-400">Loading activity logs…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <ScrollText size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No activity logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Timestamp",
                    "Actor",
                    "Action",
                    "Category",
                    "Target",
                    "IP",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const { date, time } = fmtTs(log.createdAt);
                  return (
                    <tr
                      key={log._id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                    >
                      {/* Timestamp */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <p className="text-xs font-medium text-gray-700">
                          {date}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {time}
                        </p>
                      </td>

                      {/* Actor */}
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                          {log.actorRole}
                        </p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          #{log.actorId.slice(-8)}
                        </p>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-3.5">
                        <span
                          className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-full font-mono",
                            actionStyle(log.action),
                          )}
                        >
                          {log.action}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                          {log.category?.replace(/_/g, " ") ?? "—"}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="px-5 py-3.5">
                        {log.targetType ? (
                          <p className="text-sm text-gray-700 capitalize">
                            {log.targetType}
                          </p>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>

                      {/* IP */}
                      <td className="px-5 py-3.5">
                        <p className="text-xs text-gray-400 font-mono">
                          {log.requestMetadata?.ip?.replace(/^::ffff:/, "") ??
                            "—"}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <PaginationBar
            page={page}
            meta={meta}
            pageSize={pageSize}
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            onPageSizeChange={(size) => {
              setIsLoading(true);
              setPageSize(size);
            }}
            isLoading={isLoading}
            onPrev={() => {
              setIsLoading(true);
              setPage((p) => Math.max(1, p - 1));
            }}
            onNext={() => {
              setIsLoading(true);
              setPage((p) => p + 1);
            }}
          />
        )}
      </div>
    </section>
  );
};

export default Page;
