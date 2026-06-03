"use client";

import { RolesModal, RolesModalDisplay } from "@/components/";
import { usePermission, useAdmin } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { Shield, Users, ChevronRight } from "lucide-react";

const Page = () => {
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  const {
    actions: {
      getAllActiveAdmins,
      getAllSuspendedAdmins,
      restoreAdmin,
      suspendAdmin,
    },
    allActiveAdmins,
    allSuspendedAdmins,
  } = useAdmin(
    useShallow((state) => ({
      actions: state.actions,
      allActiveAdmins: state.allActiveAdmins,
      allSuspendedAdmins: state.allSuspendedAdmins,
    })),
  );

  const allAdmins = useMemo(
    () => [...allActiveAdmins, ...allSuspendedAdmins],
    [allActiveAdmins, allSuspendedAdmins],
  );

  const {
    actions: {
      getAllRolePermissions,
      getSingleAdminPermissions,
      getSingleRolePermissions,
      grantAdminPermission,
      grantRolePermission,
      revokeAdminPermission,
      revokeRolePermission,
    },
    allRolePermissions,
  } = usePermission(
    useShallow((state) => ({
      actions: state.actions,
      allRolePermissions: state.allRolePermissions,
    })),
  );

  useEffect(() => {
    getAllActiveAdmins();
    getAllSuspendedAdmins();
    getAllRolePermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    { key: "users" as const, label: "User permissions", count: allAdmins.length },
    { key: "roles" as const, label: "Role permissions", count: Object.keys(allRolePermissions ?? {}).length },
  ];

  return (
    <section className="flex flex-col gap-6">
      <p className="text-2xl font-bold font-heebo text-gray-900">Roles & Permissions</p>

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

      {/* Users tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {allAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Users size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No admins found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Admin
                    </th>
                    <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-4">
                      Role
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
                  {allAdmins.map((admin, i) => {
                    const isActive = admin.status === "active";
                    return (
                      <tr
                        key={i}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary uppercase">
                                {(admin.firstName?.[0] ?? "") + (admin.lastName?.[0] ?? "")}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {admin.firstName} {admin.lastName}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg capitalize">
                            {admin.role.toLowerCase().split("_").join(" ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={async () => {
                                if (isActive) {
                                  await suspendAdmin({
                                    adminId: admin.adminId,
                                    reason: "Suspended from roles page",
                                  });
                                } else {
                                  await restoreAdmin({ adminId: admin.adminId });
                                }
                              }}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
                                isActive ? "bg-primary" : "bg-gray-200"
                              }`}
                            >
                              <span
                                className={`inline-block size-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                                  isActive ? "translate-x-4" : "translate-x-0.5"
                                }`}
                              />
                            </button>
                            <span
                              className={`text-xs font-medium ${isActive ? "text-emerald-600" : "text-gray-400"}`}
                            >
                              {isActive ? "Active" : "Suspended"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end">
                            <RolesModal
                              trigger={
                                <button
                                  onClick={async () => await getSingleAdminPermissions(admin.adminId)}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                  <Shield size={12} />
                                  Edit role
                                </button>
                              }
                              onNext={async (CHECKED_IDS, UNCHECKED_IDS) => {
                                await grantAdminPermission({
                                  adminId: admin.adminId,
                                  endpointIds: CHECKED_IDS,
                                  expiresAt: new Date(
                                    Date.now() + 30 * 24 * 60 * 60 * 1000,
                                  ).toISOString(),
                                });
                                await revokeAdminPermission({
                                  adminId: admin.adminId,
                                  endpointIds: UNCHECKED_IDS,
                                });
                              }}
                              role={admin.role.split("_").join(" ")}
                              title={`Edit roles for ${admin.firstName} ${admin.lastName}`}
                              description="Select the roles and permissions you'd like this user to have."
                              type="role"
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Roles tab */}
      {activeTab === "roles" && (
        <div>
          {!allRolePermissions || Object.keys(allRolePermissions).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3">
              <div className="size-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                <Shield size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No roles configured</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(allRolePermissions).map((role) => {
                const roleData = (allRolePermissions ?? {})[role];
                const endpointCount = roleData.endpoints.length;

                return (
                  <div
                    key={role}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Shield size={15} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 capitalize">
                            {role.split("_").join(" ")}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {endpointCount} permission{endpointCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {endpointCount > 0 && (
                      <div className="flex flex-col gap-1">
                        {roleData.endpoints.slice(0, 3).map((endpoint, id) => (
                          <div key={id} className="flex items-center gap-2">
                            <ChevronRight size={12} className="text-gray-300 shrink-0" />
                            <p className="text-xs text-gray-500 truncate">{endpoint.description}</p>
                          </div>
                        ))}
                        {endpointCount > 3 && (
                          <p className="text-xs text-gray-400 ml-5">
                            +{endpointCount - 3} more
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <RolesModal
                        trigger={
                          <button
                            onClick={async () =>
                              await getSingleRolePermissions(
                                role.toUpperCase().split(" ").join("_"),
                              )
                            }
                            className="text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-lg transition-colors flex-1"
                          >
                            Edit permissions
                          </button>
                        }
                        onNext={async (CHECKED_IDS, UNCHECKED_IDS) => {
                          await grantRolePermission({
                            role: role.toUpperCase().split(" ").join("_"),
                            endpointIds: CHECKED_IDS,
                          });
                          await revokeRolePermission({
                            role: role.toUpperCase().split(" ").join("_"),
                            endpointIds: UNCHECKED_IDS,
                          });
                        }}
                        role={role.split("_").join(" ")}
                        title="Assign permission to role"
                        description="Assign permissions you'd like this role to have."
                        type="permission"
                      />
                      <RolesModalDisplay
                        trigger={
                          <button
                            onClick={async () =>
                              await getSingleRolePermissions(
                                role.toUpperCase().split(" ").join("_"),
                              )
                            }
                            className="text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors flex-1"
                          >
                            View all
                          </button>
                        }
                        role={role.split("_").join(" ")}
                        title="Granted permissions"
                        description={`Permissions for the ${role.split("_").join(" ")} role.`}
                        type="permission"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Page;
