"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import {
  FileCheck,
  RefreshCw,
  BadgeCheck,
  XCircle,
  User,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { ConfirmActionModal } from "@/components";
import { requests } from "@/lib";
import { toast } from "sonner";
import { RiderProfile } from "@/types";

const Page = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    pendingKyc,
    actions: { getpendingKyc },
  } = useAdmin(
    useShallow((s) => ({
      pendingKyc: s.pendingKyc,
      actions: s.actions,
    })),
  );

  useEffect(() => {
    getpendingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // riderLicenses comes from pendingKyc — typed as unknown[] in the shared type
  const licenses = (pendingKyc?.riderLicenses ?? []) as RiderProfile[];

  const processLicense = async (
    riderId: string,
    action: "APPROVE" | "REJECT",
    reason?: string,
  ) => {
    setIsProcessing(true);
    const { error } = await requests.admin.processRiderLicense({
      riderId,
      action,
      reason,
    });
    setIsProcessing(false);
    if (!error) {
      toast.success(
        action === "APPROVE" ? "License approved" : "License rejected",
      );
      getpendingKyc();
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">
            License Approvals
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Verify and approve rider driving licences
          </p>
        </div>
        <button
          onClick={() => getpendingKyc()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 w-fit">
        <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <FileCheck size={18} className="text-blue-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 font-heebo">
            {licenses.length}
          </p>
          <p className="text-sm text-gray-500">Licences pending review</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <FileCheck size={16} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">
            Pending Licences
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {licenses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <BadgeCheck size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm text-gray-400">No licence submissions pending</p>
            </div>
          ) : (
            licenses.map((rider) => {
              const id = rider._id ?? "";
              const name =
                `${rider.firstName ?? ""} ${rider.lastName ?? ""}`.trim();
              const isExpanded = expandedId === id;

              return (
                <div key={id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                        <User size={16} className="text-violet-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {name || "Unknown Rider"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">
                          {rider.email ?? "No email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : id)
                        }
                        className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        View docs
                        {isExpanded ? (
                          <ChevronUp size={12} />
                        ) : (
                          <ChevronDown size={12} />
                        )}
                      </button>
                      <ConfirmActionModal
                        trigger={
                          <button className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                            <XCircle size={13} />
                            Reject
                          </button>
                        }
                        title="Reject Licence"
                        description="Reject this rider's licence submission?"
                        confirmActionFunction={async () => {
                          await processLicense(id, "REJECT");
                        }}
                        type="suspend"
                      />
                      <ConfirmActionModal
                        trigger={
                          <button className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                            <BadgeCheck size={13} />
                            Approve
                          </button>
                        }
                        title="Approve Licence"
                        description="Approve this rider's driving licence?"
                        confirmActionFunction={async () => {
                          await processLicense(id, "APPROVE");
                        }}
                        type="reactivate"
                      />
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 grid sm:grid-cols-3 gap-3">
                      {(
                        [
                          {
                            label: "Front",
                            url: rider.riderLicenseFrontViewUri,
                          },
                          {
                            label: "Back",
                            url: rider.riderLicenseBackViewUri,
                          },
                          { label: "Selfie", url: rider.riderLicenseSelfieUri },
                        ] as { label: string; url?: string }[]
                      ).map(({ label, url }) => (
                        <div
                          key={label}
                          className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50"
                        >
                          <p className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100">
                            {label}
                          </p>
                          {url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={url}
                              alt={label}
                              className="w-full h-32 object-cover"
                            />
                          ) : (
                            <div className="h-32 flex items-center justify-center gap-2 text-gray-300">
                              <FileText size={18} />
                              <span className="text-xs">Not provided</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-xl">
            <p className="text-sm font-semibold text-gray-700">Processing…</p>
          </div>
        </div>
      )}
    </section>
  );
};

export default Page;
