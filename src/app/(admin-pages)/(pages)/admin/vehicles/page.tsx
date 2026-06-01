"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import {
  Truck,
  RefreshCw,
  BadgeCheck,
  XCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ConfirmActionModal } from "@/components";
import { requests } from "@/lib";
import { toast } from "sonner";
import { VehicleInfo } from "@/types";
import Image from "next/image";

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

  const vehicles: VehicleInfo[] = pendingKyc?.vehicles ?? [];

  const processVehicle = async (
    vehicleId: string,
    action: "APPROVE" | "REJECT",
    reason?: string,
  ) => {
    setIsProcessing(true);
    const { error } = await requests.admin.processVehicleVerification({
      vehicleId,
      action,
      reason,
    });
    setIsProcessing(false);
    if (!error) {
      toast.success(
        action === "APPROVE" ? "Vehicle approved" : "Vehicle rejected",
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
            Vehicle Approvals
          </p>
          <p className="text-sm text-gray-500 mt-0.5">
            Inspect and approve driver vehicle registrations
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

      {/* Counter */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 w-fit">
        <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center">
          <Truck size={18} className="text-indigo-600" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 font-heebo">
            {vehicles.length}
          </p>
          <p className="text-sm text-gray-500">Vehicles pending inspection</p>
        </div>
      </div>

      {/* Vehicle list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <Truck size={16} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">
            Pending Vehicles
          </p>
        </div>

        <div className="divide-y divide-gray-50">
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <BadgeCheck size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm text-gray-400">No vehicles pending approval</p>
            </div>
          ) : (
            vehicles.map((vehicle) => {
              const id = vehicle._id ?? vehicle.vehicleId ?? "";
              const isExpanded = expandedId === id;
              const label = [
                vehicle.vehicleYear,
                vehicle.vehicleMake,
                vehicle.vehicleModel,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <div key={id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {vehicle.vehicleSideViewImageUri ? (
                        <Image
                          src={vehicle.vehicleSideViewImageUri}
                          alt={label}
                          width={56}
                          height={56}
                          className="size-14 rounded-xl object-cover shrink-0 border border-gray-100"
                        />
                      ) : (
                        <div className="size-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                          <Truck size={22} className="text-indigo-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 capitalize">
                          {label || "Unknown Vehicle"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">
                          VIN: {vehicle.vehicleIdentificationNumber ?? "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">
                          {vehicle.vehicleColor ?? ""} · {vehicle.vehicleClass ?? ""}
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
                        Details
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
                        title="Reject Vehicle"
                        description="Reject this vehicle registration?"
                        confirmActionFunction={async () => {
                          await processVehicle(id, "REJECT");
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
                        title="Approve Vehicle"
                        description="Approve this vehicle for the platform?"
                        confirmActionFunction={async () => {
                          await processVehicle(id, "APPROVE");
                        }}
                        type="reactivate"
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="mt-4 grid sm:grid-cols-2 gap-3">
                      {vehicle.vehicleFrontViewImageUri && (
                        <div className="rounded-xl overflow-hidden border border-gray-100">
                          <p className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100 bg-gray-50">
                            Front view
                          </p>
                          <Image
                            src={vehicle.vehicleFrontViewImageUri}
                            alt="Front"
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}
                      {vehicle.vehicleBackViewImageUri && (
                        <div className="rounded-xl overflow-hidden border border-gray-100">
                          <p className="text-xs font-medium text-gray-500 px-3 py-2 border-b border-gray-100 bg-gray-50">
                            Back view
                          </p>
                          <Image
                            src={vehicle.vehicleBackViewImageUri}
                            alt="Back"
                            width={400}
                            height={200}
                            className="w-full h-40 object-cover"
                          />
                        </div>
                      )}
                      <div className="sm:col-span-2 bg-gray-50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          { label: "Make", value: vehicle.vehicleMake },
                          { label: "Model", value: vehicle.vehicleModel },
                          { label: "Year", value: vehicle.vehicleYear },
                          { label: "Color", value: vehicle.vehicleColor },
                          { label: "Class", value: vehicle.vehicleClass },
                          {
                            label: "VIN",
                            value: vehicle.vehicleIdentificationNumber,
                          },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <p className="text-xs text-gray-400">{label}</p>
                            <p className="text-sm font-medium text-gray-800 capitalize">
                              {value ?? "—"}
                            </p>
                          </div>
                        ))}
                      </div>
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
