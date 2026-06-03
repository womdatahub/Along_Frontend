"use client";

import { useAdmin } from "@/store";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import {
  AlertTriangle,
  Phone,
  RefreshCw,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ConfirmActionModal } from "@/components";

const Page = () => {
  const {
    sosAlerts,
    actions: { getSOSAlerts, resolveSOSAlert },
  } = useAdmin(
    useShallow((state) => ({
      sosAlerts: state.sosAlerts,
      actions: state.actions,
    })),
  );

  useEffect(() => {
    getSOSAlerts();
  }, []);

  const openAlerts = sosAlerts.filter(
    (a) => !a.status || a.status === "open" || a.status === "active",
  );

  const resolvedAlerts = sosAlerts.filter(
    (a) => a.status === "resolved" || a.status === "closed",
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold font-heebo text-gray-900">
          SOS Console
        </p>
        <button
          onClick={getSOSAlerts}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Open Alerts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <div className="size-2 bg-rose-500 rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-gray-900">Open Alerts</p>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-medium">
            {openAlerts.length} active
          </span>
        </div>

        {openAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
              <CheckCircle size={22} className="text-emerald-400" />
            </div>
            <p className="text-sm text-gray-400">No active SOS alerts</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {openAlerts.map((alert) => {
              const alertId = alert.tripID ?? alert._id ?? alert.id ?? "";
              return (
                <div
                  key={alertId}
                  className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                        <AlertTriangle size={15} className="text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Trip {alertId || "—"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          SOS triggered
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">Driver</span>
                      <span className="text-xs font-medium text-gray-700">
                        {alert.driver ?? "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-12">Rider</span>
                      <span className="text-xs font-medium text-gray-700">
                        {alert.rider ?? "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors flex-1 justify-center">
                      <Phone size={12} />
                      Call driver
                    </button>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors flex-1 justify-center">
                      <Phone size={12} />
                      Call rider
                    </button>
                    <ConfirmActionModal
                      trigger={
                        <button className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                          Resolve
                        </button>
                      }
                      title="Resolve SOS Alert"
                      description="Mark this SOS alert as resolved?"
                      confirmActionFunction={async () => {
                        await resolveSOSAlert({
                          alertId,
                          resolution: "Resolved by admin",
                        });
                      }}
                      type="reactivate"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert Log */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <Clock size={15} className="text-gray-400" />
          <p className="text-sm font-semibold text-gray-900">Alert Log</p>
        </div>

        {resolvedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <AlertTriangle size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No alert history</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Initiator
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Trip ID
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Timestamp
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {resolvedAlerts.map((alert, i) => (
                  <tr
                    key={alert._id ?? alert.id ?? i}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-lg bg-rose-50 flex items-center justify-center">
                          <AlertTriangle size={11} className="text-rose-500" />
                        </div>
                        <span className="text-sm text-gray-700 capitalize">
                          {alert.type ?? "SOS alert"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.initiator ?? alert.rider ?? "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500 font-mono">
                        {alert.tripID ?? alert._id ?? "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-500">
                        {alert.timeStamp ?? "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                        {alert.status ?? "resolved"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
