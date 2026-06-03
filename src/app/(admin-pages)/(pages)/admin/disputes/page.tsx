"use client";

import { useEffect, useState } from "react";
import {
  Scale,
  RefreshCw,
  Search,
  MessageSquare,
  CheckCircle,
  Clock,
  Car,
  User,
} from "lucide-react";
import { requests } from "@/lib";
import { cn } from "@/lib";

type DisputeStatus = "open" | "under_review" | "resolved" | "escalated";
type DisputeOutcome = "REFUND" | "NO_REFUND" | "PARTIAL_REFUND";

type Dispute = {
  id: string;
  rentalId: string;
  riderName: string;
  driverName: string;
  amount: number;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
  resolvedAt?: string;
  outcome?: DisputeOutcome;
};

type Tab = "open" | "resolved";

const STATUS_STYLES: Record<DisputeStatus, string> = {
  open: "bg-rose-50 text-rose-700",
  under_review: "bg-amber-50 text-amber-700",
  resolved: "bg-emerald-50 text-emerald-700",
  escalated: "bg-violet-50 text-violet-700",
};

const Page = () => {
  const [activeTab, setActiveTab] = useState<Tab>("open");
  const [searchQuery, setSearchQuery] = useState("");
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [selectedOutcome, setSelectedOutcome] =
    useState<DisputeOutcome>("REFUND");
  const [isResolving, setIsResolving] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [meta, setMeta] = useState<{
    page: number;
    pageSize: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | null>(null);

  const loadDisputes = async (nextPage: number = page) => {
    setIsLoading(true);
    const { data } = await requests.admin.getDisputes({
      page: nextPage,
      pageSize,
      limit: pageSize,
      offset: (nextPage - 1) * pageSize,
    });
    setIsLoading(false);
    if (data?.data) {
      setDisputes(data.data as Dispute[]);
      setMeta(data.meta ?? null);
    }
  };

  const resolveDispute = async () => {
    if (!selected) return;
    setIsResolving(true);
    const { error } = await requests.admin.resolveDispute({
      disputeId: selected.id,
      resolution: resolutionNote,
      outcome: selectedOutcome,
    });
    setIsResolving(false);
    if (!error) {
      setSelected(null);
      setResolutionNote("");
      loadDisputes();
    }
  };

  useEffect(() => {
    loadDisputes(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const open = disputes.filter(
    (d) =>
      d.status === "open" ||
      d.status === "under_review" ||
      d.status === "escalated",
  );
  const resolved = disputes.filter((d) => d.status === "resolved");
  const current = activeTab === "open" ? open : resolved;
  const filtered = current.filter(
    (d) =>
      d.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.rentalId.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">
            Disputes
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage rental disputes and payment conflicts
          </p>
        </div>
        <button
          onClick={() => loadDisputes(page)}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            label: "Open Disputes",
            value: open.length,
            color: "text-rose-600",
            bg: "bg-rose-50",
          },
          {
            label: "Under Review",
            value: disputes.filter((d) => d.status === "under_review").length,
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
          {
            label: "Resolved",
            value: resolved.length,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div
              className={`size-10 rounded-xl ${s.bg} flex items-center justify-center`}
            >
              <Scale size={18} className={s.color} />
            </div>
            <div>
              <p className={`text-2xl font-bold font-heebo ${s.color}`}>
                {s.value}
              </p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* List panel */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["open", "resolved"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 px-4 py-3.5 text-sm font-semibold transition-colors border-b-2 capitalize ${
                  activeTab === t
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "open"
                  ? `Open (${open.length})`
                  : `Resolved (${resolved.length})`}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-50 max-w-sm">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search disputes…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm pl-8 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Dispute rows */}
          <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="size-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  <Scale size={18} className="text-gray-300" />
                </div>
                <p className="text-sm text-gray-400">No disputes found</p>
              </div>
            ) : (
              filtered.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelected(d)}
                  className={cn(
                    "w-full text-left px-4 py-4 hover:bg-gray-50 transition-colors",
                    selected?.id === d.id && "bg-primary/5",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-xs font-mono text-gray-400">
                          #{d.rentalId.slice(-6)}
                        </p>
                        <span
                          className={cn(
                            "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                            STATUS_STYLES[d.status],
                          )}
                        >
                          {d.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {d.reason}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <User size={11} />
                          {d.riderName}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Car size={11} />
                          {d.driverName}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-gray-900">
                        ${d.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {d.createdAt}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail / resolve panel */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-5 sticky top-24">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {selected.reason}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Rental #{selected.rentalId.slice(-6)}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full capitalize shrink-0",
                    STATUS_STYLES[selected.status],
                  )}
                >
                  {selected.status.replace("_", " ")}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  { label: "Rider", value: selected.riderName, icon: User },
                  { label: "Driver", value: selected.driverName, icon: Car },
                  {
                    label: "Amount",
                    value: `$${selected.amount.toFixed(2)}`,
                    icon: Scale,
                  },
                  { label: "Filed", value: selected.createdAt, icon: Clock },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="size-6 rounded-lg bg-gray-50 flex items-center justify-center">
                      <Icon size={12} className="text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 w-12 shrink-0">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {selected.status !== "resolved" && (
                <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">
                    Resolve dispute
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        "REFUND",
                        "PARTIAL_REFUND",
                        "NO_REFUND",
                      ] as DisputeOutcome[]
                    ).map((o) => (
                      <button
                        key={o}
                        onClick={() => setSelectedOutcome(o)}
                        className={cn(
                          "text-xs font-semibold py-2 rounded-xl border transition-all",
                          selectedOutcome === o
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-200 text-gray-600 hover:border-gray-300",
                        )}
                      >
                        {o === "NO_REFUND"
                          ? "No refund"
                          : o === "PARTIAL_REFUND"
                            ? "Partial"
                            : "Full refund"}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={3}
                    placeholder="Resolution notes…"
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(null)}
                      className="flex-1 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={resolveDispute}
                      disabled={isResolving || !resolutionNote}
                      className="flex-1 text-sm font-semibold text-white bg-primary hover:bg-primary-deep disabled:opacity-60 rounded-xl py-2.5 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle size={14} />
                      {isResolving ? "Resolving…" : "Resolve"}
                    </button>
                  </div>
                </div>
              )}

              {selected.status === "resolved" && selected.outcome && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle size={14} />
                    <p className="text-sm font-semibold">
                      Resolved —{" "}
                      {selected.outcome.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                  {selected.resolvedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      {selected.resolvedAt}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <MessageSquare size={20} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">
                Select a dispute to review
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
