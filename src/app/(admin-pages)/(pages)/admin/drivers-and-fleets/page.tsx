"use client";

import {
  ConfirmActionModal,
  DriverInformationModal,
  DriverPendingInfoModal,
} from "@/components/";
import { useAdmin } from "@/store";
import Image from "next/image";
import { useShallow } from "zustand/shallow";
import { useEffect, useState } from "react";
import { Car, Search, Star, UserX } from "lucide-react";

const Page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "active" | "pending" | "suspended"
  >("active");

  const {
    actions: {
      getAllDrivers,
      getpendingKyc,
      getSuspendedDrivers,
      getSingleDriverDetails,
      suspendDriverOrRider,
      reactivateDriverOrRider,
    },
    allDrivers,
    pendingKyc,
    suspendedDrivers,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      pendingKyc: state.pendingKyc,
      allDrivers: state.allDrivers,
      suspendedDrivers: state.suspendedDrivers,
    })),
  );

  useEffect(() => {
    getAllDrivers();
    getpendingKyc();
    getSuspendedDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredDrivers = allDrivers.filter((d) => {
    const q = searchQuery.toLowerCase();
    return (
      d.driver.firstName?.toLowerCase().includes(q) ||
      d.driver.lastName?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q)
    );
  });

  const tabs = [
    {
      key: "active" as const,
      label: "Active drivers",
      count: allDrivers.length,
    },
    {
      key: "pending" as const,
      label: "Pending KYC",
      count: pendingKyc?.drivers.length ?? 0,
    },
    {
      key: "suspended" as const,
      label: "Suspended",
      count: suspendedDrivers.length,
    },
  ];

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-2xl font-bold font-heebo text-gray-900">
          Drivers & Fleets
        </p>
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search drivers..."
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

      {/* Active drivers */}
      {activeTab === "active" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filteredDrivers.length === 0 ? (
            <EmptyState icon={Car} message="No active drivers found" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Driver
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Contact
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Rating
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Date Joined
                    </th>
                    <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDrivers.map((driver, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              driver.driver.driverProfilePictureUri ||
                              "/images/placeholder.jpg"
                            }
                            alt={driver.driver.firstName}
                            width={36}
                            height={36}
                            className="size-9 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {driver.driver.firstName} {driver.driver.lastName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {driver.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {driver.mobileNumber}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Star
                            size={13}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {driver.driver.rating.totalRating.toFixed(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-500 font-mono">
                          {driver.createdAt
                            ? new Date(driver.createdAt).toLocaleDateString()
                            : "—"}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <ConfirmActionModal
                            trigger={
                              <button className="text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                                Suspend
                              </button>
                            }
                            title="Suspend driver"
                            description="Are you sure you want to suspend this driver?"
                            confirmActionFunction={async (values) => {
                              if (!values) return;
                              await suspendDriverOrRider(
                                {
                                  userId: driver.driver.userId,
                                  reason: values.reason!,
                                  suspensionType:
                                    values.suspensionType!.toUpperCase() as
                                      | "TEMPORARY"
                                      | "PERMANENT",
                                  suspensionDuration: Number(
                                    values.suspensionDuration,
                                  ),
                                },
                                "driver",
                              );
                            }}
                            type="suspend"
                          />
                          <DriverInformationModal
                            phoneNumber={driver?.mobileNumber ?? ""}
                            trigger={
                              <button
                                onClick={() =>
                                  getSingleDriverDetails(driver.driver.userId)
                                }
                                className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                View profile
                              </button>
                            }
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
          {!pendingKyc || pendingKyc.drivers.length === 0 ? (
            <EmptyState icon={Car} message="No pending KYC applications" />
          ) : (
            <div className="divide-y divide-gray-50">
              {pendingKyc.drivers.map((driver, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        driver.driverProfilePictureUri ||
                        "/images/placeholder.jpg"
                      }
                      alt={`${driver.firstName} ${driver.lastName}`}
                      width={36}
                      height={36}
                      className="size-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {driver.firstName} {driver.lastName}
                      </p>
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                        Pending review
                      </span>
                    </div>
                  </div>
                  <DriverPendingInfoModal
                    trigger={
                      <button
                        onClick={() => getSingleDriverDetails(driver._id)}
                        className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Review
                      </button>
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Suspended */}
      {activeTab === "suspended" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {suspendedDrivers.length === 0 ? (
            <EmptyState icon={UserX} message="No suspended drivers" />
          ) : (
            <div className="divide-y divide-gray-50">
              {suspendedDrivers.map((driver) => (
                <div
                  key={driver.driver.firstName}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={
                        driver.driver.driverProfilePictureUri ||
                        "/images/placeholder.jpg"
                      }
                      alt="Driver"
                      width={36}
                      height={36}
                      className="size-9 rounded-xl object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {driver.driver.firstName} {driver.driver.lastName}
                      </p>
                      <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                        Suspended
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ConfirmActionModal
                      trigger={
                        <button className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors">
                          Reactivate
                        </button>
                      }
                      title="Reactivate driver"
                      description="Are you sure you want to reactivate this driver?"
                      confirmActionFunction={async () => {
                        await reactivateDriverOrRider(
                          { userId: driver._id },
                          "driver",
                        );
                      }}
                      type="reactivate"
                    />
                    <DriverInformationModal
                      trigger={
                        <button
                          onClick={() => getSingleDriverDetails(driver._id)}
                          className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          View profile
                        </button>
                      }
                    />
                  </div>
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
