"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ScrollText,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { requests } from "@/lib";
import { cn } from "@/lib";

type AuditLog = {
  id: string;
  action: string;
  adminId: string;
  adminName: string;
  targetEntity?: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
};

type ActionFilter = "all" | string;

const ACTION_STYLES: Record<string, string> = {
  CREATE: "bg-emerald-50 text-emerald-700",
  UPDATE: "bg-blue-50 text-blue-700",
  DELETE: "bg-rose-50 text-rose-700",
  APPROVE: "bg-emerald-50 text-emerald-700",
  REJECT: "bg-rose-50 text-rose-700",
  SUSPEND: "bg-amber-50 text-amber-700",
  REACTIVATE: "bg-teal-50 text-teal-700",
  LOGIN: "bg-gray-50 text-gray-600",
  EXPORT: "bg-violet-50 text-violet-700",
};

const ACTION_FILTER_OPTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "APPROVE",
  "REJECT",
  "SUSPEND",
  "REACTIVATE",
  "LOGIN",
];

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const Page = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all");
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

  const loadLogs = useCallback(
    async (nextPage: number, size: number) => {
      setIsLoading(true);
      const { data } = await requests.admin.getAuditLogs({
        page: nextPage,
        pageSize: size,
        limit: size,
        offset: (nextPage - 1) * size,
        action: actionFilter !== "all" ? actionFilter : undefined,
      });
      setIsLoading(false);
      if (data?.data) {
        setLogs(data.data as AuditLog[]);
        setMeta(data.meta ?? null);
      }
    },
    [actionFilter],
  );

  // Reload from page 1 whenever the action filter or page size changes
  useEffect(() => {
    setPage(1);
    loadLogs(1, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, pageSize]);

  // Page changes (only fires after the initial render — first render handled above)
  useEffect(() => {
    if (page === 1) return;
    loadLogs(page, pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleRefresh = () => {
    loadLogs(page, pageSize);
  };

  const filtered = logs.filter(
    (l) =>
      l.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.targetEntity ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (l.targetId ?? "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const actionStyle = (action: string) => {
    const key = Object.keys(ACTION_STYLES).find((k) =>
      action.toUpperCase().includes(k),
    );
    return key ? ACTION_STYLES[key] : "bg-gray-50 text-gray-600";
  };

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
              placeholder="Search by admin, action, entity…"
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
            {actionFilter !== "all" && (
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
              onClick={() => setActionFilter("all")}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all",
                actionFilter === "all"
                  ? "border-primary bg-primary text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
              )}
            >
              All actions
            </button>
            {ACTION_FILTER_OPTIONS.map((a) => (
              <button
                key={a}
                onClick={() => setActionFilter(a)}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all capitalize",
                  actionFilter === a
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
                )}
              >
                {a.toLowerCase()}
              </button>
            ))}
          </div>
        )}

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <ScrollText size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">
              {isLoading ? "Loading logs…" : "No audit logs found"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {[
                    "Timestamp",
                    "Admin",
                    "Action",
                    "Target",
                    "Details",
                    "IP",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-5 py-3.5"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <p className="text-xs text-gray-400 font-mono">
                        {log.createdAt}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-gray-900 truncate max-w-30">
                          {log.adminName}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          #{log.adminId.slice(-6)}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2.5 py-1 rounded-full",
                          actionStyle(log.action),
                        )}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {log.targetEntity ? (
                        <div>
                          <p className="text-sm text-gray-700 capitalize">
                            {log.targetEntity}
                          </p>
                          {log.targetId && (
                            <p className="text-xs text-gray-400 font-mono">
                              #{log.targetId.slice(-6)}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 max-w-50">
                      <p
                        className="text-sm text-gray-500 truncate"
                        title={log.details}
                      >
                        {log.details ?? "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs text-gray-400 font-mono">
                        {log.ipAddress ?? "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 flex-wrap gap-3">
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
        )}
      </div>
    </section>
  );
};

export default Page;
