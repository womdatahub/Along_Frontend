"use client";

import { ConfirmActionModal } from "@/components/";
import { useAdmin } from "@/store";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import {
  Search,
  Users,
  UserX,
  ChevronDown,
  ChevronUp,
  FileText,
  BadgeCheck,
  XCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";
import { requests } from "@/lib";
import { toast } from "sonner";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "suspended"
  >("active");
  const [expandedKycId, setExpandedKycId] = useState<string | null>(null);
  const [kycProcessing, setKycProcessing] = useState<string | null>(null);

  const {
    actions: {
      getAllRiders,
      getSuspendedRiders,
      getpendingKyc,
      suspendDriverOrRider,
      reactivateDriverOrRider,
    },
    allRiders,
    suspendedRiders,
    pendingKyc,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allRiders: state.allRiders,
      suspendedRiders: state.suspendedRiders,
      pendingKyc: state.pendingKyc,
    })),
  );

  useEffect(() => {
    getAllRiders();
    getSuspendedRiders();
    getpendingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRiders = allRiders.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.rider?.firstName?.toLowerCase().includes(q) ||
      r.rider?.lastName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q)
    );
  });

  const tabs = [
    { key: "active" as const, label: "Active riders", count: allRiders.length },
    {
      key: "pending" as const,
      label: "Pending KYC",
      count: pendingKyc?.riders.length ?? 0,
    },
    {
      key: "suspended" as const,
      label: "Suspended",
      count: suspendedRiders.length,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-2xl font-bold font-heebo text-gray-900">Riders</p>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search riders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 h-10 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? "bg-primary/10 text-primary"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active riders */}
      {activeTab === "active" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredRiders.length === 0 ? (
            <EmptyState icon={Users} message="No active riders found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Rider
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Contact
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Gender
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRiders.map((rider, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-primary uppercase">
                              {(rider.rider.firstName?.[0] ?? "") +
                                (rider.rider.lastName?.[0] ?? "")}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {rider.rider.firstName} {rider.rider.lastName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {rider.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {rider.mobileNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 capitalize">
                          {rider.gender || "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ConfirmActionModal
                            trigger={
                              <button className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                                Suspend
                              </button>
                            }
                            title="Suspend rider"
                            description="Are you sure you want to suspend this rider?"
                            confirmActionFunction={async (values) => {
                              if (!values) return;
                              await suspendDriverOrRider(
                                {
                                  userId: rider.rider.userId,
                                  reason: values.reason!,
                                  suspensionType:
                                    values.suspensionType!.toUpperCase() as
                                      | "TEMPORARY"
                                      | "PERMANENT",
                                  suspensionDuration: Number(
                                    values.suspensionDuration,
                                  ),
                                },
                                "rider",
                              );
                            }}
                            type="suspend"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Pending KYC */}
      {activeTab === "pending" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {!pendingKyc || pendingKyc.riders.length === 0 ? (
            <EmptyState icon={Users} message="No pending KYC applications" />
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingKyc.riders.map((rider, i) => {
                const riderId = rider._id ?? rider.userId ?? String(i);
                const isExpanded = expandedKycId === riderId;
                const isLoading = kycProcessing === riderId;

                const handleKycAction = async (
                  action: "APPROVE" | "REJECT",
                ) => {
                  setKycProcessing(riderId);
                  try {
                    const { error } = await requests.admin.processRiderKyc({
                      riderId,
                      action,
                    });
                    if (!error) {
                      toast.success(
                        action === "APPROVE"
                          ? "KYC approved successfully"
                          : "KYC rejected",
                      );
                      setExpandedKycId(null);
                      await getpendingKyc();
                    } else {
                      toast.error("Action failed. Please try again.");
                    }
                  } finally {
                    setKycProcessing(null);
                  }
                };

                return (
                  <div key={riderId} className="p-5">
                    {/* Row header */}
                    <div className="flex items-center justify-between gap-4">
                      <button
                        onClick={() =>
                          setExpandedKycId(isExpanded ? null : riderId)
                        }
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        {rider.profilePictureUri ? (
                          <Image
                            src={rider.profilePictureUri}
                            alt={`${rider.firstName} ${rider.lastName}`}
                            width={36}
                            height={36}
                            className="size-9 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                            <User size={16} className="text-violet-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {rider.firstName} {rider.lastName}
                          </p>
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                            Pending review
                          </span>
                        </div>
                        <span className="text-gray-300 shrink-0 ml-2">
                          {isExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </span>
                      </button>

                      {/* Quick action buttons visible even when collapsed */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={isLoading}
                          onClick={() => handleKycAction("REJECT")}
                          className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <XCircle size={12} />
                          )}
                          Reject
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={() => handleKycAction("APPROVE")}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isLoading ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <BadgeCheck size={12} />
                          )}
                          Approve
                        </button>
                      </div>
                    </div>

                    {/* Expanded rider review */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {/* Info fields */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            {
                              icon: Mail,
                              label: "Email",
                              value: rider.email || "—",
                            },
                            {
                              icon: Phone,
                              label: "Mobile",
                              value: rider.mobileNumber || "—",
                            },
                            {
                              icon: Calendar,
                              label: "Date of birth",
                              value: rider.dateOfBirth
                                ? new Date(
                                    rider.dateOfBirth,
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "—",
                            },
                            {
                              icon: User,
                              label: "Gender",
                              value: rider.gender
                                ? rider.gender.charAt(0).toUpperCase() +
                                  rider.gender.slice(1)
                                : "—",
                            },
                          ].map(({ icon: Icon, label, value }) => (
                            <div
                              key={label}
                              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                            >
                              <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                                <Icon size={14} className="text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{label}</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">
                                  {value}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* License images */}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            License Documents
                          </p>
                          <div className="grid sm:grid-cols-3 gap-3">
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
                                {
                                  label: "Selfie",
                                  url: rider.riderLicenseSelfieUri,
                                },
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
                                  <div className="h-32 flex flex-col items-center justify-center gap-1.5 text-gray-300">
                                    <FileText size={18} />
                                    <span className="text-xs">
                                      Not provided
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Suspended */}
      {activeTab === "suspended" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {suspendedRiders.length === 0 ? (
            <EmptyState icon={UserX} message="No suspended riders" />
          ) : (
            <div className="divide-y divide-gray-50">
              {suspendedRiders.map((rider) => (
                <div
                  key={rider.rider.userId}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-rose-500 uppercase">
                        {(rider.rider.firstName?.[0] ?? "") +
                          (rider.rider.lastName?.[0] ?? "")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {rider.rider.firstName} {rider.rider.lastName}
                      </p>
                      <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        Suspended
                      </span>
                    </div>
                  </div>
                  <ConfirmActionModal
                    trigger={
                      <button className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                        Reactivate
                      </button>
                    }
                    title="Reactivate rider"
                    description="Are you sure you want to reactivate this rider?"
                    confirmActionFunction={async () => {
                      await reactivateDriverOrRider(
                        { userId: rider.rider.userId },
                        "rider",
                      );
                    }}
                    type="reactivate"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Page;

const EmptyState = ({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
      <Icon size={22} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400">{message}</p>
  </div>
);
