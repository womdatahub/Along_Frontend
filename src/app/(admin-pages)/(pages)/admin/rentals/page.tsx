"use client";

import { useAdmin } from "@/store";
import type { ActiveRental } from "@/store/use-admin";
import { useShallow } from "zustand/shallow";
import { useEffect } from "react";
import { Activity, RefreshCw, MapPin, Clock, Car } from "lucide-react";

type ActiveRentalRow = {
  id: string;
  riderName: string;
  driverName: string;
  vehicleLabel: string;
  pickupAddress: string;
  startedAt: string;
  duration: string;
  status: string;
};

const str = (v: unknown): string => (typeof v === "string" ? v : "—");

const toRow = (r: ActiveRental): ActiveRentalRow => {
  const id = str(r._id ?? r.id ?? r.rentalId);
  const startTime = str(r.startTime);
  let duration = "—";
  if (startTime !== "—") {
    const mins = Math.round((Date.now() - new Date(startTime).getTime()) / 60_000);
    duration = mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }
  return {
    id,
    riderName: str(r.riderId),
    driverName: str(r.driverId),
    vehicleLabel: "—",
    pickupAddress: str(r.pickup),
    startedAt: startTime,
    duration,
    status: str(r.status ?? "active"),
  };
};

const Page = () => {
  const {
    activeRentals,
    actions: { getActiveRentals },
  } = useAdmin(
    useShallow((s) => ({ activeRentals: s.activeRentals, actions: s.actions })),
  );

  useEffect(() => {
    getActiveRentals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rentals: ActiveRentalRow[] = activeRentals.map(toRow);

  const stats = [
    { label: "Active Now", value: rentals.length, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Scheduled Today", value: 0, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Ending Soon", value: 0, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <section className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-2xl font-bold font-heebo text-gray-900">Active Rentals</p>
          <p className="text-sm text-gray-500 mt-0.5">
            Monitor ongoing rental sessions in real time
          </p>
        </div>
        <button
          onClick={() => getActiveRentals()}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-1"
          >
            <p className={`text-3xl font-bold font-heebo ${s.color}`}>
              {s.value}
            </p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Rentals table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50">
          <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
          <p className="text-sm font-semibold text-gray-900">Live Rentals</p>
        </div>

        {rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Activity size={22} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">No active rentals right now</p>
            <p className="text-xs text-gray-300">Data updates automatically on refresh</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Rental ID", "Rider", "Driver", "Vehicle", "Pick-up", "Duration", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-mono text-gray-700">#{r.id.slice(-6)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{r.riderName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="size-7 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Car size={12} className="text-blue-500" />
                        </div>
                        <p className="text-sm text-gray-700">{r.driverName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{r.vehicleLabel}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-gray-400 shrink-0" />
                        <p className="text-sm text-gray-600 max-w-[160px] truncate">
                          {r.pickupAddress}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        <p className="text-sm text-gray-600">{r.duration}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                        {r.status}
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
