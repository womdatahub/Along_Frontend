"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import {
  BadgeCheck,
  XCircle,
  RefreshCw,
  User,
  Car,
  ChevronDown,
  ChevronUp,
  FileText,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Loader2,
} from "lucide-react";
import { ConfirmActionModal } from "@/components";
import { DriverInfo } from "@/types";
import { requests } from "@/lib";
import { toast } from "sonner";
import Image from "next/image";

type Tab = "drivers" | "riders";

const Page = () => {
  const [activeTab, setActiveTab] = useState<Tab>("drivers");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionNotes, setActionNotes] = useState("");
  const [expandedRiderId, setExpandedRiderId] = useState<string | null>(null);
  const [riderKycProcessing, setRiderKycProcessing] = useState<string | null>(null);

  const {
    pendingKyc,
    isProcessingKYC,
    actions: { getpendingKyc, processDriverKYC },
  } = useAdmin(
    useShallow((s) => ({
      pendingKyc: s.pendingKyc,
      isProcessingKYC: s.isProcessingKYC,
      actions: s.actions,
    })),
  );

  useEffect(() => {
    getpendingKyc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drivers = pendingKyc?.drivers ?? [];
  const riders = pendingKyc?.riders ?? [];

  const tabs: { key: Tab; label: string; count: number; icon: React.ElementType }[] = [
    { key: "drivers", label: "Driver KYC", count: drivers.length, icon: Car },
    { key: "riders", label: "Rider KYC", count: riders.length, icon: User },
  ];

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">KYC Management</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Review and approve identity verification documents
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

      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4">
        {tabs.map((t) => (
          <div
            key={t.key}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4"
          >
            <div className="size-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <t.icon size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 font-heebo">{t.count}</p>
              <p className="text-sm text-gray-500">{t.label} pending</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <t.icon size={15} />
              {t.label}
              <span
                className={`ml-1 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  activeTab === t.key ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t.key === "drivers" ? drivers.length : riders.length}
              </span>
            </button>
          ))}
        </div>

        {/* Driver KYC list */}
        {activeTab === "drivers" && (
          <div className="divide-y divide-gray-50">
            {drivers.length === 0 ? (
              <EmptyState label="No driver KYC submissions pending" />
            ) : (
              drivers.map((driver: DriverInfo) => {
                const id = driver._id ?? driver.userId ?? "";
                const isExpanded = expandedId === id;
                const name = `${driver.firstName ?? ""} ${driver.lastName ?? ""}`.trim();
                return (
                  <div key={id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : id)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                          <User size={16} className="text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{name || "Unknown"}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">
                            {driver.driverSocialSecurityNumber
                              ? `SSN ending ···${driver.driverSocialSecurityNumber.slice(-4)}`
                              : "SSN not provided"}
                          </p>
                        </div>
                        <span className="text-gray-300 shrink-0 ml-1">
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </span>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <ConfirmActionModal
                          trigger={
                            <button className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                              <XCircle size={13} />
                              Reject
                            </button>
                          }
                          title="Reject KYC Submission"
                          description="Reject this driver's KYC documents?"
                          confirmActionFunction={async () => {
                            await processDriverKYC({
                              driverId: id,
                              action: "REJECT",
                              reason: actionNotes || "Does not meet requirements",
                            });
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
                          title="Approve KYC Submission"
                          description="Approve this driver's identity documents?"
                          confirmActionFunction={async () => {
                            await processDriverKYC({
                              driverId: id,
                              action: "APPROVE",
                              notes: actionNotes || undefined,
                            });
                          }}
                          type="reactivate"
                        />
                      </div>
                    </div>

                    {/* Expanded document preview */}
                    {isExpanded && (
                      <div className="mt-4 grid sm:grid-cols-3 gap-3">
                        {(
                          [
                            { label: "Front ID", url: driver.driverLincenseFrontViewUri },
                            { label: "Back ID", url: driver.driverLincenseBackViewUri },
                            { label: "Selfie", url: driver.driverProfilePictureUri },
                          ] as { label: string; url?: string }[]
                        ).map(({ label, url }) => (
                          <div key={label} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
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
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Notes (optional)"
                            value={actionNotes}
                            onChange={(e) => setActionNotes(e.target.value)}
                            className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Rider KYC list */}
        {activeTab === "riders" && (
          <div className="divide-y divide-gray-50">
            {riders.length === 0 ? (
              <EmptyState label="No rider KYC submissions pending" />
            ) : (
              riders.map((rider) => {
                const id = rider._id ?? rider.userId ?? "";
                const name = `${rider.firstName ?? ""} ${rider.lastName ?? ""}`.trim();
                const isExpanded = expandedRiderId === id;
                const isLoading = riderKycProcessing === id;

                const handleRiderKycAction = async (action: "APPROVE" | "REJECT") => {
                  setRiderKycProcessing(id);
                  try {
                    const { error } = await requests.admin.processRiderKyc({ riderId: id, action });
                    if (!error) {
                      toast.success(action === "APPROVE" ? "Rider KYC approved" : "Rider KYC rejected");
                      setExpandedRiderId(null);
                      await getpendingKyc();
                    } else {
                      toast.error("Action failed. Please try again.");
                    }
                  } finally {
                    setRiderKycProcessing(null);
                  }
                };

                return (
                  <div key={id} className="p-5">
                    {/* Row header */}
                    <div className="flex items-start justify-between gap-4">
                      <button
                        onClick={() => setExpandedRiderId(isExpanded ? null : id)}
                        className="flex items-center gap-3 min-w-0 flex-1 text-left"
                      >
                        {rider.profilePictureUri ? (
                          <Image
                            src={rider.profilePictureUri}
                            alt={name}
                            width={40}
                            height={40}
                            className="size-10 rounded-xl object-cover shrink-0"
                          />
                        ) : (
                          <div className="size-10 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                            <User size={16} className="text-violet-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{name || "Unknown"}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{rider.email ?? ""}</p>
                        </div>
                        <span className="text-gray-300 shrink-0 ml-1">
                          {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </span>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          disabled={isLoading}
                          onClick={() => handleRiderKycAction("REJECT")}
                          className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isLoading ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={13} />}
                          Reject
                        </button>
                        <button
                          disabled={isLoading}
                          onClick={() => handleRiderKycAction("APPROVE")}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {isLoading ? <Loader2 size={12} className="animate-spin" /> : <BadgeCheck size={13} />}
                          Approve
                        </button>
                      </div>
                    </div>

                    {/* Expanded rider review */}
                    {isExpanded && (
                      <div className="mt-4 space-y-4">
                        {/* Info grid */}
                        <div className="grid sm:grid-cols-2 gap-3">
                          {[
                            { icon: Mail, label: "Email", value: rider.email || "—" },
                            { icon: Phone, label: "Mobile", value: rider.mobileNumber || "—" },
                            {
                              icon: Calendar,
                              label: "Date of birth",
                              value: rider.dateOfBirth
                                ? new Date(rider.dateOfBirth).toLocaleDateString("en-US", {
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
                                ? rider.gender.charAt(0).toUpperCase() + rider.gender.slice(1)
                                : "—",
                            },
                          ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                              <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                                <Icon size={14} className="text-gray-400" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-400">{label}</p>
                                <p className="text-sm font-medium text-gray-900 mt-0.5">{value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* License details */}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            License Details
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {[
                              {
                                icon: CreditCard,
                                label: "License number",
                                value: rider.riderLicenseNumber || "—",
                              },
                              {
                                icon: Calendar,
                                label: "Expiry date",
                                value: rider.riderLicenseExpiryDate
                                  ? new Date(rider.riderLicenseExpiryDate).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })
                                  : "—",
                              },
                            ].map(({ icon: Icon, label, value }) => (
                              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                                <div className="size-8 rounded-lg bg-white flex items-center justify-center shrink-0">
                                  <Icon size={14} className="text-gray-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs text-gray-400">{label}</p>
                                  <p className="text-sm font-medium text-gray-900 mt-0.5 break-all">{value}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* License documents */}
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            License Documents
                          </p>
                          <div className="grid sm:grid-cols-3 gap-3">
                            {(
                              [
                                { label: "Front", url: rider.riderLicenseFrontViewUri },
                                { label: "Back", url: rider.riderLicenseBackViewUri },
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
                                  <img src={url} alt={label} className="w-full h-32 object-cover" />
                                ) : (
                                  <div className="h-32 flex flex-col items-center justify-center gap-1.5 text-gray-300">
                                    <FileText size={18} />
                                    <span className="text-xs">Not provided</span>
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
              })
            )}
          </div>
        )}
      </div>

      {isProcessingKYC && (
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

const EmptyState = ({ label }: { label: string }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-3">
    <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
      <BadgeCheck size={22} className="text-emerald-400" />
    </div>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);
